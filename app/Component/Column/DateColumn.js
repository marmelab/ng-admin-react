import React from 'react';

class DateColumn extends React.Component {
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

DateColumn.propTypes = {
    value: React.PropTypes.string.isRequired,
    detailAction: React.PropTypes.func
};

export default DateColumn;
