import React from 'react';
import WysiwygColumn from '../Component/Column/WysiwygColumn';
import WysiwygField from '../Component/Field/WysiwygField';

class WysiwygFieldView {
    static getReadWidget() {
        return <StringColumn value={this.props.value} />;
    }

    static getLinkWidget() {
        return 'error: cannot display wysiwyg field as linkable';
    }

    static getFilterWidget() {
        // @TODO : Add filter
        return null;
    }

    static getWriteWidget() {
        return <WysiwygField name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />;
    }
}

export default WysiwygFieldView;
