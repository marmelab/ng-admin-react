import React from 'react';
import Router from 'react-router';
import Datagrid from '../Component/Datagrid/Datagrid';

export default React.createClass({
    mixins: [Router.State],

    render() {
        var entityName = this.getParams().entity;
        var view = this.props.configuration.getEntity(entityName).views["ListView"];

        return (
            <div class="view list-view">
                <div className="page-header">
                    <h1>{view.title() || entityName + " list"}</h1>
                    <p className="description">{view.description()}</p>
                </div>
                <Datagrid fields={view.fields()} entries={view.entries} />
            </div>
        )
    }
});
