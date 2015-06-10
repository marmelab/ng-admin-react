import React from 'react';

class NumberColumn extends React.Component {
    render() {
        let {value, detailAction} = this.props;

        if (detailAction) {
            return <a onClick={detailAction}>{value}</a>;
        }

        return (
            <span>{value}</span>
        );
    }
}

NumberColumn.propTypes = {
    value: React.PropTypes.number,
    detailAction: React.PropTypes.function
};

export default NumberColumn;
