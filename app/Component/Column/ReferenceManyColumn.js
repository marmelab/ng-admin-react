import React from 'react';

class ReferenceManyColumn extends React.Component {
    render() {
        let values = this.props.values;

        if (!values) {
            return <span />;
        }

        return (
            <span className="reference-many-column">
                {values.map((value, i) => (
                    <span key={i} className="label label-default">{value}</span>
                ))}
            </span>
        );
    }
}

ReferenceManyColumn.propTypes = {
    values: React.PropTypes.array.isRequired
};

export default ReferenceManyColumn;
