import React from 'react';

import Header from '../../Component/Datagrid/ColumnHeader';
import ListActions from '../../Component/Datagrid/ListActions';

import { BooleanField, DateField, NumberField, ReferenceField, ReferenceManyField, TemplateField } from './Field';

class Datagrid extends React.Component {
    buildHeaders() {
        let headers = [];
        let listActions = this.props.view.listActions();
        let sortDir = this.props.sortDir;
        let sortField = this.props.sortField;

        for (let i in this.props.fields) {
            let fieldName = this.props.fields[i].name();
            let sort = null;

            if (this.props.view.name() + '.' + fieldName === sortField) {
                sort = sortDir;
            }

            headers.push(
                <Header
                    configuration={this.props.configuration}
                    sort={sort}
                    view={this.props.view}
                    fieldName={fieldName}
                    label={this.props.fields[i].label()}
                    actions={this.props.actions} />
            );
        }

        // List actions
        if (listActions && listActions.length) {
            headers.push(<th>Actions</th>);
        }

        return headers;
    }

    buildRecords() {
        return this.props.dataStore.getEntries(this.props.view.entity.uniqueId).map((r, i) => (
            <tr key={i}>{this.buildCells(r)}</tr>
        ));
    }

    buildCells(row) {
        let cells = [];
        let actions = this.props.view.listActions();

        for (let i in this.props.fields) {
            let field = this.props.fields[i];
            let fieldName = field.name();
            let renderedField;

            switch (field.type()) {
                case 'string':
                    renderedField = row.values[fieldName];
                    break;

                case 'boolean':
                    renderedField = <BooleanField value={row.values[fieldName]} />;
                    break;

                case 'date':
                    renderedField = <DateField value={row.values[fieldName]} format={field.format()} />;
                    break;

                case 'template':
                    renderedField = <TemplateField template={field.template()} entry={row} />;
                    break;

                case 'number':
                    renderedField = <NumberField value={row.values[fieldName]} />;
                    break;

                case 'reference':
                    renderedField = <ReferenceField value={row.listValues[fieldName]} />;
                    break;

                case 'reference_many':
                    renderedField = <ReferenceManyField values={row.listValues[fieldName]} />;
                    break;

                default:
                    throw new Error(`Unknown field type "${field.type()}".`);
            }

            cells.push(<td key={i}>{renderedField}</td>);
        }

        if (actions && actions.length) {
            cells.push(<td><ListActions view={this.props.view} entry={row} /></td>);
        }

        return cells;
    }

    render() {
        return (
            <table className="datagrid">
                <thead>
                    <tr>
                        {this.buildHeaders()}
                        <th></th>
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
    configuration: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
    view: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired,
    dataStore: React.PropTypes.object.isRequired,
    sortDir: React.PropTypes.string.isRequired,
    sortField: React.PropTypes.string.isRequired
};

export default Datagrid;
