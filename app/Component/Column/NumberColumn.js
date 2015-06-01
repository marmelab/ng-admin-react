'use strict';

import React from 'react';

class NumberColumn extends React.Component {
    render() {
        var value = this.props.value;
        return (
            <span>{value}</span>
        );
    }
}

NumberColumn.propTypes = {
    value: React.PropTypes.number.isRequired
};

export default NumberColumn;
