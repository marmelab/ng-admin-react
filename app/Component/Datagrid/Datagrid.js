import React from 'react';

class Datagrid extends React.Component {
    buildHeaders() {
        var headers = [];
        for (var fieldName in this.props.fields) {
            headers.push(<th key={fieldName}>{this.props.fields[fieldName].label()}</th>);
        }

        return headers;
    }

    render() {
        return (
            <table className="datagrid">
                <thead>
                    <tr>
                        {this.buildHeaders()}
                        <th></th> // for actions
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
