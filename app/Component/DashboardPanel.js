import React from 'react';
import { Link } from 'react-router';

import Datagrid from './Datagrid/Datagrid';

class DashboardPanel extends React.Component {
    render() {
        const view = this.props.view;
        const entity = view.entity;
        const entries = this.props.dataStore.getEntries(entity.uniqueId);
        const params = {
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
    view: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired,
    dataStore: React.PropTypes.object.isRequired,
    sortDir: React.PropTypes.string,
    sortField: React.PropTypes.string
};

require('../autoloader')('DashboardPanel', DashboardPanel);

export default DashboardPanel;
