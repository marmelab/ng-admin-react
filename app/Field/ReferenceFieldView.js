import React from 'react';
import ReferenceColumn from '../Component/Column/ReferenceColumn';
import SelectField from '../Component/Field/SelectField';

class ReferenceFieldView {
    static getReadWidget() {
        return (
            <ReferenceColumn
                value={this.props.entry.listValues[this.props.field.name()]}
                field={this.props.field}
                entry={this.props.entry} />
            );
    }

    static getLinkWidget() {
        // Due to a scope issue, we can't call ReferenceFieldView.getReadWidget() here
        return (
            <ReferenceColumn
                value={this.props.entry.listValues[this.props.field.name()]}
                field={this.props.field}
                entry={this.props.entry} />
            );
    }

    static getFilterWidget() {
        const choices = this.props.dataStore.getChoices(this.props.field);
        let value = this.props.value;

        // ui-select doesn't handle direct value so we have to pass the label
        if (value && choices) {
            for (let i in choices) {
                let choice = choices[i];

                if (choice.value == value) {
                    value = choice.label;
                    break;
                }
            }
        }

        return (
            <SelectField
                name={this.props.fieldName}
                value={value}
                choices={choices}
                updateField={this.props.updateField} />
            );
    }

    static getWriteWidget() {
        return (
            <SelectField
                name={this.props.fieldName}
                value={this.props.value}
                choices={this.props.dataStore.getChoices(this.props.field)}
                updateField={this.props.updateField} />
            );
    }
}

export default ReferenceFieldView;
