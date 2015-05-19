import Fluxxor from 'fluxxor';

import ApiRequester from '../Services/ApiRequester';

export default Fluxxor.createStore({
    initialize: function() {
        this.entries = [];
        this.sortDir = null;
        this.sortField = null;

        this.bindActions(
            'load_data', this.loadData,
            'sort', this.sort
        );
    },

    loadData: function(view) {
        var sortField = this.sortField || view.sortField() || 'id';
        var sortDir = this.sortDir || view.sortDir() || 'DESC';

        ApiRequester
            .getAll(view, 1, true, [], sortField, sortDir)
            .then(function(data) {
                this.entries = data;
                this.emit('change');
            }.bind(this));
    },

    sort: function(args) {
        this.sortDir = args.sortDir;
        this.sortField = args.sortField;

        return this.loadData(args.view);
    },

    getState: function() {
        return {
            entries: this.entries,
            sortDir: this.sortDir,
            sortField: this.sortField
        };
    }
});
