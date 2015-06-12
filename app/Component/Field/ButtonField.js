import React from 'react';
import classNames from 'classnames';

class ButtonField extends React.Component {
    constructor(props) {
        super(props);

        this.value = !!props.value;
    }

    isActive() {
        return !!this.value;
    }

    toggle() {
        this.value = !this.value;

        this.props.updateField(this.props.name, this.value ? 1 : 0);
    }

    render() {
        let className = classNames('btn', 'btn-default', { active: this.isActive() });

        return (
            <div>
                <a onClick={this.toggle.bind(this)}>{this.props.label}</a>
            </div>
        );
    }
}

ButtonField.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    type: React.PropTypes.string,
    updateField: React.PropTypes.func
};

export default ButtonField;
