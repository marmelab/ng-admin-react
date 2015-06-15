import ReferenceColumn from '../Component/Column/ReferenceColumn';

class ReferenceFieldView {
    static getReadWidget() {
        return <ReferenceColumn value={this.props.entry.listValues[this.props.field.name()]}
            field={this.props.field} entry={this.props.entry} />;
    }

    static getLinkWidget() {
        // Due to a scope issue, we can't call ReferenceFieldView.getReadWidget() here
        return <ReferenceColumn value={this.props.entry.listValues[this.props.field.name()]}
                                field={this.props.field} entry={this.props.entry} />;
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
