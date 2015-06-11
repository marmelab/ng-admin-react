class TemplateFieldView {
    static getReadWidget() {
        return '<TemplateColumn value={this.props.value} />';
    }

    static getLinkWidget() {
        return '<a onClick={this.props.detailAction}>' + TemplateFieldView.getReadWidget() + '</a>';
    }

    static getFilterWidget() {
        // @TODO : Add filter
        return null;
    }

    static getWriteWidget() {
        return '<TemplateColumn type={"text"} name={this.props.fieldName} value={this.props.value} />';
    }
}

export default TemplateFieldView;
