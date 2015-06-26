import React from 'react';
import BooleanColumn from '../Component/Column/BooleanColumn';
import CheckboxField from '../Component/Field/CheckboxField';

class BooleanFieldView {
    static getReadWidget() {
        return <BooleanColumn value={this.props.value} />;
    }

    static getLinkWidget() {
        return <a onClick={this.props.detailAction}><BooleanColumn value={this.props.value} /></a>;
    }

    static getFilterWidget() {
        return <CheckboxField name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />;
    }

    static getWriteWidget() {
        return <CheckboxField name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />;
    }
}

export default BooleanFieldView;
