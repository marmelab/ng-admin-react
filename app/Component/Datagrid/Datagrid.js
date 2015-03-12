import React from 'react';

import DatagridActions from '../../Actions/DatagridActions';
import DatagridStore from '../../Store/DatagridStore';

class Datagrid extends React.Component {
    constructor() {
        this.state = {
            entries: [
                { id: 1, name: "Foo", published: "true" },
                { id: 2, name: "Bar", published: "false" }
            ]
        }
    }

    componentDidMount() {
        DatagridStore.listen(this.onChange.bind(this));
    }

    componentWillUnmount() {
        DatagridStore.unlisten(this.onChange.bind(this));
    }

    onChange() {
        let entries = this.state.entries;
        let newEntries = [entries[1], entries[0]];
        this.setState({ entries: newEntries });
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
        for (var fieldName in row) {
            cells.push(<td>{row[fieldName]}</td>);
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
