import AppDispatcher from '../Services/AppDispatcher';

export default {
    loadData(configuration, view, id, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_edit_data',
            configuration: configuration,
            view: view,
            id: id,
            sortField: sortField,
            sortDir: sortDir
        });
    },

    updateData(fieldName, value) {
        AppDispatcher.dispatch({
            actionType: 'update_edit_data',
            fieldName: fieldName,
            value: value
        });
    },

    saveData(configuration, view) {
        AppDispatcher.dispatch({
            actionType: 'save_edit_data',
            configuration: configuration,
            view: view
        });
    }
};
