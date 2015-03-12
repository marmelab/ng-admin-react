var alt = require('../alt');

var DatagridActions = require('../Actions/DatagridActions');

class DatagridStore {
    constructor() {
        this.bindActions(DatagridActions);
    }

    onSort() {
        console.log('Datagrid.sort');
        this.emitChange();
    }
}

module.exports = alt.createStore(DatagridStore);
