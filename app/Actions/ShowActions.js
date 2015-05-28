import AppDispatcher from '../Services/AppDispatcher';

export default {
    loadData(configuration, view, id) {
        AppDispatcher.dispatch({
            actionType: 'load_data',
            configuration: configuration,
            view: view,
            id: id
        });
    }
};
