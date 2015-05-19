import React from 'react';

class ReferenceField extends React.Component {
    render() {
        var values = this.props.values;

        return values.map(value => (
            <span className="label label-default">{value}</span>
        ));
    }
}

export default ReferenceField;
