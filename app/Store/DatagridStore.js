import alt from '../alt';

import DatagridActions from '../Actions/DatagridActions';

class DatagridStore {
    constructor() {
        this.bindActions(DatagridActions);
    }

    onSort() {
        this.emitChange();
    }
}

export default alt.createStore(DatagridStore);
