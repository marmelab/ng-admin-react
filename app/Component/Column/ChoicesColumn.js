import React from 'react';

class ChoicesColumn extends React.Component {
    render() {
        const { values } = this.props;

        if (!values) {
            return <span />;
        }

        return (
            <span className="choices-column">
                {values.map((value, i) => {
                    return <span key={i} className="label label-default">{value}</span>;
                })}
            </span>
        );
    }
}

ChoicesColumn.propTypes = {
    values: React.PropTypes.array
};

require('../../autoloader')('ChoicesColumn', ChoicesColumn);

export default ChoicesColumn;
