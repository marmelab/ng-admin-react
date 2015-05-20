import React from 'react';

class ReferenceManyField extends React.Component {
    render() {
        let values = this.props.values;

        if (!values) {
            return <span />;
        }

        return (
            <span>
                {values.map((value) => (
                    <span>{value}</span>
                ))}
            </span>
        );
    }
}

export default ReferenceManyField;
