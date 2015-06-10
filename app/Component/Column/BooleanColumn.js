import React from 'react';

class BooleanColumn extends React.Component {
    render() {
        let {value, detailAction} = this.props,
            className = !!value ? 'boolean-true' : 'boolean-false';

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

export default BooleanColumn;
