import alt from '../alt';

import ApiRequester from '../Services/ApiRequester';
import DatagridActions from '../Actions/DatagridActions';

class DatagridStore {
    constructor() {
        this.bindActions(DatagridActions);

        this.entries = [];
        this.sortDir = null;
        this.sortField = null;
    }

    loadData(view) {
        var sortField = this.sortField || view.sortField() || 'id';
        var sortDir = this.sortDir || view.sortDir() || 'DESC';

        ApiRequester.getAll(view, 1, true, [], sortField, sortDir)
            .then(function(data) {
                this.entries = data;
                this.emitChange();
            }.bind(this));
    }

    sort(args) {
        this.sortDir = args.sortDir;
        this.sortField = args.sortField;

        return this.loadData(args.view);
    }
}

export default alt.createStore(DatagridStore);
