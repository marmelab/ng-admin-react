import { EventEmitter } from 'events';
import { fromJS, Map, List } from 'immutable';
import AppDispatcher from '../Services/AppDispatcher';

import ReadQueries from 'admin-config/lib/Queries/ReadQueries';
import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';
import DataStore from 'admin-config/lib/DataStore/DataStore';

import RestWrapper from '../Services/RestWrapper';

class DashboardStore extends EventEmitter {
    constructor(...args) {
        super(...args);

        this.data = Map({
            pending: true,
            panels: null,
            dataStore: null
        });
    }

    loadPanels(configuration) {
        this.data = this.data.update('pending', v => true);
        this.emitChange();

        let dataStore = new DataStore();
        let dashboardViews = configuration.getViewsOfType('DashboardView');
        let panels = List();
        let promises = [];
        let readQueries = new ReadQueries(new RestWrapper(), PromisesResolver, configuration);
        let i,
            view,
            entity,
            response,
            entries;

        for (i in dashboardViews) {
            view = dashboardViews[i];
            entity = view.getEntity();

            panels = panels.push(Map({
                label: view.title() || entity.label(),
                view: view,
                entity: view.entity,
                sortDir: view.sortDir(),
                sortField: view.sortField()
            }));

            promises.push(readQueries.getAll(view, 1, [], view.sortField(), view.sortDir()));
        }

        PromisesResolver.allEvenFailed(promises)
            .then((responses) => {
                if (responses.length === 0) {
                    return;
                }

                panels.forEach((panel, key) => {
                    response = responses[key];
                    if (response.status === 'error') {
                        // the response failed
                        return;
                    }

                    entries = dataStore.mapEntries(
                        panel.get('entity').name(),
                        panel.get('entity').identifier(),
                        panel.get('view').getFields(),
                        response.result.data
                    );

                    dataStore.setEntries(
                        panel.get('entity').uniqueId,
                        entries
                    );
                });

                this.data = this.data.update('panels', v => panels);
                this.data = this.data.update('dataStore', v => dataStore);
                this.data = this.data.update('pending', v => false);
                this.emitChange();
            }, this);
    }

    sort(args) {
        this.data = this.data.update('sortDir', v => args.sortDir);
        this.data = this.data.update('sortField', v => args.sortField);

        return this.loadData(args.configuration, args.view, this.data.get('page'));
    }

    getState() {
        return { data: this.data };
    }

    emitChange() {
        this.emit('panels_loaded');
    }

    addChangeListener(callback) {
        this.on('panels_loaded', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('panels_loaded', callback);
    }
}

let store = new DashboardStore();

AppDispatcher.register((action) => {
  switch(action.actionType) {
    case 'load_panels':
      store.loadPanels(action.configuration);
      break;
    case 'sort_panel':
      store.sort(action.args);
      break;
  }
});

export default store;
