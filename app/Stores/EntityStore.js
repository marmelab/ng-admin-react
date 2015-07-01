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
            sortField: null,
            filters: null,
            resourceNotFound: false
        });
    }

    flagResourceNotFound() {
        this.data = this.data.update('resourceNotFound', () => true);
        this.emitChange();
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
                if (0 === responses.length) {
                    return;
                }

                this.data = this.data.update('panels', () => panels);
                this.data = this.data.updateIn(['dataStore', 'object'], () => dataStore);
                this.data = this.data.update('sortDir', () => sortDir);
                this.data = this.data.update('sortField', () => sortField);
                this.emitChange();
            })
            .catch(this.throwPromiseError);
    }

    loadListData(restful, configuration, view, page = 1, sortField = null, sortDir = null, filters = null) {
        this.initData();
        this.emitChange();

        this.data = this.data.update('page', () => page);
        this.data = this.data.update('sortField', () => sortField);
        this.data = this.data.update('sortDir', () => sortDir);
        this.data = this.data.update('filters', () => filters);

        this.getEntryRequester(restful, configuration)
            .getEntries(new DataStore(), view, page, {
                references: true,
                choices: true,
                sortField,
                sortDir,
                filters
            }).then((collection) => {
                this.data = this.data.updateIn(['dataStore', 'object'], () => collection.dataStore);
                this.data = this.data.update('totalItems', () => collection.totalItems);
                this.emitChange();
            }, this.emitReadFailure.bind(this))
            .catch(this.throwPromiseError);
    }

    loadShowData(restful, configuration, view, identifierValue, sortField, sortDir) {
        this.initData();
        this.emitChange();

        this.getEntryRequester(restful, configuration)
            .getEntry(view, identifierValue, { references: true, referencesList: true, sortField, sortDir })
            .then((dataStore) => {
                this.data = this.data.updateIn(['dataStore', 'object'], () => dataStore);
                this.emitChange();
            }, this.emitReadFailure.bind(this))
            .catch(this.throwPromiseError);
    }

    loadEditData(restful, configuration, view, identifierValue, sortField, sortDir) {
        this.initData();
        this.emitChange();

        this.getEntryRequester(restful, configuration)
            .getEntry(view, identifierValue, { references: true, referencesList: true, choices: true, sortField, sortDir })
            .then((dataStore) => {
                this.data = this.data.update('originEntityId', () => identifierValue);
                this.data = this.data.updateIn(['dataStore', 'object'], () => dataStore);
                this.data = this.data.updateIn(['dataStore', 'version'], () => 0);
                this.data = this.data.update('values', v => {
                    v = v.clear();

                    let entry = dataStore.getFirstEntry(view.entity.uniqueId);

                    for (let fieldName in entry.values) {
                        v = v.set(fieldName, entry.values[fieldName]);
                    }

                    return v;
                });
                this.emitChange();
            }, this.emitReadFailure.bind(this))
            .catch(this.throwPromiseError);
    }

    loadCreateData(restful, configuration, view) {
        this.initData();
        this.emitChange();

        this.getEntryRequester(restful, configuration)
            .createEntry(view)
            .then((dataStore) => {
                this.data = this.data.updateIn(['dataStore', 'object'], () => dataStore);
                this.data = this.data.update('values', v => {
                    v = v.clear();

                    let entry = dataStore.getFirstEntry(view.entity.uniqueId);

                    for (let fieldName in entry.values) {
                        v = v.set(fieldName, entry.values[fieldName]);
                    }

                    return v;
                });
                this.emitChange();
            }, this.emitReadFailure.bind(this))
            .catch(this.throwPromiseError);
    }

    loadDeleteData(restful, configuration, view, identifierValue) {
        this.initData();
        this.emitChange();

        this.getEntryRequester(restful, configuration)
            .getEntry(view, identifierValue, { references: true, referencesList: false, choices: false })
            .then((dataStore) => {
                this.data = this.data.update('originEntityId', () => identifierValue);
                this.data = this.data.updateIn(['dataStore', 'object'], () => dataStore);
                this.data = this.data.updateIn(['dataStore', 'version'], () => 0);

                this.emitChange();
            }, this.emitReadFailure.bind(this))
            .catch(this.throwPromiseError);
    }

    updateData(fieldName, value, choiceFields=[]) {
        this.data = this.data.updateIn(['values', fieldName], () => value);

        // Handle related values between choice fields
        if (choiceFields.length) {
            choiceFields.map((field) => {
                if (fieldName === field.name()) {
                    return;
                }

                let choices = field.choices();
                if ('function' === typeof choices) {
                    choices = choices({ values: this.data.get('values').toJS() });
                }

                let valueInChoices = false;
                choices.map((v) => {
                    if (v.value === this.data.getIn(['values', field.name()])) {
                        valueInChoices = true;
                    }
                });

                if (!valueInChoices) {
                    this.data = this.data.updateIn(['values', field.name()], () => null);
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
                this.data = this.data.updateIn(['dataStore', 'object'], () => dataStore);
                this.data = this.data.updateIn(['dataStore', 'version'], v => v + 1);

                if (id) {
                    this.emitUpdate();
                    this.emitChange();
                } else {
                    this.emitCreate();
                }
            }, this.emitWriteFailure.bind(this))
            .catch(this.throwPromiseError);
    }

    deleteData(restful, configuration, id, view) {
        this.getEntryRequester(restful, configuration)
            .deleteEntry(view, id)
            .then(this.emitDelete.bind(this), this.emitWriteFailure.bind(this))
            .catch(this.throwPromiseError);
    }

    getState() {
        return { data: this.data };
    }

    emitChange() {
        this.emit('entries_loaded');
    }

    emitReadFailure(response) {
        this.emit('read_failure', response);
    }

    emitDelete() {
        this.emit('entries_deleted');
    }

    emitCreate() {
        this.emit('entries_created');
    }

    emitUpdate() {
        this.emit('entries_updated');
    }

    emitWriteFailure(response) {
        this.emit('write_failure', response);
    }

    addChangeListener(callback) {
        this.on('entries_loaded', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('entries_loaded', callback);
    }

    addReadFailureListener(callback) {
        this.on('read_failure', callback);
    }

    removeReadFailureListener(callback) {
        this.removeListener('read_failure', callback);
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

    addWriteFailureListener(callback) {
        this.on('write_failure', callback);
    }

    removeWriteFailureListener(callback) {
        this.removeListener('write_failure', callback);
    }

    throwPromiseError(e) {
        if (console) {
            console.error(e);
        }
    }
}

const store = new EntityStore();

AppDispatcher.register((action) => {
    switch(action.actionType) {
        case 'load_dashboard_panels':
            store.loadDashbordPanels(action.restful, action.configuration, action.sortField, action.sortDir);
            break;
        case 'load_list_data':
            store.loadListData(action.restful, action.configuration, action.view, action.page, action.sortField, action.sortDir, action.search);
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
        case 'resource_not_found':
            store.flagResourceNotFound(action.found);
            break;
    }
});

export default store;
