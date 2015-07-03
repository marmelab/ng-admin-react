import AppDispatcher from '../Services/AppDispatcher';

export default {
    initFilters(filters) {
        AppDispatcher.dispatch({
            actionType: 'init_filters',
            filters
        });
    },

    showFilter(filter) {
        AppDispatcher.dispatch({
            actionType: 'show_filter',
            filter
        });
    },

    hideFilter(filter) {
        AppDispatcher.dispatch({
            actionType: 'hide_filter',
            filter
        });
    }
};
