import React from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Header from '../../Component/Datagrid/ColumnHeader';
import DatagridActions from '../../Component/Datagrid/DatagridActions';

import Column from '../Column/Column';

class Datagrid extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    getDetailAction(entry) {
        return () => {
            const entityName = this.props.entityName;
            const entity = this.context.configuration.getEntity(entityName);
            const route = entity.editionView().enabled ? 'edit' : 'show';

            this.context.router.transitionTo(route, {entity: entityName, id: entry.identifierValue});
        };
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

    buildHeaders() {
        let headers = [];
        const {name, listActions, sortDir, sortField} = this.props;

        for (let i in this.props.fields) {
            const fieldName = this.props.fields[i].name();
            let sort = null;

            if (`${name}.${fieldName}` === sortField) {
                sort = sortDir;
            }

            headers.push(
                <Header
                    key={i}
                    sort={sort}
                    name={this.props.name}
                    fieldName={fieldName}
                    label={this.props.fields[i].label()}
                    onSort={this.props.onSort} />
            );
        }

        // List actions
        if (listActions && listActions.length) {
            headers.push(<th key={'actions'}>Actions</th>);
        }

        return headers;
    }

    buildRecords() {
        const entity = this.context.configuration.getEntity(this.props.entityName);

        return this.props.entries.map((r, i) => (
            <tr key={i}>{this.buildCells(r, entity)}</tr>
        ));
    }

    buildCells(row, entity) {
        let cells = [];
        const actions = this.props.listActions;
        const entityName = this.props.entityName;

        for (let i in this.props.fields) {
            const field = this.props.fields[i];
            const renderedField = <Column field={field} entity={entity} entry={row} />;

            cells.push(<td key={i}>{renderedField}</td>);
        }

        if (actions && actions.length) {
            cells.push(<td key={'datagrid-actions'}>
                <DatagridActions entityName={entityName} listActions={actions} entry={row} size={'xs'} />
            </td>);
        }

        return cells;
    }

    render() {
        return (
            <table className="datagrid">
                <thead>
                    <tr>
                        {this.buildHeaders()}
                    </tr>
                </thead>
                <tbody>
                    {this.buildRecords()}
                </tbody>
            </table>
        );
    }
}

Datagrid.propTypes = {
    name: React.PropTypes.string.isRequired,
    entityName: React.PropTypes.string.isRequired,
    listActions: React.PropTypes.array.isRequired,
    fields: React.PropTypes.array.isRequired,
    entries: React.PropTypes.array.isRequired,
    sortDir: React.PropTypes.string,
    sortField: React.PropTypes.string,
    onSort: React.PropTypes.func
};

Datagrid.contextTypes = {
    router: React.PropTypes.func.isRequired,
    configuration: React.PropTypes.object
};

require('../../autoloader')('Datagrid', Datagrid);

export default Datagrid;
