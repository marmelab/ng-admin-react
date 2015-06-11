class BooleanFieldView {
    static getReadWidget() {
        return '<BooleanColumn value={this.props.value} />';
    }

    static getLinkWidget() {
        return '<a onClick={this.props.detailAction}>' + BooleanFieldView.getReadWidget() + '</a>';
    }

    static getFilterWidget() {
        // @TODO : Add filter
        return null;
    }

    static getWriteWidget() {
        // @TODO: use boolean input when implemented
        return '<InputField type={"text"} name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />';
    }
}

export default BooleanFieldView;
