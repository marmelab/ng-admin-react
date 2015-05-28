import AppDispatcher from '../Services/AppDispatcher';

export default {
    loadData(configuration, view, page) {
        AppDispatcher.dispatch({
            actionType: 'load_data',
            configuration: configuration,
            view: view,
            page: page
        });
    },

    sort(args) {
        AppDispatcher.dispatch({
            actionType: 'sort',
            args: args
        });
    }
};
