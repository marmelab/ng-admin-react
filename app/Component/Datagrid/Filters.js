import React from 'react';

import ApplicationActions from '../../Actions/ApplicationActions';
import ApplicationStore from '../../Stores/ApplicationStore';

class Filters extends React.Component {
    componentDidMount() {
        this.boundedFilterUpdated = this.filterUpdated.bind(this);
        ApplicationStore.addFilterListener(this.boundedFilterUpdated);

        this.setState(ApplicationStore.getState());
    }

    componentWillUnmount() {
        ApplicationStore.removeFilterListener(this.boundedFilterUpdated);
    }

    filterUpdated() {
        this.setState(ApplicationStore.getState());
    }

    removeFilter(filter) {
        return () => {
            ApplicationActions.removeFilter(filter);
        };
    }

    updateField() {

    }

    render() {
        if (!this.state) {
            return null;
        }

        const filters = this.state.data.get('filters');
        const {view, configuration, dataStore} = this.props;
        const updateField = this.updateField.bind(this);
        const removeFilter = this.removeFilter.bind(this);

        if (!filters.count()) {
            return null;
        }

        const rows = filters.map((filter, i) => {
            return <div className="form-field form-group" key={i}>
                <a className="remove" onClick={removeFilter(filter)}><span className="glyphicon glyphicon-remove"></span></a>

                <Field field={filter}
                    entity={view.getEntity()}
                    configuration={configuration}
                    dataStore={dataStore} updateField={updateField} />
            </div>;
        });

        return <div className="filters form-horizontal">{rows}</div>;
    }
}

DatagridActions.propTypes = {
    views: React.PropTypes.object,
    configuration: React.PropTypes.object,
    dataStore: React.PropTypes.object
};

require('../../autoloader')('Filters', Filters);

export default Filters;
