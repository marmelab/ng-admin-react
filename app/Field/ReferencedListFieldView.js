class ReferencedListFieldView {
    static getReadWidget() {
        return '<ReferencedList entries={this.props.entries} entityName={this.props.entity.name()} field={field} />';
    }

    static getLinkWidget() {
        return 'error: cannot display referenced_list field as linkable';
    }

    static getFilterWidget() {
        return 'error: cannot display referenced_list field as filter';
    }

    static getWriteWidget() {
        return ReferencedListFieldView.getReadWidget();
    }
}

export default ReferencedListFieldView;
