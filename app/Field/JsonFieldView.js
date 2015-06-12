class JsonFieldView {
    static getReadWidget() {
        return '<JsonColumn value={this.props.value || {}} />';
    }

    static getLinkWidget() {
        return '<a onClick={this.props.detailAction}>' + JsonFieldView.getReadWidget() + '</a>';
    }

    static getFilterWidget() {
        // @TODO : Add filter
        return null;
    }

    static getWriteWidget() {
        // @TODO : use json input when implemented
        return '<InputField type={"text"} name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />';
    }
}

export default JsonFieldView;
