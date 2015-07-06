import React from 'react';

class InputField extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: props.value ? props.value : null };
    }

    onChange(e) {
        const value = e.target.value;
        this.setState({ value });
        this.props.updateField(this.props.name, value);
    }

    render() {
        const attributes = {
            type: this.props.type ? this.props.type : 'text',
            value: this.state.value,
            autoFocus: !!this.props.autoFocus,
            name: this.props.name,
            id: this.props.name,
            onChange: this.onChange.bind(this)
        };

        return <input {...attributes} className="form-control" />;
    }
}

InputField.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    type: React.PropTypes.string,
    updateField: React.PropTypes.func,
    autoFocus: React.PropTypes.bool
};

require('../../autoloader')('InputField', InputField);

export default InputField;
