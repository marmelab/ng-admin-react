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
            filters: Map({
                selected: List([]),
                unselected: List([])
            })
        });
    }

    initFilters(filters) {
        this.data = this.data.updateIn(['filters', 'selected'], () => List(filters.selected));
        this.data = this.data.updateIn(['filters', 'unselected'], () => List(filters.unselected));

        this.emitFilterChange();
    }

    showFilter(filter) {
        this.data = this.data.updateIn(['filters', 'selected'], filters => filters.push(filter));
        this.data = this.data.updateIn(['filters', 'unselected'], filters => filters.filterNot(f => filter.name() === f.name()));

        this.emitFilterChange();
    }

    hideFilter(filter) {
        this.data = this.data.updateIn(['filters', 'unselected'], filters => filters.push(filter));
        this.data = this.data.updateIn(['filters', 'selected'], filters => filters.filterNot(f => filter.name() === f.name()));

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
        case 'init_filters':
            store.initFilters(action.filters);
            break;
        case 'show_filter':
            store.showFilter(action.filter);
            break;
        case 'hide_filter':
            store.hideFilter(action.filter);
            break;
    }
});

export default store;
