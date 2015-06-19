import React from 'react';
import FileField from '../Component/Field/FileField';

class FileFieldView {
    static getReadWidget() {
        console.warn('error: cannot display file field as readable');
        return null;
    }

    static getLinkWidget() {
        console.warn('error: cannot display file field as linkable');
        return null;
    }

    static getFilterWidget() {
         return 'error: cannot display file field as filter';
    }

    static getWriteWidget() {
        return <FileField name={this.props.fieldName} field={this.props.field}  value={this.props.value} updateField={this.props.updateField} />;
    }
}

export default FileFieldView;
