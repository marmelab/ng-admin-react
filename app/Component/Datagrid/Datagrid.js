import React from 'react';

class Datagrid extends React.Component {
    buildHeaders() {
        var headers = [];
        for (var fieldName in this.props.fields) {
            headers.push(
                <th key={fieldName}>
                    <a href="#" onClick={this.props.onSort}>
                        {this.props.fields[fieldName].label()}
                    </a>
                </th>
            );
        }

        return headers;
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
                    <tr>
                        <td>12</td>
                        <td>Foobar</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Datagrid;
