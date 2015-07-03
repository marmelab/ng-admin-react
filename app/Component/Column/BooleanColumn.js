import React from 'react';

class BooleanColumn extends React.Component {
    render() {
        const className = this.props.value ? 'boolean-true' : 'boolean-false';

        return (
            <span className={className}></span>
        );
    }
}

BooleanColumn.propTypes = {
    value: React.PropTypes.any
};

require('../../autoloader')('BooleanColumn', BooleanColumn);

export default BooleanColumn;
