import React from 'react';

import ApplicationActions from '../../Actions/ApplicationActions';
import EntityActions from '../../Actions/EntityActions';

import ApplicationStore from '../../Stores/ApplicationStore';

class Filters extends React.Component {
    componentDidMount() {
        this.boundedFilterUpdated = this.filterUpdated.bind(this);
        ApplicationStore.addFilterListener(this.boundedFilterUpdated);

        this.setState(ApplicationStore.getState());

        // Display filters if there is any filter in query params
        const viewFilters = this.props.view.filters();
        const {search} = this.context.router.getCurrentQuery() || {};

        if (search) {
            for (let i in viewFilters) {
                let filter = viewFilters[i];
                let filterName = filter.name();

                if (filterName in search) {
                    this.addFilter(filter);
                }
            }
        }
    }

    componentWillUnmount() {
        ApplicationStore.removeFilterListener(this.boundedFilterUpdated);
    }

    filterUpdated() {
        this.setState(ApplicationStore.getState());
    }

    addFilter(filter) {
        ApplicationActions.displayFilter(filter);
    }

    removeFilter(filter) {
        return () => {
            ApplicationActions.removeFilter(filter);
            this.updateField(filter.name(), null);
        };
    }

    refreshData(query) {
        const {view} = this.props;
        const {page, sortField, sortDir} = this.context.router.getCurrentQuery() || {};
        let search = null;

        if ('search' in query) {
            search = query.search;
        }

        EntityActions.loadListData(this.context.restful, this.props.configuration, view, page, sortField, sortDir, search);
    }

    updateField(name, value) {
        const {view} = this.props;
        const {page, sortField, sortDir, search} = this.context.router.getCurrentQuery() || {};
        const entityName = view.entity.name();

        let query = {page, sortField, sortDir, search};
        if (!query.search) {
            query.search = {};
        }

        if (typeof(value) === 'string' && !value.length) {
            value = null;
        }

        if (value !== null && value !== undefined) {
            query.search[name] = value;
        } else if (name in query.search) {
            delete query.search[name];
        }

        if (Object.keys(query.search).length === 0) {
            delete query.search;
        }

        this.context.router.transitionTo('list', {entity: entityName}, query);
        this.refreshData(query);
    }

    render() {
        if (!this.state) {
            return null;
        }

        const filters = this.state.data.get('filters');
        const {view, configuration, dataStore} = this.props;
        const updateField = this.updateField.bind(this);
        const removeFilter = this.removeFilter.bind(this);
        const {search} = this.context.router.getCurrentQuery() || {};

        if (!filters.count()) {
            return null;
        }

        const rows = filters.map((filter, i) => {
            const filterName = filter.name();
            const value = search && filterName in search ? search[filterName] : null;

            return <div className="form-field form-group" key={i}>
                <a className="remove" onClick={removeFilter(filter)}><span className="glyphicon glyphicon-remove"></span></a>

                <Field field={filter}
                    autoFocus={true}
                    entity={view.getEntity()}
                    value={value}
                    configuration={configuration}
                    dataStore={dataStore}
                    updateField={updateField} />
            </div>;
        });

        return <div className="filters form-horizontal">{rows}</div>;
    }
}

Filters.propTypes = {
    view: React.PropTypes.object,
    configuration: React.PropTypes.object,
    dataStore: React.PropTypes.object
};

Filters.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired
};

require('../../autoloader')('Filters', Filters);

export default Filters;
