import React from 'react';

import DatagridActions from '../../Actions/DatagridActions';
import DatagridStore from '../../Stores/DatagridStore';
import Header from '../../Component/Datagrid/ColumnHeader';

import { BooleanField, DateField, NumberField, ReferenceField, ReferenceManyField, TemplateField } from './Field';

class Datagrid extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = DatagridStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        DatagridStore.addChangeListener(this.onChange);
        this.refreshData(this.props.view);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.view !== this.props.view) {
            // Shouldn't switching view prop re-render component directly?
            this.state.entries = []; // hack...
            this.refreshData(nextProps.view);
        }
    }

    componentWillUnmount() {
        DatagridStore.removeChangeListener(this.onChange);
    }

    onChange() {
        this.setState(DatagridStore.getState());
    }

    refreshData(view) {
        DatagridActions.loadData(view);
    }

    buildHeaders() {
        let headers = [];

        let sortDir = this.state.sortDir;
        let sortField = this.state.sortField;

        for (let fieldName in this.props.fields) {
            let sort = null;
            if (this.props.view.name() + "." + fieldName === sortField) {
                sort = sortDir;
            }

            headers.push(
                <Header sort={sort} view={this.props.view} fieldName={fieldName} label={this.props.fields[fieldName].label()} />
            );
        }

        return headers;
    }

    buildRecords() {
        return this.state.entries.map((r, i) => (
            <tr key={i}>{this.buildCells(r)}</tr>
        ));
    }

    buildCells(row) {
        let cells = [];

        for (let i in this.props.fields) {
            let field = this.props.fields[i],
                fieldName = field.name(),
                renderedField;

            switch (field.type()) {
                case 'string':
                    renderedField = row[fieldName];
                    break;

                case 'boolean':
                    renderedField = <BooleanField value={row[fieldName]} />;
                    break;

                case 'date':
                    renderedField = <DateField value={row[fieldName]} format={field.format()} />;
                    break;

                case 'template':
                    renderedField = <TemplateField template={field.template()} entry={row} />;
                    break;

                case 'number':
                    renderedField = <NumberField value={row[fieldName]} />;
                    break;

                case 'reference':
                    renderedField = <ReferenceField value={row[fieldName]} />;
                    break;

                case 'reference_many':
                    renderedField = <ReferenceManyField values={row[fieldName]} />;
                    break;

                default:
                    throw new Error(`Unknown field type "${field.type()}".`);
            }

            cells.push(<td key={i}>{renderedField}</td>);
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
    view: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired
};

export default Datagrid;
