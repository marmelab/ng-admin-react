import { EventEmitter } from 'events';
import { Map, List } from 'immutable';

import AppDispatcher from '../Services/AppDispatcher';

class ApplicationStore extends EventEmitter {
    constructor(...args) {
        super(...args);

        this.initData();
    }

    initData() {
        this.data = Map({
            filters: List()
        });
    }

    displayFilter(filter) {
        let filters = this.data.get('filters');
        filters = filters.push(filter);

        this.data = this.data.update('filters', v => filters);

        this.emitFilterChange();
    }

    removeFilter(filter) {
        let filters = this.data.get('filters');
        let position = filters.findIndex((ind) => {
            return ind.name() === filter.name();
        });

        if (position > -1) {
            filters = filters.delete(position);
        }

        this.data = this.data.update('filters', v => filters);

        this.emitFilterChange();
    }

    getState() {
        return { data: this.data };
    }

    emitFilterChange() {
        this.emit('filter_updated');
    }

    addFilterListener(callback) {
        this.on('filter_updated', callback);
    }

    removeFilterListener(callback) {
        this.removeListener('filter_updated', callback);
    }
}

const store = new ApplicationStore();

AppDispatcher.register((action) => {
    switch(action.actionType) {
        case 'display_filter':
            store.displayFilter(action.filter);
            break;
        case 'remove_filter':
            store.removeFilter(action.filter);
            break;
    }
});

export default store;
