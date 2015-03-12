var alt = require('../alt');

class ListViewActions {
    constructor() {
        this.generateActions(
            'sort'
        )
    }
}

module.exports = alt.createActions(ListViewActions);
