import { EventEmitter } from 'events';
import { Map, List } from 'immutable';

import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';
import DataStore from 'admin-config/lib/DataStore/DataStore';

import AppDispatcher from '../Services/AppDispatcher';
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

    getEntryRequester(restful, configuration) {
        return new EntryRequester(configuration, new RestWrapper(restful));
    }

    loadDashbordPanels(restful, configuration, sortField, sortDir) {
        this.initData();
        this.emitChange();

        const entryRequester = this.getEntryRequester(restful, configuration);
        const dashboardViews = configuration.getViewsOfType('DashboardView');
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

    loadListData(restful, configuration, view, page = 1, sortField = null, sortDir = null) {
        this.initData();
        this.emitChange();

        this.data = this.data.update('page', v => page);
        this.data = this.data.update('sortField', v => sortField);
        this.data = this.data.update('sortDir', v => sortDir);

        this.getEntryRequester(restful, configuration)
            .getEntries(new DataStore(), view, page, {
                references: true,
                sortField,
                sortDir
            }).then((collection) => {
                this.data = this.data.updateIn(['dataStore', 'object'], v => collection.dataStore);
                this.data = this.data.update('totalItems', v => collection.totalItems);
                this.emitChange();
            }, this.emitResponseFailure.bind(this));
    }

    loadShowData(restful, configuration, view, identifierValue, sortField, sortDir) {
        this.initData();
        this.emitChange();

        this.getEntryRequester(restful, configuration)
            .getEntry(view, identifierValue, { references: true, referencesList: true, sortField, sortDir })
            .then((dataStore) => {
                this.data = this.data.updateIn(['dataStore', 'object'], v => dataStore);
                this.emitChange();
            }, this.emitResponseFailure.bind(this));
    }

    loadEditData(restful, configuration, view, identifierValue, sortField, sortDir) {
        this.initData();
        this.emitChange();

        this.getEntryRequester(restful, configuration)
            .getEntry(view, identifierValue, { references: true, referencesList: true, choices: true, sortField, sortDir })
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
            }, this.emitResponseFailure.bind(this));
    }

    loadCreateData(restful, configuration, view) {
        this.initData();
        this.emitChange();

        this.getEntryRequester(restful, configuration)
            .createEntry(view)
            .then((dataStore) => {
                this.data = this.data.updateIn(['dataStore', 'object'], v => dataStore);
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

    loadDeleteData(restful, configuration, view, identifierValue) {
        this.initData();
        this.emitChange();

        this.getEntryRequester(restful, configuration)
            .getEntry(view, identifierValue, { references: true, referencesList: false, choices: false })
            .then((dataStore) => {
                this.data = this.data.update('originEntityId', v => identifierValue);
                this.data = this.data.updateIn(['dataStore', 'object'], v => dataStore);
                this.data = this.data.updateIn(['dataStore', 'version'], v => 0);

                this.emitChange();
            }, this.emitResponseFailure.bind(this));
    }

    updateData(fieldName, value, choiceFields=[]) {
        this.data = this.data.updateIn(['values', fieldName], v => value);

        // Handle related values between choice fields
        if (choiceFields.length) {
            choiceFields.map((field) => {
                if (fieldName === field.name()) {
                    return;
                }

                let choices = field.choices();
                if (typeof(choices) === 'function') {
                    choices = choices({ values: this.data.get('values').toJS() });
                }

                let valueInChoices = false;
                choices.map((v) => {
                    if (v.value === this.data.getIn(['values', field.name()])) {
                        valueInChoices = true;
                    }
                });

                if (!valueInChoices) {
                    this.data = this.data.updateIn(['values', field.name()], v => null);
                }
            });
        }

        this.emitChange();
    }

    saveData(restful, configuration, view) {
        const values = this.data.get('values');
        const id = this.data.get('originEntityId');

        let rawEntry = {};
        for (let [name, value] of values) {
            rawEntry[name] = value;
        }

        this.getEntryRequester(restful, configuration)
            .saveEntry(this.data.getIn(['dataStore', 'object']), view, rawEntry, id)
            .then((dataStore) => {
                this.data = this.data.updateIn(['dataStore', 'object'], v => dataStore);
                this.data = this.data.updateIn(['dataStore', 'version'], v => v + 1);

                if (id) {
                    this.emitUpdate();
                    this.emitChange();
                } else {
                    this.emitCreate();
                }
            }, this.emitResponseFailure.bind(this));
    }

    deleteData(restful, configuration, id, view) {
        this.getEntryRequester(restful, configuration)
            .deleteEntry(view, id)
            .then(this.emitDelete.bind(this), this.emitResponseFailure.bind(this));
    }

    getState() {
        return { data: this.data };
    }

    emitChange() {
        this.emit('entries_loaded');
    }

    emitDelete() {
        this.emit('entries_deleted');
    }

    emitResponseFailure(response) {
        this.emit('action_failure', response);
    }

    emitCreate() {
        this.emit('entries_created');
    }

    emitUpdate() {
        this.emit('entries_updated');
    }

    addChangeListener(callback) {
        this.on('entries_loaded', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('entries_loaded', callback);
    }

    addCreateListener(callback) {
        this.on('entries_created', callback);
    }

    removeCreateListener(callback) {
        this.removeListener('entries_created', callback);
    }

    addUpdateListener(callback) {
        this.on('entries_updated', callback);
    }

    removeUpdateListener(callback) {
        this.removeListener('entries_updated', callback);
    }

    addDeleteListener(callback) {
        this.on('entries_deleted', callback);
    }

    removeDeleteListener(callback) {
        this.removeListener('entries_deleted', callback);
    }

    addFailureListener(callback) {
        this.on('action_failure', callback);
    }

    removeFailureListener(callback) {
        this.removeListener('action_failure', callback);
    }
}

const store = new EntityStore();

AppDispatcher.register((action) => {
    switch(action.actionType) {
        case 'load_dashboard_panels':
            store.loadDashbordPanels(action.restful, action.configuration, action.sortField, action.sortDir);
            break;
        case 'load_list_data':
            store.loadListData(action.restful, action.configuration, action.view, action.page, action.sortField, action.sortDir);
            break;
        case 'load_show_data':
            store.loadShowData(action.restful, action.configuration, action.view, action.id, action.sortField, action.sortDir);
            break;
        case 'load_edit_data':
            store.loadEditData(action.restful, action.configuration, action.view, action.id, action.sortField, action.sortDir);
            break;
        case 'load_create_data':
            store.loadCreateData(action.restful, action.configuration, action.view);
            break;
        case 'load_delete_data':
            store.loadDeleteData(action.restful, action.configuration, action.view, action.id);
            break;
        case 'update_data':
            store.updateData(action.fieldName, action.value, action.choiceFields);
            break;
        case 'delete_data':
            store.deleteData(action.restful, action.configuration, action.id, action.view);
            break;
        case 'save_data':
            store.saveData(action.restful, action.configuration, action.view);
            break;
    }
});

export default store;
