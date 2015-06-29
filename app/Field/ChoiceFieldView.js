import React from 'react';
import StringColumn from '../Component/Column/StringColumn';
import ChoiceField from '../Component/Field/ChoiceField';

class ChoiceFieldView {
    static getReadWidget() {
        return <StringColumn value={this.props.field.getLabelForChoice(this.props.value, this.props.entry)} />;
    }

    static getLinkWidget() {
        // Due to a scope issue, we can't call ChoiceFieldView.getReadWidget() here
        return <a onClick={this.props.detailAction}><StringColumn value={this.props.field.getLabelForChoice(this.props.value, this.props.entry)} /></a>;
    }

    static getFilterWidget() {
        return (
            <ChoiceField field={this.props.field}
                fieldName={this.props.fieldName}
                values={this.props.values} value={this.props.value}
                updateField={this.props.updateField} />
            );
    }

    static getWriteWidget() {
        return (
            <ChoiceField field={this.props.field}
                fieldName={this.props.fieldName}
                values={this.props.values} value={this.props.value}
                updateField={this.props.updateField} />
            );
    }
}

export default ChoiceFieldView;
