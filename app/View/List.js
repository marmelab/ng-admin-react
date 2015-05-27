import React from 'react';
import shouldComponentUpdate from 'omniscient/shouldupdate';

import Datagrid from '../Component/Datagrid/Datagrid';
import MaDatagridPagination from '../Component/Datagrid/MaDatagridPagination';
import ViewActions from '../Component/ViewActions';

import ListActions from '../Actions/ListActions';
import ListStore from '../Stores/ListStore';

class ListView extends React.Component {
    constructor() {
        super();

        this.state = ListStore.getState();
        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentWillMount() {
        ListStore.addChangeListener(this.onChange.bind(this));

        this.refreshData();
    }

    componentWillUnmount() {
        ListStore.removeChangeListener(this.onChange.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity || nextProps.query.page !== this.props.query.page) {
            this.refreshData();
        }
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).views.ListView;
    }

    onChange() {
        this.setState(ListStore.getState());
    }

    refreshData() {
        let {page} = this.context.router.getCurrentQuery();

        ListActions.loadData(this.props.configuration, this.getView(), page);
    }

    buildPagination(view) {
        let totalItems = this.state.data.get('totalItems');
        let {page} = this.context.router.getCurrentQuery();

        return <MaDatagridPagination totalItems={totalItems} entity={view.entity.name()} page={page} perPage={view.perPage()} />;
    }

    render() {
        if (this.state.data.get('pending')) return null;

        let configuration = this.props.configuration;
        let entityName = this.context.router.getCurrentParams().entity
        let view = this.getView(entityName);
        let sortDir = this.state.data.get('sortDir');
        let sortField = this.state.data.get('sortField');
        let dataStore = this.state.data.get('dataStore');

        return (
            <div className="view list-view">
                <ViewActions view={view} buttons={['create']} />

                <div className="page-header">
                    <h1>{view.title() || entityName + " list"}</h1>
                    <p className="description">{view.description()}</p>
                </div>

                <Datagrid
                    router={this.context.router}
                    configuration={configuration}
                    actions={ListActions}
                    view={view}
                    fields={view.getFields()}
                    dataStore={dataStore}
                    sortDir={sortDir}
                    sortField={sortField} />

                {this.buildPagination(view)}
            </div>
        )
    }
}

ListView.contextTypes = {
    router: React.PropTypes.func.isRequired
};
ListView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default ListView;
