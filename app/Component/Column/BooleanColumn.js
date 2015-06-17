import React from 'react';

class BooleanColumn extends React.Component {
    render() {
        const {value, detailAction} = this.props;
        const className = !!value ? 'boolean-true' : 'boolean-false';

        if (detailAction) {
            return <a onClick={detailAction} className={className}>{value}</a>;
        }

        return (
            <span className={className}></span>
        );
    }
}

BooleanColumn.propTypes = {
    value: React.PropTypes.any.isRequired,
    detailAction: React.PropTypes.func
};

require('../../autoloader')('BooleanColumn', BooleanColumn);

export default BooleanColumn;
