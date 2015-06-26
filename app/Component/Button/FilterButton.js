import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import ApplicationActions from '../../Actions/ApplicationActions';
import ApplicationStore from '../../Stores/ApplicationStore';

class FilterButton extends React.Component {
    componentDidMount() {
        this.boundedFilterUpdated = this.filterUpdated.bind(this);
        ApplicationStore.addFilterListener(this.boundedFilterUpdated);

        this.setState(ApplicationStore.getState());

        // Add pinned filters
        let {filters} = this.props;
        for (let i in filters) {
            let filter = filters[i];

            if (filter.pinned()) {
                ApplicationActions.displayFilter(filter);
            }
        }
    }

    componentWillUnmount() {
        ApplicationStore.removeFilterListener(this.boundedFilterUpdated);
    }

    displayFilter(filter) {
        return function() {
            ApplicationActions.displayFilter(filter);
        };
    }

    filterUpdated() {
        this.setState(ApplicationStore.getState());
    }

    render() {
        if (!this.state) {
            return null;
        }

        let {filters} = this.props;
        let displayedFilters = this.state.data.get('filters');
        const displayFilter = this.displayFilter.bind(this);

        if (!filters || !filters.length) {
            return null;
        }

        filters = new Set(filters);
        displayedFilters = new Set(displayedFilters);
        filters = new Set([...filters].filter(x => !displayedFilters.has(x)));

        const buttons = [...filters].map((filter, i) => {
            return <MenuItem key={i} onSelect={displayFilter(filter)}>{filter.label()}</MenuItem>;
        });

        const title = <span><span className="glyphicon glyphicon-filter" aria-hidden="true"></span>&nbsp;Add filters</span>;

        return (
            <DropdownButton title={title}>
                {buttons}
            </DropdownButton>
        );
    }
}

FilterButton.propTypes = {
    filters: React.PropTypes.array
};

require('../../autoloader')('FilterButton', FilterButton);

export default FilterButton;
