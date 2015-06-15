import React from 'react';

class DateColumn extends React.Component {
    render() {
        let {value} = this.props;

        return <span>{value}</span>;
    }
}

DateColumn.propTypes = {
    value: React.PropTypes.string.isRequired
};

export default DateColumn;
