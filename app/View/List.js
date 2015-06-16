import React from 'react';
import { shouldComponentUpdate } from 'react-immutable-render-mixin';
import Notification from '../Services/Notification';

import Datagrid from '../Component/Datagrid/Datagrid';
import MaDatagridPagination from '../Component/Datagrid/MaDatagridPagination';
import ViewActions from '../Component/ViewActions';
import Compile from '../Component/Compile';

import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';

class ListView extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        EntityStore.addChangeListener(this.onChange.bind(this));
        EntityStore.addFailureListener(this.onLoadFailure.bind(this));

        this.refreshData();
    }

    componentWillUnmount() {
        EntityStore.removeAllListeners();
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
        this.setState(EntityStore.getState());
    }

    refreshData() {
        let {page, sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EntityActions.loadListData(this.props.configuration, this.getView(), page, sortField, sortDir);
    }

    onLoadFailure(response) {
        let body = response.data;
        if (typeof message === 'object') {
            body = JSON.stringify(body);
        }

        Notification.log('Oops, an error occured during data fetching : (code: ' + response.status + ') ' + body,
            {addnCls: 'humane-flatty-error'});
    }

    buildPagination(view) {
        let totalItems = this.state.data.get('totalItems');
        let page = this.state.data.get('page');

        return <MaDatagridPagination totalItems={totalItems} entity={view.entity.name()} page={page} perPage={view.perPage()} />;
    }

    render() {
        if (!this.state) {
            return <div />;
        }

        let configuration = this.props.configuration;
        let entityName = this.context.router.getCurrentParams().entity;
        let view = this.getView(entityName);
        let sortDir = this.state.data.get('sortDir');
        let sortField = this.state.data.get('sortField');
        let dataStore = this.state.data.getIn(['dataStore', 'object']);
        let entries = dataStore.getEntries(view.entity.uniqueId);
        let actions = view.actions() || ['create'];

        if (!entries) {
            return <div />;
        }

        return (
            <div className="view list-view">
                <ViewActions entityName={view.entity.name()} buttons={actions} />

                <div className="page-header">
                    <h1><Compile>{view.title() || entityName + " list"}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <Datagrid
                    name={view.name()}
                    entityName={view.entity.name()}
                    configuration={configuration}
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

require('../autoloader')('ListView', ListView);

export default ListView;
