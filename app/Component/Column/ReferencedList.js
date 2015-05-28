import React from 'react';
import Datagrid from '../Datagrid/Datagrid';

class ReferencedList extends React.Component {
    render() {
        let {entries, field, entityName} = this.props;

        return (
            <Datagrid
                entityName={entityName}
                name={field.datagridName()}
                actions={null}
                listActions={[]}
                fields={field.targetFields()}
                entries={entries} />
        );
    }
}

ReferencedList.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    entries: React.PropTypes.array.isRequired,
    field: React.PropTypes.object.isRequired
};

export default ReferencedList;
