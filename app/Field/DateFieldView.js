import React from 'react';
import DateColumn from '../Component/Column/DateColumn';
import DateField from '../Component/Field/DateField';

class DateFieldView {
    static getReadWidget() {
        return <DateColumn value={this.props.value} />;
    }

    static getLinkWidget() {
        return <a onClick={this.props.detailAction}><DateColumn value={this.props.value} /></a>;
    }

    static getFilterWidget() {
        return <DateField type={this.props.field.type()} name={this.props.fieldName} field={this.props.field} value={this.props.value} updateField={this.props.updateField} />;
    }

    static getWriteWidget() {
        return <DateField type={this.props.field.type()} name={this.props.fieldName} field={this.props.field} value={this.props.value} updateField={this.props.updateField} />;
    }
}

export default DateFieldView;
