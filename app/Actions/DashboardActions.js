import AppDispatcher from '../Services/AppDispatcher';

export default {
    loadPanels(configuration) {
        AppDispatcher.dispatch({
            actionType: 'load_panels',
            configuration: configuration
        });
    }
};
