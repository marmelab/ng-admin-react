import React from 'react';

class BooleanColumn extends React.Component {
    render() {
        let className = !!this.props.value ? 'boolean-true' : 'boolean-false';
        return (
            <span className={className}></span>
        );
    }
}

BooleanColumn.propTypes = {
    value: React.PropTypes.any.isRequired
};

export default BooleanColumn;
