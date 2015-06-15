import ReferencedList from '../Component/Column/ReferencedList';

class ReferencedListFieldView {
    static getReadWidget() {
        return <ReferencedList entries={this.props.dataStore.getEntries(this.props.field.targetEntity().uniqueId + "_list") || []}
            entityName={this.props.entity.name()} field={this.props.field} configuration={this.props.configuration} />;
    }

    static getLinkWidget() {
        return 'error: cannot display referenced_list field as linkable';
    }

    static getFilterWidget() {
        return 'error: cannot display referenced_list field as filter';
    }

    static getWriteWidget() {
        return <ReferencedList entries={this.props.dataStore.getEntries(this.props.field.targetEntity().uniqueId + "_list") || []}
                               entityName={this.props.entity.name()} field={this.props.field} configuration={this.props.configuration} />;
    }
}

export default ReferencedListFieldView;
