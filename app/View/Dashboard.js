import React from 'react';
import { shouldComponentUpdate } from 'react-immutable-render-mixin';

import DashboardPanel from '../Component/DashboardPanel';

import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';

class DashboardView extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        EntityStore.addChangeListener(this.onChange.bind(this));

        this.refreshData();
    }

    componentWillUnmount() {
        EntityStore.removeAllListeners();
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.query.sortField !== this.props.query.sortField
            || nextProps.query.sortDir !== this.props.query.sortDir) {

            this.refreshData();
        }
    }

    refreshData() {
        let {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EntityActions.loadDashboardPanels(this.props.configuration, sortField, sortDir);
    }

    buildPanels(panels, odd=true) {
        let sortDir = this.state.data.get('sortDir');
        let sortField = this.state.data.get('sortField');
        let dataStore = this.state.data.getIn(['dataStore', 'object']);
        let panelViews = [];
        let label, view;

        panels
            .filter((v, k) => (odd && (0 !== k % 2)) || (!odd && (0 === k % 2)))
            .forEach((panel, key) => {
                label = panel.get('label');
                view = panel.get('view');

                panelViews.push((
                    <div key={key} className="panel panel-default">
                        <DashboardPanel
                            configuration={this.props.configuration}
                            label={label}
                            view={view}
                            dataStore={dataStore}
                            sortDir={sortDir}
                            sortField={sortField} />
                    </div>
                ));
            });

        return panelViews;
    }

    render() {
        if (!this.state) {
            return <div />;
        }

        let panels = this.state.data.get('panels') || [];

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

DashboardView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};
DashboardView.contextTypes = {
    router: React.PropTypes.func.isRequired
};

require('../autoloader')('DashboardView', DashboardView);

export default DashboardView;
