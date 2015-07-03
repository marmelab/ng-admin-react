import React from 'react';

import Compile from '../Compile';
import FieldViewConfiguration from '../../Field/FieldViewConfiguration';

class Column extends React.Component {
    getDetailAction (entry) {
        return function() {
            const entityName = this.props.entity.name();
            const entity = this.context.configuration.getEntity(entityName);
            const route = entity.editionView().enabled ? 'edit' : 'show';

            this.context.router.transitionTo(route, {entity: entityName, id: entry.identifierValue});
        }.bind(this);
    }

    isDetailLink(field) {
        if (false === field.isDetailLink()) {
            return false;
        }

        if (-1 === field.type().indexOf('reference')) {
            return true;
        }

        const referenceEntity = field.targetEntity().name();
        const relatedEntity = this.context.configuration.getEntity(referenceEntity);

        if (!relatedEntity) { return false; }

        return relatedEntity.isReadOnly ? relatedEntity.showView().enabled : relatedEntity.editionView().enabled;
    }

    render() {
        const {field, entry, entity} = this.props;
        const isDetailLink = this.isDetailLink(field);
        const detailAction = isDetailLink ? this.getDetailAction(this.props.entry) : null;
        const type = field.type();
        const value = entry.values[field.name()] || null;
        const fieldView = FieldViewConfiguration.getFieldView(type);

        let column = null;

        if (fieldView) {
            column = isDetailLink ? fieldView.getLinkWidget : fieldView.getReadWidget;
        }

        return (
            <Compile detailAction={detailAction} field={field} configuration={this.context.configuration}
                dataStore={this.props.dataStore} entity={entity} entry={entry} value={value}>
                {column}
            </Compile>
        );
    }
}

Column.propTypes = {
    field: React.PropTypes.object.isRequired,
    entry: React.PropTypes.object.isRequired,
    entity: React.PropTypes.object.isRequired,
    dataStore: React.PropTypes.object
};

Column.contextTypes = {
    router: React.PropTypes.func.isRequired,
    configuration: React.PropTypes.object.isRequired
};

export default Column;
