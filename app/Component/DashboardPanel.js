import React from 'react';
import { Link } from 'react-router';

import Datagrid from './Datagrid/Datagrid';

class DashboardPanel extends React.Component {
    render() {
        let view = this.props.view;
        let entity = view.entity;
        let entries = this.props.dataStore.getEntries(entity.uniqueId);
        let params = {
            entity: entity.name()
        };

        return (
            <div>
                <div className="panel-heading">
                    <Link to="list" params={params}>{this.props.label}</Link>
                </div>

                <Datagrid
                    name={view.name()}
                    entityName={entity.name()}
                    router={this.props.router}
                    configuration={this.props.configuration}
                    fields={view.fields()}
                    entries={entries}
                    sortDir={this.props.sortDir}
                    sortField={this.props.sortField} />
            </div>
        );
    }
}

DashboardPanel.propTypes = {
    router: React.PropTypes.object.isRequired,
    configuration: React.PropTypes.object.isRequired,
    view: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired,
    dataStore: React.PropTypes.object.isRequired,
    sortDir: React.PropTypes.string.isRequired,
    sortField: React.PropTypes.string.isRequired
};

export default DashboardPanel;
