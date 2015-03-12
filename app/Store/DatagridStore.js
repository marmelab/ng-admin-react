import alt from '../alt';

import ApiRequester from '../Services/ApiRequester';
import DatagridActions from '../Actions/DatagridActions';

class DatagridStore {
    constructor() {
        this.bindActions(DatagridActions);
        this.entries = [];
    }

    loadData(args) {
        ApiRequester.getAll(args[0], args[1])
            .then(function(data) {
                this.entries = data;
                this.emitChange();
            }.bind(this));
    }

    onSort() {
        this.emitChange();
    }
}

export default alt.createStore(DatagridStore);
