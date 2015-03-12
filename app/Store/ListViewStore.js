var alt = require('../alt');

var ListViewActions = require('../Actions/ListViewActions');

class ListViewStore {
    constructor() {
        this.bindActions(ListViewActions);
    }

    onSort() {
        console.log('Store.sort');
        this.emitChange();
    }
}

module.exports = alt.createStore(ListViewStore);
