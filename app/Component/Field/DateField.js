import React from 'react';
import moment from 'moment/moment';
import DateTimePicker from 'react-bootstrap-datetimepicker';

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
        this.props.updateField(this.props.name, date);
    }

    render() {
        let {value} = this.props;

        let format = this.getFormat();
        if (value) {
            value = typeof(value) === 'string' ? moment(value, format) : moment(value);
        }

        let attributes = {
            dateTime: value,
            format: format,
            inputFormat: format,
            onChange: this.onChange.bind(this)
        };

        if ('date' === this.props.field.type()) {
            attributes.mode = 'date';
        }

        return (
            <div className="row col-sm-4">
                <DateTimePicker {...attributes} />
            </div>
        );
    }
}

InputField.propTypes = {
    field: React.PropTypes.object.isRequired,
    name: React.PropTypes.object.isRequired,
    value: React.PropTypes.any,
    updateField: React.PropTypes.func
};

export default InputField;
