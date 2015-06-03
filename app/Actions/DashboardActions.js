import AppDispatcher from '../Services/AppDispatcher';

export default {
    loadPanels(configuration, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_panels',
            configuration: configuration,
            sortField: sortField,
            sortDir: sortDir
        });
    }
};
