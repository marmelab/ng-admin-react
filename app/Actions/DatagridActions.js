var alt = require('../alt');

class DatagridActions {
    constructor() {
        this.generateActions(
            'sort'
        )
    }
}

module.exports = alt.createActions(DatagridActions);
