import React from 'react';

class DateColumn extends React.Component {
    render() {
        return (
            <span>{this.props.value}</span>
        );
    }
}

DateColumn.propTypes = {
    value: React.PropTypes.string.isRequired
};

export default DateColumn;
