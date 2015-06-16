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
                    configuration={this.props.configuration}
                    fields={view.fields()}
                    entries={entries}
                    sortDir={this.props.sortDir}
                    sortField={this.props.sortField}
                    listActions={[]}
                    />
            </div>
        );
    }
}

DashboardPanel.propTypes = {
    configuration: React.PropTypes.object,
    view: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired,
    dataStore: React.PropTypes.object.isRequired,
    sortDir: React.PropTypes.string,
    sortField: React.PropTypes.string
};

require('../autoloader')('DashboardPanel', DashboardPanel);

export default DashboardPanel;
