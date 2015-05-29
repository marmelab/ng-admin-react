import React from 'react';
import { shouldComponentUpdate } from 'react-immutable-render-mixin';

import DashboardPanel from '../Component/DashboardPanel';

import DashboardActions from '../Actions/DashboardActions';
import DashboardStore from '../Stores/DashboardStore';

class DashboardView extends React.Component {
    constructor() {
        super();

        this.state = DashboardStore.getState();
        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentWillMount() {
        DashboardStore.addChangeListener(this.onChange.bind(this));

        this.refreshData();
    }

    componentWillUnmount() {
        DashboardStore.removeChangeListener(this.onChange.bind(this));
    }

    onChange() {
        this.setState(DashboardStore.getState());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.query.page !== this.props.query.page
            || nextProps.query.sortField !== this.props.query.sortField
            || nextProps.query.sortDir !== this.props.query.sortDir) {

            this.refreshData();
        }
    }

    refreshData() {
        DashboardActions.loadPanels(this.props.configuration);
    }

    buildPanels(panels, odd=true) {
        let panelViews = [];
        let i, label, view, sortDir, sortField, dataStore;

        panels
            .filter((v, k) => (odd && (0 !== k % 2)) || (!odd && (0 === k % 2)))
            .forEach((panel, key) => {
                label = panel.get('label');
                view = panel.get('view');
                sortDir = this.state.data.get('sortDir');
                sortField = this.state.data.get('sortField');
                dataStore = this.state.data.get('dataStore');

                panelViews.push((
                    <div className="panel panel-default">
                        <DashboardPanel
                            router={this.context.router}
                            configuration={this.props.configuration}
                            label={label}
                            view={view}
                            dataStore={dataStore}
                            sortDir={sortDir}
                            sortField={sortField} />
                    </div>
                ));
            }, this);

        return panelViews;
    }

    render() {
        if (this.state.data.get('pending')) return null;

        let panels = this.state.data.get('panels');

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
