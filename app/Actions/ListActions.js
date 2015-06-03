import AppDispatcher from '../Services/AppDispatcher';

export default {
    loadData(configuration, view, page, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_data',
            configuration: configuration,
            view: view,
            page: page,
            sortField: sortField,
            sortDir: sortDir
        });
    }
};
