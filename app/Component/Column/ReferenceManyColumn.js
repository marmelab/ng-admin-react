import React from 'react';

class ReferenceManyField extends React.Component {
    render() {
        let values = this.props.values;

        if (!values) {
            return <span />;
        }

        return (
            <span className="reference-many-column">
                {values.map((value) => (
                    <span className="label label-default">{value}</span>
                ))}
            </span>
        );
    }
}

export default ReferenceManyField;
