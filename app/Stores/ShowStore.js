import { EventEmitter } from 'events';
import { fromJS, Map, List } from 'immutable';
import objectAssign from 'object-assign';

import AppDispatcher from '../Services/AppDispatcher';

import ReadQueries from 'admin-config/lib/Queries/ReadQueries';
import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';
import DataStore from 'admin-config/lib/DataStore/DataStore';

import RestWrapper from '../Services/RestWrapper';

class ShowStore extends EventEmitter {
    constructor(...args) {
        super(...args);

        this.data = Map({
            pending: true,
            dataStore: List()
        });
    }

    loadData(configuration, view, identifierValue) {
        this.data = this.data.update('pending', v => true);
        this.emitChange();

        let dataStore = new DataStore();
        let readQueries = new ReadQueries(new RestWrapper(), PromisesResolver, configuration);
        let rawEntry, nonOptimizedReferencedData, optimizedReferencedData;

        readQueries
            .getOne(view, view.type, identifierValue, view.identifier(), view.getUrl())
            .then((response) => {
                rawEntry = response.data;

                return dataStore.mapEntry(
                    view.entity.name(),
                    view.identifier(),
                    view.getFields(),
                    rawEntry
                );
            }, this)
            .then((rawEntry) => {
                return readQueries.getFilteredReferenceData(view.getNonOptimizedReferences(), [rawEntry]);
            })
            .then((nonOptimizedReference) => {
                nonOptimizedReferencedData = nonOptimizedReference;

                return readQueries.getOptimizedReferencedData(view.getOptimizedReferences(), [rawEntry]);
            })
            .then((optimizedReference) => {
                optimizedReferencedData = optimizedReference;

                var references = view.getReferences(),
                    referencedData = objectAssign(nonOptimizedReferencedData, optimizedReferencedData),
                    referencedEntries;

                for (var name in referencedData) {
                    referencedEntries = dataStore.mapEntries(
                        references[name].targetEntity().name(),
                        references[name].targetEntity().identifier(),
                        [references[name].targetField()],
                        referencedData[name]
                    );

                    dataStore.setEntries(
                        references[name].targetEntity().uniqueId + '_values',
                        referencedEntries
                    );
                }
            })
            .then(() => {
                this.data = this.data.update('dataStore', v => dataStore);
                this.data = this.data.update('pending', v => false);
                this.emitChange();
            }, this);
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
        case 'load_data':
            store.loadData(action.configuration, action.view, action.id);
            break;
    }
});

export default store;
