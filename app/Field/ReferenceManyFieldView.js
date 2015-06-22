import React from 'react';
import ReferenceManyColumn from '../Component/Column/ReferenceManyColumn';
import SelectField from '../Component/Field/SelectField';

class ReferenceManyFieldView {
    static getReadWidget() {
        return <ReferenceManyColumn field={this.props.field} entry={this.props.entry}
            values={this.props.entry.listValues[this.props.field.name()]} />;
    }

    static getLinkWidget() {
        // Links are handled individually by the read component
        // Due to a scope issue, we can't call ReferenceManyFieldView.getReadWidget() here
        return <ReferenceManyColumn field={this.props.field} entry={this.props.entry}
                                    values={this.props.entry.listValues[this.props.field.name()]} />;
    }

    static getFilterWidget() {
        // @TODO : change when reference filter will be implemented
        return null;
    }

    static getWriteWidget() {
        return <SelectField name={this.props.fieldName} value={this.props.value}
                            choices={this.props.dataStore.getChoices(this.props.field)}
                            multiple={true}
                            updateField={this.props.updateField} />;
    }
}

export default ReferenceManyFieldView;
