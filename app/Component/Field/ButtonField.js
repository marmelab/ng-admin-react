import React from 'react';
import classNames from 'classnames';

class ButtonField extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: !!props.value };
    }

    isActive() {
        return this.state.value;
    }

    toggle() {
        const value = !this.state.value;
        this.setState({ value });

        this.props.updateField(this.props.name, value ? 1 : 0);
    }

    render() {
        const className = classNames('btn', 'btn-default', { active: this.isActive() });

        return (
            <div>
                <a onClick={this.toggle.bind(this)} className={className}>{this.props.label}</a>
            </div>
        );
    }
}

ButtonField.propTypes = {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    type: React.PropTypes.string,
    updateField: React.PropTypes.func
};

require('../../autoloader')('ButtonField', ButtonField);

export default ButtonField;
