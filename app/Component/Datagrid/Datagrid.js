import React from 'react';

import DatagridActions from '../../Actions/DatagridActions';
import DatagridStore from '../../Store/DatagridStore';
import { BooleanField, NumberField, TemplateField } from './Field';

class Datagrid extends React.Component {
    constructor() {
        this.state = {
            entries: []
        };
    }

    componentDidMount() {
        DatagridStore.listen(this.onChange.bind(this));
        DatagridActions.loadData(this.props.entity, this.props.perPage);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.entity !== this.props.entity) {
            DatagridActions.loadData(nextProps.entity, nextProps.perPage);
        }
    }

    componentWillUnmount() {
        DatagridStore.unlisten(this.onChange.bind(this));
    }

    onChange() {
        this.setState({ entries: DatagridStore.getState().entries });
    }

    handleSort(e) {
        e.preventDefault();
        DatagridActions.sort();
    }

    buildHeaders() {
        var headers = [];
        for (var fieldName in this.props.fields) {
            headers.push(
                <th key={fieldName}>
                    <a href="#" onClick={this.handleSort}>
                        {this.props.fields[fieldName].label()}
                    </a>
                </th>
            );
        }

        return headers;
    }

    buildRecords() {
        return this.state.entries.map(r => (
            <tr>{this.buildCells(r)}</tr>
        ));
    }

    buildCells(row) {
        var cells = [];
        for (var fieldName in this.props.fields) {
            if (!this.props.fields.hasOwnProperty(fieldName)) {
                continue;
            }

            var field = this.props.fields[fieldName];

            let renderedField;

            switch (field.type()) {
                case 'string':
                    renderedField = row[fieldName];
                    break;

                case 'boolean':
                    renderedField = <BooleanField value={row[fieldName]} />;
                    break;

                case 'template':
                    renderedField = <TemplateField template={field.template()} entry={row} />;
                    break;

                case 'number':
                    renderedField = <NumberField value={row[fieldName]} />;
                    break;

                default:
                    throw new Error(`Unknown field type "${field.type()}".`);
            }

            cells.push(<td>{renderedField}</td>);
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

export default Datagrid;
