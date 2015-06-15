import React from 'react';

class InputField extends React.Component {
    onChange(e) {
        this.props.updateField(this.props.name, e.target.value);
    }

    render() {
        let attributes = {
            type: this.props.type ? this.props.type : 'text',
            value: this.props.value ? this.props.value : null,
            name: this.props.name,
            id: this.props.name,
            onChange: this.onChange.bind(this)
        };

        return (
            <input {...attributes} className="form-control" />
        );
    }
}

InputField.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    type: React.PropTypes.string,
    updateField: React.PropTypes.func
};

export default InputField;
