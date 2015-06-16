import React from 'react';
import moment from 'moment/moment';
import DatePicker from 'react-datepicker/dist/react-datepicker.js';

class InputField extends React.Component {
    getFormat() {
        let {field} = this.props;

        let format = field.format();
        if (!format) {
            format = field.type() === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss';
        }

        return format;
    }

    onChange(date) {
        this.props.updateField(this.props.name, date.format(this.getFormat()));
    }

    render() {
        let {value} = this.props;

        let format = this.getFormat();
        value = value ? moment(value, format) : null;
        let onChange = this.onChange.bind(this);

        return <DatePicker
            selected={value}
            dateFormat={format}
            onChange={onChange}
            />;
    }
}

InputField.propTypes = {
    field: React.PropTypes.object.isRequired,
    name: React.PropTypes.object.isRequired,
    value: React.PropTypes.any,
    updateField: React.PropTypes.func
};

export default InputField;
