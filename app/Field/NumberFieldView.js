class NumberFieldView {
    static getReadWidget() {
        return '<NumberColumn value={this.props.value} />';
    }

    static getLinkWidget() {
        return '<a onClick={this.props.detailAction}>' + NumberFieldView.getReadWidget() + '</a>';
    }

    static getFilterWidget() {
        // @TODO : Add filter
        return null;
    }

    static getWriteWidget() {
        // @TODO: use number input when implemented
        return '<InputField type={"number"} name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />';
    }
}

export default NumberFieldView;
