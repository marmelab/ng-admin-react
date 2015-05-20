import AppDispatcher from '../Services/AppDispatcher';

export default {
    loadData(view) {
        AppDispatcher.dispatch({
            actionType: 'load_data',
            view: view
        });
    },

    sort(args) {
        AppDispatcher.dispatch({
            actionType: 'sort',
            args: args
        });
    }
}
