import React from 'react';

class ReferenceField extends React.Component {
    render() {
        let values = this.props.values;

        return <span>
            {values.map((value) => (
                <span>{value}</span>
            ))}
        </span>;
    }
}

export default ReferenceField;
