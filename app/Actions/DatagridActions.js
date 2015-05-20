
export default {
    loadData: function(view) {
        this.dispatch('load_data', view);
    },

    sort: function(args) {
        this.dispatch('sort', args);
    }
};
