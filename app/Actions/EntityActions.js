import AppDispatcher from '../Services/AppDispatcher';

export default {
    loadDashboardPanels(configuration, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_dashboard_panels',
            configuration,
            sortField,
            sortDir
        });
    },

    loadListData(configuration, view, page, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_list_data',
            configuration,
            view,
            page,
            sortField,
            sortDir
        });
    },

    loadShowData(configuration, view, id, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_show_data',
            configuration,
            view,
            id,
            sortField,
            sortDir
        });
    },

    loadEditData(configuration, view, id, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_edit_data',
            configuration,
            view,
            id,
            sortField,
            sortDir
        });
    },

    updateData(fieldName, value) {
        AppDispatcher.dispatch({
            actionType: 'update_data',
            fieldName,
            value
        });
    },

    saveData(configuration, view) {
        AppDispatcher.dispatch({
            actionType: 'save_data',
            configuration,
            view
        });
    },

    deleteData(configuration, id, view) {
        AppDispatcher.dispatch({
            actionType: 'delete_data',
            configuration,
            id,
            view
        });
    }
};
