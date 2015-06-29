import React from 'react';
import moment from 'moment/moment';

class DateColumn extends React.Component {
    render() {
        let {value, field} = this.props;

        if (field) {
            let format = field.format();
            if (!format) {
                format = 'date' === field.type() ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss';
            }
            value = moment(value, format).format(format);
        }

        return <span>{value}</span>;
    }
}

DateColumn.propTypes = {
    value: React.PropTypes.string.isRequired,
    field: React.PropTypes.object
};

require('../../autoloader')('DateColumn', DateColumn);

export default DateColumn;
