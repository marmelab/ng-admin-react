import { EventEmitter } from 'events';
import { Map } from 'immutable';

import DataStore from 'admin-config/lib/DataStore/DataStore';

import EntryRequester from '../Services/EntryRequester';
import AppDispatcher from '../Services/AppDispatcher';

class ListStore extends EventEmitter {
    constructor(...args) {
        super(...args);

        this.data = Map({
            totalItems: 0,
            page: 1,
            dataStore: new DataStore(),
            sortDir: null,
            sortField: null
        });
    }

    loadData(configuration, view, page, sortField, sortDir) {
        page = page || 1;

        let entryRequester = new EntryRequester(configuration);

        this.data = this.data.update('page', v => page);
        this.data = this.data.update('sortField', v => sortField);
        this.data = this.data.update('sortDir', v => sortDir);
        this.emitChange();

        entryRequester.getEntries(new DataStore(), view, page, {
            references: true,
            sortField,
            sortDir
        }).then((collection) => {
            this.data = this.data.update('dataStore', v => collection.dataStore);
            this.data = this.data.update('totalItems', v => collection.totalItems);
            this.emitChange();
        });
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
      store.loadData(action.configuration, action.view, action.page, action.sortField, action.sortDir);
      break;
  }
});

export default store;
