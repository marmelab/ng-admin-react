import React from 'react';

import DatagridActions from '../../Actions/DatagridActions';
import DatagridStore from '../../Store/DatagridStore';

class Datagrid extends React.Component {
    constructor() {
        this.state = {
            entries: []
        };
    }

    componentDidMount() {
        DatagridStore.listen(this.onChange.bind(this));
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
