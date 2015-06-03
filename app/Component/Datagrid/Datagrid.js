import React from 'react';

import Header from '../../Component/Datagrid/ColumnHeader';
import DatagridActions from '../../Component/Datagrid/DatagridActions';

import { BooleanColumn, DateColumn, NumberColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn } from '../Column';

class Datagrid extends React.Component {
    buildHeaders() {
        let headers = [];
        let {name, listActions, sortDir, sortField} = this.props;

        for (let i in this.props.fields) {
            let fieldName = this.props.fields[i].name();
            let sort = null;

            if (name + '.' + fieldName === sortField) {
                sort = sortDir;
            }

            headers.push(
                <Header
                    key={i}
                    configuration={this.props.configuration}
                    sort={sort}
                    name={this.props.name}
                    fieldName={fieldName}
                    label={this.props.fields[i].label()} />
            );
        }

        // List actions
        if (listActions && listActions.length) {
            headers.push(<th key={'actions'}>Actions</th>);
        }

        return headers;
    }

    buildRecords() {
        return this.props.entries.map((r, i) => (
            <tr key={i}>{this.buildCells(r)}</tr>
        ));
    }

    buildCells(row) {
        let cells = [];
        let actions = this.props.listActions;
        let entityName = this.props.entityName;

        for (let i in this.props.fields) {
            let field = this.props.fields[i];
            let fieldName = field.name();
            let renderedField;

            switch (field.type()) {
                case 'string':
                    renderedField = row.values[fieldName];
                    break;

                case 'boolean':
                    renderedField = <BooleanColumn value={!!row.values[fieldName]} />;
                    break;

                case 'date':
                    renderedField = <DateColumn value={row.values[fieldName]} format={field.format()} />;
                    break;

                case 'template':
                    renderedField = <TemplateColumn template={field.template()} entry={row} />;
                    break;

                case 'number':
                    renderedField = <NumberColumn value={row.values[fieldName]} />;
                    break;

                case 'reference':
                    renderedField = <ReferenceColumn value={row.listValues[fieldName]} />;
                    break;

                case 'reference_many':
                    renderedField = <ReferenceManyColumn values={row.listValues[fieldName]} />;
                    break;

                default:
                    throw new Error(`Unknown field type "${field.type()}".`);
            }

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
    configuration: React.PropTypes.object,
    listActions: React.PropTypes.array.isRequired,
    fields: React.PropTypes.array.isRequired,
    entries: React.PropTypes.array.isRequired,
    sortDir: React.PropTypes.string,
    sortField: React.PropTypes.string
};

Datagrid.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Datagrid;
