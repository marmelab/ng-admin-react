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
            panels: null,
            dataStore: new DataStore()
        });
    }

    loadPanels(configuration, sortField, sortDir) {
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
            entries,
            dashboardSortField,
            dashboardSortDir;

        for (i in dashboardViews) {
            view = dashboardViews[i];
            entity = view.getEntity();
            dashboardSortField = null;
            dashboardSortDir = null;

            if (sortField && sortField.split('.')[0] === view.name()) {
                dashboardSortField = sortField;
                dashboardSortDir = sortDir;
            }

            panels = panels.push(Map({
                label: view.title() || entity.label(),
                view: view,
                entity: view.entity,
                sortDir: view.sortDir(),
                sortField: view.sortField()
            }));

            promises.push(readQueries.getAll(view, 1, [], dashboardSortField, dashboardSortDir));
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
                this.data = this.data.update('sortDir', v => sortDir);
                this.data = this.data.update('sortField', v => sortField);
                this.emitChange();
            }, this);
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
      store.loadPanels(action.configuration, action.sortField, action.sortDir);
      break;
  }
});

export default store;
