import React from 'react';

class ReferenceField extends React.Component {
    render() {
        var value = this.props.value;
        return (
            <span>{value}</span>
        );
    }
}

export default ReferenceField;
