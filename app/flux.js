import Fluxxor from 'fluxxor';

import DatagridStore from './Store/DatagridStore';
import DatagridActions from './Actions/DatagridActions';

var flux = new Fluxxor.Flux({
    datagrid: new DatagridStore()
}, {
    datagrid: DatagridActions
});

flux.on('dispatch', function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

export default flux;
