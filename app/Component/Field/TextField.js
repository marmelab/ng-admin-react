import React from 'react';

class TextField extends React.Component {
    onChange(e) {
        this.props.updateField(this.props.name, e.target.value);
    }

    render() {
        let attributes = {
            name: this.props.name,
            id: this.props.name,
            onChange: this.onChange.bind(this),
            value: this.props.value ? this.props.value : null
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
