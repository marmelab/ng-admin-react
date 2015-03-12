import alt from '../alt';

import DatagridActions from '../Actions/DatagridActions';

class DatagridStore {
    constructor() {
        this.bindActions(DatagridActions);
        this.entries = [
            { id: 1, name: "Foo", published: "true" },
            { id: 2, name: "Bar", published: "false" }
        ];
    }

    onSort() {
        this.entries = [this.entries[1], this.entries[0]];
        this.emitChange();
    }
}

export default alt.createStore(DatagridStore);
