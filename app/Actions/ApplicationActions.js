import AppDispatcher from '../Services/AppDispatcher';

export default {
    displayFilter(filter) {
        AppDispatcher.dispatch({
            actionType: 'display_filter',
            filter
        });
    },

    removeFilter(filter) {
        AppDispatcher.dispatch({
            actionType: 'remove_filter',
            filter
        });
    }
};
