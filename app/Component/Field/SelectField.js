import React from 'react';
import Select from 'react-select';

class SelectField extends React.Component {
    onChange(val) {
        this.props.updateField(this.props.name, val);
    }

    render() {
        let attributes = {
            options: this.props.choices.map(v => { v.value = `${v.value}`; return v; }),
            multi: !!this.props.multiple,
            name: this.props.name,
            id: this.props.name,
            onChange: this.onChange.bind(this)
        };

        if (this.props.value.length) {
            attributes.value = `${this.props.value}`;
        }

        return (
            <Select {...attributes} className="form-control" />
        );
    }
}

SelectField.propTypes = {
    name: React.PropTypes.string.isRequired,
    choices: React.PropTypes.array.isRequired,
    multiple: React.PropTypes.boolean,
    value: React.PropTypes.array,
    type: React.PropTypes.string,
    updateField: React.PropTypes.func
};

require('../../autoloader')('SelectField', SelectField);

export default SelectField;
