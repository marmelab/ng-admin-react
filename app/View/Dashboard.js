import React from 'react';

import DashboardPanel from '../Component/DashboardPanel';

class DashboardView extends React.Component {
    buildPanels(panels, odd=true) {
        let panelViews = [];
        let i, label, view;

        for (i in panels) {
            if ((odd && (0 == i % 2)) || (!odd && (0 != i % 2))) {
                continue;
            }

            label = panels[i].label;
            view = panels[i].view;

            panelViews.push((
                <div className="panel panel-default">
                    <DashboardPanel router={this.context.router} configuration={this.props.configuration} label={label} view={view} />
                </div>
            ));

            return panelViews;
        }
    }

    render() {
        let dashboardViews = this.props.configuration.getViewsOfType('DashboardView');
        let i,
            view,
            entity,
            panels = [];

        for (i in dashboardViews) {
            view = dashboardViews[i];
            entity = view.getEntity();

            panels.push({
                label: view.title() || entity.label(),
                view: view
            });
        }

        return (
            <div className="view dashboard-view">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="page-header">
                            <h1>Dashboard</h1>
                        </div>
                    </div>
                </div>

                <div className="row dashboard-content">
                    <div className="col-lg-6">
                        {this.buildPanels(panels, false)}
                    </div>
                    <div className="col-lg-6">
                        {this.buildPanels(panels, true)}
                    </div>
                </div>
            </div>
        )
    }
}

DashboardView.contextTypes = {
    router: React.PropTypes.func.isRequired
};
DashboardView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default DashboardView;
