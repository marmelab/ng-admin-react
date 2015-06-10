import React from 'react';

class StringColumn extends React.Component {
    render() {
        let {value, detailAction} = this.props;

        if (detailAction) {
            return <a onClick={detailAction}>{value}</a>;
        }

        return <span>{value}</span>;
    }
}

StringColumn.propTypes = {
    value: React.PropTypes.any.isRequired,
    detailAction: React.PropTypes.function
};

export default StringColumn;
