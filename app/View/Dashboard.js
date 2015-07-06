import React from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import DashboardPanel from '../Component/DashboardPanel';

import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';

class DashboardView extends React.Component {
    constructor() {
        super();

        this.state = {}; // needed for ReactComponentWithPureRenderMixin::shouldComponentUpdate()

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);

        this.refreshData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.query.sortField !== this.props.query.sortField ||
            nextProps.query.sortDir !== this.props.query.sortDir) {

            this.refreshData();
        }
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.boundedOnChange);
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        const {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EntityActions.loadDashboardPanels(this.context.restful, this.context.configuration, sortField, sortDir);
    }

    buildPanels(panels, odd=true) {
        const sortDir = this.state.data.get('sortDir');
        const sortField = this.state.data.get('sortField');
        const dataStore = this.state.data.getIn(['dataStore', 'object']);
        const panelViews = [];
        let label, view;

        panels
            .filter((v, k) => (odd && (0 !== k % 2)) || (!odd && (0 === k % 2)))
            .forEach((panel, key) => {
                label = panel.get('label');
                view = panel.get('view');

                panelViews.push((
                    <div key={key} className="panel panel-default">
                        <DashboardPanel
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
        if (!this.state.hasOwnProperty('data')) {
            return null;
        }

        const panels = this.state.data.get('panels') || [];

        if (!panels.count()) {
            return null;
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
        );
    }
}

DashboardView.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired,
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('DashboardView', DashboardView);

export default DashboardView;
