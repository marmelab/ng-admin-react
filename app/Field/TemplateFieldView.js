import React from 'react';
import TemplateColumn from '../Component/Column/TemplateColumn';

class TemplateFieldView {
    static getReadWidget() {
        return <TemplateColumn template={this.props.field.template()} entry={this.props.entry} />;
    }

    static getLinkWidget() {
        return (
            <a onClick={this.props.detailAction}>
                <TemplateColumn template={this.props.field.template()} entry={this.props.entry} />
            </a>
        );
    }

    static getFilterWidget() {
        return <TemplateColumn type={"text"} name={this.props.fieldName} value={this.props.value} />;
    }

    static getWriteWidget() {
        return <TemplateColumn type={"text"} name={this.props.fieldName} value={this.props.value} />;
    }
}

export default TemplateFieldView;
