import React from 'react';
import Datagrid from '../Datagrid/Datagrid';
import PathUtils from 'react-router/lib/PathUtils';

class ReferencedList extends React.Component {
    render() {
        let {entries, field, entityName} = this.props;
        let {sortDir, sortField} = PathUtils.extractQuery(window.location.hash) || {};

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
                />
        );
    }
}

ReferencedList.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    entries: React.PropTypes.array.isRequired,
    field: React.PropTypes.object.isRequired
};

export default ReferencedList;
