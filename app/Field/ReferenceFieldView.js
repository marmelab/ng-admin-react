class ReferenceFieldView {
    static getReadWidget() {
        return '<ReferenceColumn value={this.props.entry.listValues[this.props.field.name()]} ' +
            'field={this.props.field} entry={this.props.entry} />';
    }

    static getLinkWidget() {
        return '<a onClick={this.props.detailAction}>' + ReferenceFieldView.getReadWidget() + '</a>';
    }

    static getFilterWidget() {
        // @TODO : change when reference filter will be implemented
        return null;
    }

    static getWriteWidget() {
        // @TODO : change when reference input will be implemented
        return null;
    }
}

export default ReferenceFieldView;
