'use strict';

import React from 'react';

class ReferenceColumn extends React.Component {
    render() {
        var value = this.props.value;
        return (
            <span>{value}</span>
        );
    }
}

ReferenceColumn.propTypes = {
    value: React.PropTypes.string.isRequired
};

export default ReferenceColumn;
