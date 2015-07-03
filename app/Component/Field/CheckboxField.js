import React from 'react';

class CheckboxField extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: !!this.props.value };
    }

    onChange(e) {
        const value = e.target.checked;
        this.setState({ value });

        this.props.updateField(this.props.name, value ? 1 : 0);
    }

    render() {
        const attributes = {
            type: 'checkbox',
            checked: this.state.value,
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
