import React from 'react';

class CheckboxField extends React.Component {
    onChange() {
        let value = this.refs[this.props.name].getDOMNode().checked ? 1 : 0;
        this.props.updateField(this.props.name, value);
    }

    render() {
        let attributes = {
            type: 'checkbox',
            checked: !!this.props.value,
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

CheckboxField.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    type: React.PropTypes.string,
    updateField: React.PropTypes.func
};

export default CheckboxField;
