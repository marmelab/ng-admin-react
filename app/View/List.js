import React from 'react';
import { shouldComponentUpdate } from 'react-immutable-render-mixin';

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
        if (nextProps.params.entity !== this.props.params.entity
            || nextProps.query.page !== this.props.query.page
            || nextProps.query.sortField !== this.props.query.sortField
            || nextProps.query.sortDir !== this.props.query.sortDir) {

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
        let {page, sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        ListActions.loadData(this.props.configuration, this.getView(), page, sortField, sortDir);
    }

    buildPagination(view) {
        let totalItems = this.state.data.get('totalItems');
        let page = this.state.data.get('page');

        return <MaDatagridPagination totalItems={totalItems} entity={view.entity.name()} page={page} perPage={view.perPage()} />;
    }

    render() {
        if (this.state.data.get('pending')) return null;

        let configuration = this.props.configuration;
        let entityName = this.context.router.getCurrentParams().entity;
        let view = this.getView(entityName);
        let sortDir = this.state.data.get('sortDir');
        let sortField = this.state.data.get('sortField');
        let dataStore = this.state.data.get('dataStore');
        let entries = dataStore.getEntries(view.entity.uniqueId);
        let actions = view.actions() || ['create'];

        return (
            <div className="view list-view">
                <ViewActions entityName={view.entity.name()} buttons={actions} />

                <div className="page-header">
                    <h1>{view.title() || entityName + " list"}</h1>
                    <p className="description">{view.description()}</p>
                </div>

                <Datagrid
                    name={view.name()}
                    entityName={view.entity.name()}
                    configuration={configuration}
                    actions={ListActions}
                    listActions={view.listActions()}
                    fields={view.getFields()}
                    entries={entries}
                    sortDir={sortDir}
                    sortField={sortField}
                    />

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
