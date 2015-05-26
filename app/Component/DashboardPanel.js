import React from 'react';
import { Link } from 'react-router';

import Datagrid from './Datagrid/Datagrid';

class DashboardPanel extends React.Component {
    render() {
        let params = {
            entity: this.props.view.entity.name()
        };
        let view = this.props.view;

        return (
            <div>
                <div className="panel-heading">
                    <Link to="list" params={params}>{this.props.label}</Link>
                </div>

                <Datagrid router={this.props.router} configuration={this.props.configuration} view={view} fields={view.fields()} />
            </div>
        );
    }
}

DashboardPanel.propTypes = {
    label: React.PropTypes.string.isRequired,
    router: React.PropTypes.object.isRequired,
    configuration: React.PropTypes.object.isRequired,
    view: React.PropTypes.object.isRequired
};

export default DashboardPanel;
