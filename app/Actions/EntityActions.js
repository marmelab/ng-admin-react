import AppDispatcher from '../Services/AppDispatcher';

export default {
    loadDashboardPanels(restful, configuration, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_dashboard_panels',
            restful,
            configuration,
            sortField,
            sortDir
        });
    },

    loadListData(restful, configuration, view, page, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_list_data',
            restful,
            configuration,
            view,
            page,
            sortField,
            sortDir
        });
    },

    loadShowData(restful, configuration, view, id, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_show_data',
            restful,
            configuration,
            view,
            id,
            sortField,
            sortDir
        });
    },

    loadEditData(restful, configuration, view, id, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_edit_data',
            restful,
            configuration,
            view,
            id,
            sortField,
            sortDir
        });
    },

    loadCreateData(restful, configuration, view) {
        AppDispatcher.dispatch({
            actionType: 'load_create_data',
            restful,
            configuration,
            view
        });
    },

    loadDeleteData(restful, configuration, view, id) {
        AppDispatcher.dispatch({
            actionType: 'load_delete_data',
            restful,
            configuration,
            view,
            id
        });
    },

    updateData(fieldName, value, choiceFields=[]) {
        AppDispatcher.dispatch({
            actionType: 'update_data',
            fieldName,
            value,
            choiceFields
        });
    },

    saveData(restful, configuration, view) {
        AppDispatcher.dispatch({
            actionType: 'save_data',
            restful,
            configuration,
            view
        });
    },

    deleteData(restful, configuration, id, view) {
        AppDispatcher.dispatch({
            actionType: 'delete_data',
            restful,
            configuration,
            id,
            view
        });
    }
};
