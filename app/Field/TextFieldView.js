import React from 'react';
import StringColumn from '../Component/Column/StringColumn';
import TextField from '../Component/Field/TextField';

class TextFieldView {
    static getReadWidget() {
        return <StringColumn value={this.props.value} />;
    }

    static getLinkWidget() {
        return <a onClick={this.props.detailAction}><StringColumn value={this.props.value} /></a>;
    }

    static getFilterWidget() {
        return 'error: cannot display text field as filter';
    }

    static getWriteWidget() {
        return <TextField name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />;
    }
}

export default TextFieldView;
