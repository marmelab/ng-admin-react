import { EventEmitter } from 'events';
import AppDispatcher from '../Services/AppDispatcher';

import ApiRequester from '../Services/ApiRequester';

class DatagridStore extends EventEmitter {
    constructor(...args) {
        super(...args);

        this.entries = [];
        this.sortDir = null;
        this.sortField = null;
    }

    loadData(view) {
        var sortField = this.sortField || view.sortField() || 'id';
        var sortDir = this.sortDir || view.sortDir() || 'DESC';

        ApiRequester
            .getAll(view, 1, true, [], sortField, sortDir)
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

    getState() {
        return {
            entries: this.entries,
            sortDir: this.sortDir,
            sortField: this.sortField
        }
    }

    emitChange() {
        this.emit('datagrid_load');
    }

    addChangeListener(callback) {
        this.on('datagrid_load', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('datagrid_load', callback);
    }
}

let store = new DatagridStore();

AppDispatcher.register((action) => {
  switch(action.actionType) {
    case 'load_data':
      store.loadData(action.view);
      break;
    case 'sort':
      store.sort(action.args);
      break;
  }
});

export default store;
