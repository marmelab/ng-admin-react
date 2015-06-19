import React from 'react';
import JsonColumn from '../Component/Column/JsonColumn';
import JsonField from '../Component/Field/JsonField';

class JsonFieldView {
    static getReadWidget() {
        return <JsonColumn value={this.props.value || {}} />;
    }

    static getLinkWidget() {
        return <a onClick={this.props.detailAction}><JsonColumn value={this.props.value || {}} /></a>;
    }

    static getFilterWidget() {
        // @TODO : Add filter
        return null;
    }

    static getWriteWidget() {
        return <JsonField name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />;
    }
}

export default JsonFieldView;
