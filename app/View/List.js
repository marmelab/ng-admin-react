import React from 'react';
import Router from 'react-router';
import Datagrid from '../Component/Datagrid/Datagrid';

var ListViewActions = require('../Actions/ListViewActions');
var ListViewStore = require('../Store/ListViewStore');

export default React.createClass({
    mixins: [Router.State],

    componentDidMount: function() {
        ListViewStore.listen(this.onChange);
    },

    componentWillUnmount: function() {
        ListViewStore.unlisten(this.onChange);
    },

    onChange: function() {
        console.log('Changed!');
    },

    handleSort: function(e) {
        e.preventDefault();
        ListViewActions.sort();
    },

    render() {
        var entityName = this.getParams().entity;
        var view = this.props.configuration.getEntity(entityName).views["ListView"];

        return (
            <div class="view list-view">
                <div className="page-header">
                    <h1>{view.title() || entityName + " list"}</h1>
                    <p className="description">{view.description()}</p>
                </div>
                <Datagrid onSort={this.handleSort} fields={view.fields()} entries={view.entries} />
            </div>
        )
    }
});
