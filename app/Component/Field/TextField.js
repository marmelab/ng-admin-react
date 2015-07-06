import React from 'react';

class TextField extends React.Component {
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
        let attributes = {
            name: this.props.name,
            id: this.props.name,
            onChange: this.onChange.bind(this),
            value: this.state.value
        };

        return (
            <textarea {...attributes} className="form-control"></textarea>
        );
    }
}

TextField.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    updateField: React.PropTypes.func
};

require('../../autoloader')('TextField', TextField);

export default TextField;
