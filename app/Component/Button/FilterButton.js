import React from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

class FilterButton extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    showFilter(filter) {
        return () => {
            this.props.showFilter(filter);
        };
    }

    render() {
        const buttons = this.props.filters.map((filter, i) => {
            return <MenuItem key={i} onSelect={this.showFilter(filter)}>{filter.label()}</MenuItem>;
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
    filters: React.PropTypes.object,
    showFilter: React.PropTypes.func
};

require('../../autoloader')('FilterButton', FilterButton);

export default FilterButton;
