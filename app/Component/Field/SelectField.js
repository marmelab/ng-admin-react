import React from 'react';
import Select from 'react-select';

class SelectField extends React.Component {
    onChange(val) {
        this.props.updateField(this.props.name, val);
    }

    render() {
        const attributes = {
            value: this.props.value ? `${this.props.value}` : null,
            options: this.props.choices.map(v => { v.value = `${v.value}`; return v; }),
            name: this.props.name,
            id: this.props.name,
            onChange: this.onChange.bind(this)
        };

        return (
            <Select {...attributes} className="form-control" />
        );
    }
}

SelectField.propTypes = {
    name: React.PropTypes.string.isRequired,
    choices: React.PropTypes.array.isRequired,
    value: React.PropTypes.any,
    type: React.PropTypes.string,
    updateField: React.PropTypes.func
};

require('../../autoloader')('SelectField', SelectField);

export default SelectField;
