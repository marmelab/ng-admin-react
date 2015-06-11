class ReferenceManyFieldView {
    static getReadWidget() {
        return '<ReferenceManyColumn field={this.props.field} entry={this.props.entry} ' +
            'values={this.props.entry.listValues[this.props.field.name()]} />';
    }

    static getLinkWidget() {
        // Links are handled individually by the read component
        return ReferenceManyFieldView.getReadWidget();
    }

    static getFilterWidget() {
        // @TODO : change when reference filter will be implemented
        return null;
    }

    static getWriteWidget() {
        // @TODO: change it when choice input will be implemented
        return null;
    }
}

export default ReferenceManyFieldView;
