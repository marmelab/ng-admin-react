import React from 'react';
import StringColumn from '../Component/Column/StringColumn';
import FileField from '../Component/Field/FileField';

class FileFieldView {
    static getReadWidget() {
        return <StringColumn value={this.props.value} />;
    }

    static getLinkWidget() {
        console.warn('error: cannot display file field as linkable');
        return null;
    }

    static getFilterWidget() {
         return 'error: cannot display file field as filter';
    }

    static getWriteWidget() {
        return <FileField name={this.props.fieldName} field={this.props.field} value={this.props.value} updateField={this.props.updateField} />;
    }
}

export default FileFieldView;
