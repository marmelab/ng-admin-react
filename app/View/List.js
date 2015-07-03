import React from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import debounce from 'lodash/function/debounce';
import { List } from 'immutable';

import { hasEntityAndView, getView, onLoadFailure } from '../Mixins/MainView';

import NotFoundView from './NotFound';

import Datagrid from '../Component/Datagrid/Datagrid';
import MaDatagridPagination from '../Component/Datagrid/MaDatagridPagination';
import ViewActions from '../Component/ViewActions';
import Compile from '../Component/Compile';

import ApplicationActions from '../Actions/ApplicationActions';
import ApplicationStore from '../Stores/ApplicationStore';
import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';

import Filters from '../Component/Datagrid/Filters';

class ListView extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {}; // needed for ReactComponentWithPureRenderMixin::shouldComponentUpdate()

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
        this.hasEntityAndView = hasEntityAndView.bind(this);
        this.getView = getView.bind(this);
        this.onLoadFailure = onLoadFailure.bind(this);

        this.boundedUpdateFilterField = this.updateFilterField.bind(this);
        this.boundedShowFilter = this.showFilter.bind(this);
        this.boundedHideFilter = this.hideFilter.bind(this);
        this.boundedOnListSort = this.onListSort.bind(this);
        this.boundedOnPageChange = this.onPageChange.bind(this);

        this.refreshList = debounce(this.refreshList.bind(this), 300);

        this.viewName = 'ListView';
        this.isValidEntityAndView = this.hasEntityAndView(context.router.getCurrentParams().entity);
    }

    componentDidMount() {
        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);
        EntityStore.addReadFailureListener(this.onLoadFailure);

        this.boundedOnChangeFilters = this.onChangeFilters.bind(this);
        ApplicationStore.addFilterListener(this.boundedOnChangeFilters);

        if (this.isValidEntityAndView) {
            this.init();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.query.page !== this.props.query.page ||
            nextProps.query.sortField !== this.props.query.sortField ||
            nextProps.query.sortDir !== this.props.query.sortDir) {

            this.isValidEntityAndView = this.hasEntityAndView(nextProps.params.entity);
            if (this.isValidEntityAndView) {
                this.init();
            }
        }
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeReadFailureListener(this.onLoadFailure);

        ApplicationStore.removeFilterListener(this.boundedOnChangeFilters);
    }

    init() {
        this.actions = List(this.getView().actions() || ['create']);

        this.refreshData();
        this.initFilters();
    }

    onChange() {
        this.setState({ entity: EntityStore.getState().data });
    }

    onChangeFilters() {
        this.setState({ application: ApplicationStore.getState().data });
    }

    initFilters() {
        const viewFilters = this.getView().filters();
        let selected = viewFilters.filter(filter => filter.pinned());
        let unselected = [];

        const { search } = this.context.router.getCurrentQuery() || {};
        for (let filter of viewFilters) {
            if (filter.pinned()) {
                continue;
            }

            if (search && filter.name() in search) {
                selected.push(filter);
            } else {
                unselected.push(filter);
            }
        }

        ApplicationActions.initFilters({ selected, unselected });
    }

    showFilter(filter) {
        ApplicationActions.showFilter(filter);
    }

    hideFilter(filter) {
        return () => {
            ApplicationActions.hideFilter(filter);
            this.updateFilterField(filter.name(), null);
        };
    }

    updateFilterField(name, value) {
        let query = this.context.router.getCurrentQuery() || {};

        if (!query.search) {
            query.search = {};
        }

        if (query.page) {
            delete query.page;
        }

        if ('string' === typeof value && !value.length) {
            value = null;
        }

        let hasModification = false;
        if (value !== null && value !== undefined) {
            query.search[name] = value;
            hasModification = true;
        } else if (name in query.search) {
            delete query.search[name];
            hasModification = true;
        }

        if (0 === Object.keys(query.search).length) {
            delete query.search;
        }

        if (hasModification) {
            this.refreshList(query);
        }
    }

    onListSort(field, dir) {
        let query = this.context.router.getCurrentQuery() || {};
        query.sortField = field;
        query.sortDir = dir;

        this.refreshList(query);
    }

    onPageChange(page) {
        let query = this.context.router.getCurrentQuery() || {};
        query.page = page;

        this.refreshList(query);
    }

    refreshList(query) {
        const entityName = this.getView().entity.name();

        this.context.router.transitionTo('list', { entity: entityName }, query);
        this.refreshData();
    }

    refreshData() {
        const { page, sortField, sortDir, search } = this.context.router.getCurrentQuery() || {};

        EntityActions.loadListData(this.context.restful, this.context.configuration, this.getView(), page, sortField, sortDir, search);
    }

    buildPagination(view) {
        const totalItems = this.state.entity.get('totalItems');
        const page = +this.state.entity.get('page');

        return <MaDatagridPagination totalItems={totalItems} page={page} perPage={view.perPage()} onChange={this.boundedOnPageChange} />;
    }

    render() {
        if (!this.isValidEntityAndView) {
            return <NotFoundView/>;
        }

        if (!this.state.hasOwnProperty('application') || !this.state.hasOwnProperty('entity')) {
            return null;
        }

        if (this.state.entity.get('resourceNotFound')) {
            return <NotFoundView/>;
        }

        const entityName = this.context.router.getCurrentParams().entity;
        const view = this.getView(entityName);
        const filters = this.state.application.get('filters');
        const sortDir = this.state.entity.get('sortDir');
        const sortField = this.state.entity.get('sortField');
        const dataStore = this.state.entity.getIn(['dataStore', 'object']);
        const entries = dataStore.getEntries(view.entity.uniqueId);
        let datagrid = null;
        let filter = null;

        if (entries && entries.length) {
            datagrid = (
                <Datagrid
                    name={view.name()}
                    entityName={view.entity.name()}
                    listActions={view.listActions()}
                    fields={view.getFields()}
                    entries={entries}
                    sortDir={sortDir}
                    sortField={sortField}
                    onSort={this.boundedOnListSort}
                />
            );
        }

        if (!filters.get('selected').isEmpty()) {
            filter = (
                <Filters
                    filters={filters.get('selected')}
                    entity={view.entity}
                    dataStore={dataStore}
                    hideFilter={this.boundedHideFilter}
                    updateField={this.boundedUpdateFilterField} />
                );
        }

        return (
            <div className="view list-view">
                <ViewActions
                    entityName={view.entity.name()}
                    buttons={this.actions}
                    filters={filters.get('unselected')}
                    showFilter={this.boundedShowFilter} />

                <div className="page-header">
                    <h1><Compile>{view.title() || entityName + ' list'}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                {filter}

                {datagrid}

                {this.buildPagination(view)}
            </div>
        );
    }
}

ListView.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired,
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('ListView', ListView);

export default ListView;
