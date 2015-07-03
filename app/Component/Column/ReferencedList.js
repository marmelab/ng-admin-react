import React from 'react';
import Datagrid from '../Datagrid/Datagrid';

class ReferencedList extends React.Component {
    render() {
        const {entries, field, entityName} = this.props;
        const {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        return (
            <Datagrid
                entityName={entityName}
                name={field.datagridName()}
                actions={null}
                listActions={[]}
                fields={field.targetFields()}
                entries={entries}
                sortDir={sortDir}
                sortField={sortField}
                configuration={this.context.configuration}
                />
        );
    }
}

ReferencedList.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    entries: React.PropTypes.array.isRequired,
    field: React.PropTypes.object.isRequired
};

ReferencedList.contextTypes = {
    router: React.PropTypes.func.isRequired,
    configuration: React.PropTypes.object.isRequired
};

require('../../autoloader')('ReferencedList', ReferencedList);

export default ReferencedList;
