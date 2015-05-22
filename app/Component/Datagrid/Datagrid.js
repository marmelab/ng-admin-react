import React from 'react';
import shouldComponentUpdate from 'omniscient/shouldupdate';

import MaDatagridPagination from './MaDatagridPagination';
import DatagridActions from '../../Actions/DatagridActions';
import DatagridStore from '../../Stores/DatagridStore';
import Header from '../../Component/Datagrid/ColumnHeader';
import ListActions from '../../Component/Datagrid/ListActions';

import { BooleanField, DateField, NumberField, ReferenceField, ReferenceManyField, TemplateField } from './Field';

class Datagrid extends React.Component {
    constructor() {
        super();

        this.state = DatagridStore.getState();
        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        DatagridStore.addChangeListener(this.onChange.bind(this));

        let {page} = this.props.router.getCurrentQuery();
        this.refreshData(this.props.view, page);
    }

    componentWillReceiveProps(nextProps) {
        let {page} = this.props.router.getCurrentQuery();
        let currentPage = this.state.data.get('page');

        if (nextProps.view !== this.props.view || page !== currentPage) {
            // Shouldn't switching view prop re-render component directly?
            this.refreshData(nextProps.view, page);
        }
    }

    componentWillUnmount() {
        DatagridStore.removeChangeListener(this.onChange.bind(this));
    }

    onChange() {
        this.setState(DatagridStore.getState());
    }

    refreshData(view, page) {
        DatagridActions.loadData(this.props.configuration, view, page);
    }

    buildHeaders() {
        let headers = [];
        let actions = this.props.view.listActions();
        let sortDir = this.state.data.get('sortDir');
        let sortField = this.state.data.get('sortField');

        for (let fieldName in this.props.fields) {
            let sort = null;
            if (this.props.view.name() + "." + fieldName === sortField) {
                sort = sortDir;
            }

            headers.push(
                <Header sort={sort} view={this.props.view} fieldName={fieldName} label={this.props.fields[fieldName].label()} />
            );
        }

        // List actions
        if (actions && actions.length) {
            headers.push(<th>Actions</th>);
        }

        return headers;
    }

    buildRecords() {
        return this.state.data.get('entries').map((r, i) => (
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
                    renderedField = <ReferenceField value={row.values[fieldName]} />;
                    break;

                case 'reference_many':
                    renderedField = <ReferenceManyField values={row.values[fieldName]} />;
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
        if (this.state.data.get('pending')) return null;
        let totalItems = this.state.data.get('totalItems');
        let {page} = this.props.router.getCurrentQuery();
        let view = this.props.view;

        return (
            <div>
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

                <MaDatagridPagination totalItems={totalItems} entity={view.entity.name()} page={page} perPage={view.perPage()} />
            </div>
        );
    }
}

Datagrid.propTypes = {
    configuration: React.PropTypes.object.isRequired,
    view: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired
};

export default Datagrid;
