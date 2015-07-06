import React from 'react';
import moment from 'moment/moment';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import classNames from 'classnames';

class DateField extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: props.value };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }
    }

    getFormat(type) {
        let { field } = this.props;

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
        const { type } = this.props;
        const format = this.getFormat(type);

        let { value } = this.state;

        if (!value) {
            value = moment().format(format);
        }

        const attributes = {
            mode: type,
            dateTime: value,
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

DateField.propTypes = {
    field: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    updateField: React.PropTypes.func
};

require('../../autoloader')('DateField', DateField);

export default DateField;
