import React from 'react';
import ReferencedList from '../Component/Column/ReferencedList';

class ReferencedListFieldView {
    static getReadWidget() {
        return (
            <ReferencedList
                entries={this.props.dataStore.getEntries(this.props.field.targetEntity().uniqueId + '_list') || []}
                entityName={this.props.field.targetEntity().name()}
                field={this.props.field} />
            );
    }

    static getLinkWidget() {
        return 'error: cannot display referenced_list field as linkable';
    }

    static getFilterWidget() {
        return 'error: cannot display referenced_list field as filter';
    }

    static getWriteWidget() {
        return (
            <ReferencedList
                entries={this.props.dataStore.getEntries(this.props.field.targetEntity().uniqueId + '_list') || []}
                entityName={this.props.field.targetEntity().name()}
                field={this.props.field} />
            );
    }
}

ReferencedListFieldView.propTypes = {
    entity: React.PropTypes.object.isRequired,
    field: React.PropTypes.object.isRequired,
    entries: React.PropTypes.array.isRequired
};

export default ReferencedListFieldView;
