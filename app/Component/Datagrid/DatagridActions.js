import React from 'react';
import Compile from '../Compile';
import MaShowButton from '../Button/MaShowButton';
import MaEditButton from '../Button/MaEditButton';
import MaDeleteButton from '../Button/MaDeleteButton';

class DatagridActions extends React.Component {
    render() {
        const {size, entityName, listActions, entry} = this.props;
        let buttons;
        let i = 0;

        // Direct template
        if ('string' === typeof listActions) {
            return <Compile entityName={entityName} entry={entry}>{listActions}</Compile>;
        }

        buttons = listActions.map(button => {
            switch (button) {
                case 'show':
                    return <MaShowButton key={i++} entityName={entityName} entry={entry} size={size} />;
                case 'edit':
                    return <MaEditButton key={i++} entityName={entityName} entry={entry} size={size} />;
                case 'delete':
                    return <MaDeleteButton key={i++} entityName={entityName} entry={entry} size={size} />;
                default:
                    return <Compile key={i++} entityName={entityName} entry={entry}>{button}</Compile>;
            }
        });

        return (
            <span>{buttons}</span>
        );
    }
}

DatagridActions.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    listActions: React.PropTypes.array.isRequired,
    entry: React.PropTypes.object.isRequired,
    size: React.PropTypes.string
};

require('../../autoloader')('DatagridActions', DatagridActions);

export default DatagridActions;
