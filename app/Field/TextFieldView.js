import React from 'react';
import StringColumn from '../Component/Column/StringColumn';
import InputField from '../Component/Field/InputField';

class TextFieldView {
    static getReadWidget() {
        return <StringColumn value={this.props.value} />;
    }

    static getLinkWidget() {
        return <a onClick={this.props.detailAction}><StringColumn value={this.props.value} /></a>;
    }

    static getFilterWidget() {
        // @TODO : Add filter
        return null;
    }

    static getWriteWidget() {
        // @TODO : Use text input field (textarea) when implemented
        return <InputField type={"text"} name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />;
    }
}

export default TextFieldView;
