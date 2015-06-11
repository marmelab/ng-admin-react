class StringFieldView {
    static getReadWidget() {
        return '<StringColumn value={this.props.value} />';
    }

    static getLinkWidget() {
        return '<a onClick={this.props.detailAction}>' + StringFieldView.getReadWidget() + '</a>';
    }

    static getFilterWidget() {
        // @TODO : Add filter
        return null;
    }

    static getWriteWidget() {
        return '<InputField type={"text"} name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />';
    }
}

export default StringFieldView;
