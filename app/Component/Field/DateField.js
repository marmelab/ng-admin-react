import React from 'react';
import moment from 'moment/moment';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import classNames from 'classnames';

class InputField extends React.Component {
    getFormat(type) {
        let {field} = this.props;

        let format = field.format();
        if (!format) {
            format = 'datetime' === type ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
        }

        return format;
    }

    onChange(date) {
        this.props.updateField(this.props.name, date);
    }

    render() {
        let {value, type} = this.props;

        let format = this.getFormat(type);
        if (value) {
            value = typeof(value) === 'string' ? moment(value, format) : moment(value);
        }

        const attributes = {
            mode: type,
            dateTime: value.format(format),
            format: format,
            inputFormat: format,
            onChange: this.onChange.bind(this)
        };
        const className = classNames('row', { 'col-sm-5': 'datetime' === type, 'col-sm-4': 'date' === type });

        return (
            <div className={className}>
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
