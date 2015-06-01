'use strict';

import AppDispatcher from '../Services/AppDispatcher';

export default {
    loadData(configuration, view, id, sortField, sortDir) {
        AppDispatcher.dispatch({
            actionType: 'load_show_data',
            configuration: configuration,
            view: view,
            id: id,
            sortField: sortField,
            sortDir: sortDir
        });
    }
};
