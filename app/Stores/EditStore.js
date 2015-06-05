import { EventEmitter } from 'events';
import { Map } from 'immutable';

import AppDispatcher from '../Services/AppDispatcher';

import WriteQueries from 'admin-config/lib/Queries/WriteQueries';
import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';
import DataStore from 'admin-config/lib/DataStore/DataStore';

import EntryRequester from '../Services/EntryRequester';

class EditStore extends EventEmitter {
    constructor(...args) {
        super(...args);

        this.data = Map({
            originEntityId: null,
            dataStore: Map({
                object: new DataStore(),
                version: 0
            }),
            values: Map()
        });
    }

    loadData(configuration, view, identifierValue, sortField, sortDir) {
        let entryRequester = new EntryRequester(configuration);

        entryRequester.getEntry(view, identifierValue, { references: true, referencesList: true, choices: true, sortField, sortDir })
            .then((dataStore) => {
                this.data = this.data.update('originEntityId', v => identifierValue);
                this.data = this.data.updateIn(['dataStore', 'object'], v => dataStore);
                this.data = this.data.updateIn(['dataStore', 'version'], v => 0);
                this.data = this.data.update('values', v => {
                    v = v.clear();

                    let entry = dataStore.getFirstEntry(view.entity.uniqueId);

                    for (let fieldName in entry.values) {
                        v = v.set(fieldName, entry.values[fieldName]);
                    }

                    return v;
                });
                this.emitChange();
            });
    }

    updateData(fieldName, value) {
        this.data = this.data.updateIn(['values', fieldName], v => value);
        this.emitChange();
    }

    saveData(configuration, view) {
        let rawEntry = {};
        let values = this.data.get('values');
        let id = this.data.get('originEntityId');

        for (let [name, value] of values) {
            rawEntry[name] = value;
        }

        let writeQueries = new WriteQueries(new RestWrapper(), PromisesResolver, configuration);
        writeQueries.updateOne(view, rawEntry, id);

        this.data = this.data.updateIn(['dataStore', 'object'], v => {
            let entry = v.mapEntry(
                view.entity.name(),
                view.identifier(),
                view.getFields(),
                rawEntry
            );

            v.fillReferencesValuesFromEntry(entry, view.getReferences(), true);

            v.setEntries(view.getEntity().uniqueId, [entry]);

            return v;
        });
        this.data = this.data.updateIn(['dataStore', 'version'], v => v + 1);
        this.emitChange();
    }

    getState() {
        return { data: this.data };
    }

    emitChange() {
        this.emit('edit_load');
    }

    addChangeListener(callback) {
        this.on('edit_load', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('edit_load', callback);
    }
}

let store = new EditStore();

AppDispatcher.register((action) => {
    switch(action.actionType) {
        case 'load_edit_data':
            store.loadData(action.configuration, action.view, action.id, action.sortField, action.sortDir);
            break;
        case 'update_edit_data':
            store.updateData(action.fieldName, action.value);
            break;
        case 'save_edit_data':
            store.saveData(action.configuration, action.view);
            break;
    }
});

export default store;
