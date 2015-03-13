import alt from '../alt';

class DatagridActions {
    constructor() {
        this.generateActions(
            'loadData',
            'sort'
        )
    }
}

export default alt.createActions(DatagridActions);
