import React from 'react';

class InputField extends React.Component {
    onChange() {
        this.props.updateField(this.props.name, this.refs[this.props.name].getDOMNode().value);
    }

    render() {
        let attributes = {
            type: this.props.type ? this.props.type : 'text',
            value: this.props.value ? this.props.value : null,
            name: this.props.name,
            id: this.props.name,
            ref: this.props.name,
            onChange: this.onChange.bind(this)
        };

        return (
            <input {...attributes} className="form-control" />
        );
    }
}

InputField.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    type: React.PropTypes.string,
    updateField: React.PropTypes.func
};

export default InputField;
