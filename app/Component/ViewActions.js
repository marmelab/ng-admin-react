import React from 'react';
import Compile from './Compile';

import { FilterButton, MaBackButton, MaCreateButton, MaShowButton, MaEditButton, MaDeleteButton, MaListButton } from './Button';

class ViewActions extends React.Component {
    render() {
        const {size, entityName, buttons, entry, view} = this.props;
        let results;
        let i = 0;

        // Direct template
        if (typeof (listActions) === 'string') {
            return <Compile entityName={entityName} entry={entry}>listActions</Compile>;
        }

        results = buttons.map(button => {
            switch (button) {
                case 'filters':
                    return <FilterButton key={i++} entityName={entityName} filters={view.filters()} />;
                case 'create':
                    return <MaCreateButton key={i++} entityName={entityName} size={size} />;
                case 'show':
                    if (!entry) {
                        return <div key={i++} />;
                    }

                    return <MaShowButton key={i++} entityName={entityName} entry={entry} size={size} />;
                case 'back':
                    return <MaBackButton key={i++} size={size} />;
                case 'list':
                    return <MaListButton key={i++} entityName={entityName} size={size} />;
                case 'edit':
                    if (!entry) {
                        return <div key={i++} />;
                    }
                    return <MaEditButton key={i++} entityName={entityName} entry={entry} size={size} />;
                case 'delete':
                    if (!entry) {
                        return <div key={i++} />;
                    }

                    return <MaDeleteButton key={i++} entityName={entityName} entry={entry} size={size} />;
                default:
                    return <Compile entityName={entityName} entry={entry}>button</Compile>;
            }
        });

        return (
            <span className="ma-view-actions">{results}</span>
        );
    }
}

ViewActions.propTypes = {
    entityName: React.PropTypes.string,
    entry: React.PropTypes.object,
    buttons: React.PropTypes.array.isRequired,
    size: React.PropTypes.string,
    view: React.PropTypes.object
};

ViewActions.defaultProps = { view: null };

require('../autoloader')('ViewActions', ViewActions);

export default ViewActions;
