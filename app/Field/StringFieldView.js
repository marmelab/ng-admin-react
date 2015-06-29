import React from 'react';
import StringColumn from '../Component/Column/StringColumn';
import InputField from '../Component/Field/InputField';

class StringFieldView {
    static getReadWidget() {
        return <StringColumn value={this.props.value} />;
    }

    static getLinkWidget() {
        return <a onClick={this.props.detailAction}><StringColumn value={this.props.value} /></a>;
    }

    static getFilterWidget() {
        return (
            <InputField
                type={"text"}
                name={this.props.fieldName}
                value={this.props.value}
                updateField={this.props.updateField}
                autoFocus={this.props.autoFocus} />
            );
    }

    static getWriteWidget() {
        return (
            <InputField
                type={"text"}
                name={this.props.fieldName}
                value={this.props.value}
                updateField={this.props.updateField}
                autoFocus={this.props.autoFocus} />
            );
    }
}

export default StringFieldView;
