import React from 'react';

class CheckboxField extends React.Component {
    onChange(e) {
        this.props.updateField(this.props.name, e.target.checked ? 1 : 0);
    }

    render() {
        let attributes = {
            type: 'checkbox',
            checked: !!this.props.value,
            name: this.props.name,
            id: this.props.name,
            onChange: this.onChange.bind(this)
        };

        return (
            <input {...attributes} className="form-control" />
        );
    }
}

CheckboxField.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    type: React.PropTypes.string,
    updateField: React.PropTypes.func
};

require('../../autoloader')('CheckboxField', CheckboxField);

export default CheckboxField;
