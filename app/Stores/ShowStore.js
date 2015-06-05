import { EventEmitter } from 'events';
import { Map } from 'immutable';

import DataStore from 'admin-config/lib/DataStore/DataStore';

import AppDispatcher from '../Services/AppDispatcher';
import EntryRequester from '../Services/EntryRequester';

class ShowStore extends EventEmitter {
    constructor(...args) {
        super(...args);

        this.data = Map({
            dataStore: new DataStore()
        });
    }

    loadData(configuration, view, identifierValue, sortField, sortDir) {
        let entryRequester = new EntryRequester(configuration);

        entryRequester.getEntry(view, identifierValue, { references: true, referencesList: true, sortField, sortDir })
            .then((dataStore) => {
                this.data = this.data.update('dataStore', v => dataStore);
                this.emitChange();
            });
    }

    getState() {
        return { data: this.data };
    }

    emitChange() {
        this.emit('show_load');
    }

    addChangeListener(callback) {
        this.on('show_load', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('show_load', callback);
    }
}

let store = new ShowStore();

AppDispatcher.register((action) => {
    switch(action.actionType) {
        case 'load_show_data':
            store.loadData(action.configuration, action.view, action.id, action.sortField, action.sortDir);
            break;
    }
});

export default store;
