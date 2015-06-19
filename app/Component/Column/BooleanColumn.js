import React from 'react';

class BooleanColumn extends React.Component {
    render() {
        const {value} = this.props;
        const className = !!value ? 'boolean-true' : 'boolean-false';

        return (
            <span className={className}></span>
        );
    }
}

BooleanColumn.propTypes = {
    value: React.PropTypes.any.isRequired
};

require('../../autoloader')('BooleanColumn', BooleanColumn);

export default BooleanColumn;
