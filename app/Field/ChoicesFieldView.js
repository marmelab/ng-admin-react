import React from 'react';
import ChoicesColumn from '../Component/Column/ChoicesColumn';
import ChoiceField from '../Component/Field/ChoiceField';

class ChoicesFieldView {
    static getReadWidget() {
        return <ChoicesColumn values={this.props.value} />;
    }

    static getLinkWidget() {
        // Due to a scope issue, we can't call ChoicesFieldView.getReadWidget() here
        return <a onClick={this.props.detailAction}><ChoicesColumn values={this.props.value} /></a>;
    }

    static getFilterWidget() {
        return (
            <ChoiceField field={this.props.field}
                fieldName={this.props.fieldName}
                values={this.props.values} value={this.props.value}
                multiple={true}
                updateField={this.props.updateField} />
            );
    }

    static getWriteWidget() {
        return (
            <ChoiceField field={this.props.field}
                fieldName={this.props.fieldName}
                values={this.props.values} value={this.props.value}
                multiple={true}
                updateField={this.props.updateField} />
            );
    }
}

export default ChoicesFieldView;
