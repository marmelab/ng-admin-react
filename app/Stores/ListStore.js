'use strict';

import { EventEmitter } from 'events';
import { fromJS, Map, List } from 'immutable';
import objectAssign from 'object-assign';

import AppDispatcher from '../Services/AppDispatcher';

import ReadQueries from 'admin-config/lib/Queries/ReadQueries';
import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';
import DataStore from 'admin-config/lib/DataStore/DataStore';

import RestWrapper from '../Services/RestWrapper';

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

        this.data = this.data.update('page', v => page);
        this.data = this.data.update('sortField', v => sortField);
        this.data = this.data.update('sortDir', v => sortDir);

        this.emitChange();

        let dataStore = new DataStore();
        let readQueries = new ReadQueries(new RestWrapper(), PromisesResolver, configuration);
        let entity = view.entity;
        let rawEntries, nonOptimizedReferencedData, optimizedReferencedData;

        readQueries
            .getAll(view, page, [], this.data.get('sortField'), this.data.get('sortDir'))
            .then((response) => {
                rawEntries = response.data;

                this.data = this.data.update('totalItems', v => +response.totalItems);

                return rawEntries;
            }, this)
            .then((rawEntries) => {
                return readQueries.getFilteredReferenceData(view.getNonOptimizedReferences(), rawEntries);
            })
            .then((nonOptimizedReference) => {
                nonOptimizedReferencedData = nonOptimizedReference;

                return readQueries.getOptimizedReferencedData(view.getOptimizedReferences(), rawEntries);
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
                this.data = this.data.update('dataStore', v => {
                    let entries = v.mapEntries(entity.name(), view.identifier(), view.getFields(), rawEntries);

                    // shortcut to diplay collection of entry with included referenced values
                    v.fillReferencesValuesFromCollection(entries, view.getReferences(), true);

                    v.setEntries(
                        entity.uniqueId,
                        entries
                    );

                    return v;
                });
                this.emitChange();
            }, this);
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
