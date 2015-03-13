import React from 'react';

class NumberField extends React.Component {
    render() {
        var value = this.props.value;
        return (
            <span>{value}</span>
        );
    }
}

export default NumberField;
