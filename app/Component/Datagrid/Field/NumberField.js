import React from 'react';

class NumberField extends React.Component {
    render() {
        let value = this.props.value;
        return (
            <span>{value}</span>
        );
    }
}

export default NumberField;
