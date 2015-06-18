import React from 'react';

class StringColumn extends React.Component {
    render() {
        const {value} = this.props;

        return <span>{value}</span>;
    }
}

StringColumn.propTypes = {
    value: React.PropTypes.any
};

require('../../autoloader')('StringColumn', StringColumn);

export default StringColumn;
