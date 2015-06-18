import React from 'react';
import StringColumn from '../Component/Column/StringColumn';
import SelectField from '../Component/Field/SelectField';

class ChoiceFieldView {
    static getReadWidget() {
        return <StringColumn value={this.props.field.getLabelForChoice(this.props.value, this.props.entry)} />;
    }

    static getLinkWidget() {
        // Due to a scope issue, we can't call ChoiceFieldView.getReadWidget() here
        return <a onClick={this.props.detailAction}><StringColumn value={this.props.field.getLabelForChoice(this.props.value, this.props.entry)} /></a>;
    }

    static getFilterWidget() {
        // @TODO : change when reference filter will be implemented
        return null;
    }

    static getWriteWidget() {
        let choices = this.props.field.choices();
        if (typeof(choices) === 'function') {
            choices = choices({ values: this.props.values.toJS() });
        }

        return <SelectField name={this.props.fieldName}
                            choices={choices} value={this.props.value}
                            updateField={this.props.updateField} />;
    }
}

export default ChoiceFieldView;
