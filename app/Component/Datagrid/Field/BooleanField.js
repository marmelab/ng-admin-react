import React from 'react';

class BooleanField extends React.Component {
    render() {
        let className = !!this.props.value ? 'boolean-true' : 'boolean-false';
        return (
            <span className={className}></span>
        );
    }
}

export default BooleanField;
