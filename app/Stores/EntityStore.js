import { EventEmitter } from 'events';
import { Map, List } from 'immutable';

import AppDispatcher from '../Services/AppDispatcher';

import WriteQueries from 'admin-config/lib/Queries/WriteQueries';
import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';
import DataStore from 'admin-config/lib/DataStore/DataStore';

import EntryRequester from '../Services/EntryRequester';
import RestWrapper from '../Services/RestWrapper';

class EntityStore extends EventEmitter {
    constructor(...args) {
        super(...args);

        this.initData();
    }

    initData() {
        this.data = Map({
            panels: List(),
            originEntityId: null,
            dataStore: Map({
                object: new DataStore(),
                version: 0
            }),
            values: Map(),
            totalItems: 0,
            page: 1,
            sortDir: null,
            sortField: null
        });
    }

    loadDashbordPanels(configuration, sortField, sortDir) {
        this.initData();
        this.emitChange();

        let entryRequester = new EntryRequester(configuration);
        let dashboardViews = configuration.getViewsOfType('DashboardView');
        let panels = List();
        let dataStore = new DataStore();
        let promises = [];

        let i,
            view,
            entity,
            dashboardSortField,
            dashboardSortDir;

        for (i in dashboardViews) {
            view = dashboardViews[i];
            entity = view.entity;
            dashboardSortField = null;
            dashboardSortDir = null;

            if (sortField && sortField.split('.')[0] === view.name()) {
                dashboardSortField = sortField;
                dashboardSortDir = sortDir;
            }

            panels = panels.push(Map({
                label: view.title() || entity.label(),
                view: view,
                entity: entity,
                sortDir: view.sortDir(),
                sortField: view.sortField()
            }));

            promises.push(entryRequester.getEntries(dataStore, view, 1, {
                references: true,
                sortField: dashboardSortField,
                sortDir: dashboardSortDir
            }));
        }

        PromisesResolver.allEvenFailed(promises)
            .then((responses) => {
                if (responses.length === 0) {
                    return;
                }

                this.data = this.data.update('panels', v => panels);
                this.data = this.data.updateIn(['dataStore', 'object'], v => dataStore);
                this.data = this.data.update('sortDir', v => sortDir);
                this.data = this.data.update('sortField', v => sortField);
                this.emitChange();
            });
    }

    loadListData(configuration, view, page, sortField, sortDir) {
        this.initData();
        this.emitChange();

        page = page || 1;

        this.data = this.data.update('page', v => page);
        this.data = this.data.update('sortField', v => sortField);
        this.data = this.data.update('sortDir', v => sortDir);

        let entryRequester = new EntryRequester(configuration);

        entryRequester.getEntries(new DataStore(), view, page, {
            references: true,
            sortField,
            sortDir
        }).then((collection) => {
            this.data = this.data.updateIn(['dataStore', 'object'], v => collection.dataStore);
            this.data = this.data.update('totalItems', v => collection.totalItems);
            this.emitChange();
        });
    }

    loadShowData(configuration, view, identifierValue, sortField, sortDir) {
        this.initData();
        this.emitChange();

        let entryRequester = new EntryRequester(configuration);

        entryRequester.getEntry(view, identifierValue, { references: true, referencesList: true, sortField, sortDir })
            .then((dataStore) => {
                this.data = this.data.updateIn(['dataStore', 'object'], v => dataStore);
                this.emitChange();
            });
    }

    loadEditData(configuration, view, identifierValue, sortField, sortDir) {
        this.initData();
        this.emitChange();

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

        // TODO: move this one into ApiRequester
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
        this.emit('entries_loaded');
    }

    addChangeListener(callback) {
        this.on('entries_loaded', callback);
    }

    removeChangeListener() {
        this.removeAllListeners();
    }
}

let store = new EntityStore();

AppDispatcher.register((action) => {
    switch(action.actionType) {
        case 'load_dashboard_panels':
            store.loadDashbordPanels(action.configuration, action.sortField, action.sortDir);
            break;
        case 'load_list_data':
            store.loadListData(action.configuration, action.view, action.page, action.sortField, action.sortDir);
            break;
        case 'load_show_data':
            store.loadShowData(action.configuration, action.view, action.id, action.sortField, action.sortDir);
            break;
        case 'load_edit_data':
            store.loadEditData(action.configuration, action.view, action.id, action.sortField, action.sortDir);
            break;
        case 'update_data':
            store.updateData(action.fieldName, action.value);
            break;
        case 'save_data':
            store.saveData(action.configuration, action.view);
            break;
    }
});

export default store;
