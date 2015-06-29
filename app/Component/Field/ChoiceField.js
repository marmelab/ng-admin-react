import React from 'react';
import SelectField from './SelectField';

class ChoiceField extends React.Component {
    render() {
        let choices = this.props.field.choices();
        if ('function' === typeof choices) {
            choices = choices({ values: this.props.values.toJS() });
        }

        return (
            <SelectField name={this.props.fieldName}
                choices={choices} value={this.props.value}
                multiple={this.props.multiple}
                updateField={this.props.updateField} />
            );
    }
}

ChoiceField.propTypes = {
    field: React.PropTypes.object.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    values: React.PropTypes.object.isRequired,
    value: React.PropTypes.any,
    multiple: React.PropTypes.bool,
    updateField: React.PropTypes.func
};

export default ChoiceField;
