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

export default StringColumn;
