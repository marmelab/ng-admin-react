import { EventEmitter } from 'events';
import { fromJS, Map, List } from 'immutable';
import AppDispatcher from '../Services/AppDispatcher';

import ReadQueries from 'admin-config/lib/Queries/ReadQueries';
import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';
import DataStore from 'admin-config/lib/DataStore/DataStore';

import RestWrapper from '../Services/RestWrapper';

class ListStore extends EventEmitter {
    constructor(...args) {
        super(...args);

        this.data = Map({
            pending: true,
            totalItems: 0,
            page: 1,
            entries: List(),
            sortDir: null,
            sortField: null
        });
    }

    loadData(configuration, view, page) {
        page = page || 1;

        this.data = this.data.update('pending', v => true);
        this.data = this.data.update('page', v => page);
        this.emitChange();

        let dataStore = new DataStore();
        let readQueries = new ReadQueries(new RestWrapper(), PromisesResolver, configuration);
        let entity = view.entity;

        readQueries
            .getAll(view, page, [], this.data.get('sortField'), this.data.get('sortDir'))
            .then((response) => {
                this.data = this.data.update('entries', (list) => {
                    list = list.clear();
                    response.data.forEach((rawEntry) => {
                        let entry = dataStore.mapEntry(entity.name(), view.identifier(), view.getFields(), rawEntry);

                        list = list.push(fromJS(entry));
                    });

                    return list;
                });

                this.data = this.data.update('totalItems', v => response.totalItems);
                this.data = this.data.update('pending', v => false);
                this.emitChange();
            }.bind(this));
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
        this.emit('datagrid_load');
    }

    addChangeListener(callback) {
        this.on('datagrid_load', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('datagrid_load', callback);
    }
}

let store = new ListStore();

AppDispatcher.register((action) => {
  switch(action.actionType) {
    case 'load_data':
      store.loadData(action.configuration, action.view, action.page);
      break;
    case 'sort':
      store.sort(action.args);
      break;
  }
});

export default store;
