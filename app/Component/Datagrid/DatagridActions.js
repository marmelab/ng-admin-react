import React from 'react';
import MaShowButton from '../Button/MaShowButton';
import MaEditButton from '../Button/MaEditButton';
import MaDeleteButton from '../Button/MaDeleteButton';

class DatagridActions extends React.Component {
    render() {
        let {size, entityName, listActions} = this.props;
        let buttons;
        let i = 0;

        buttons = listActions.map(button => {
            switch (button) {
                case 'show':
                    return <MaShowButton key={i++} entityName={entityName} entry={this.props.entry} size={size} />;
                case 'edit':
                    return <MaEditButton key={i++} entityName={entityName} entry={this.props.entry} size={size} />;
                case 'delete':
                    return <MaDeleteButton key={i++} entityName={entityName} entry={this.props.entry} size={size} />;
                default:
                    return React.createElement(button)
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

export default DatagridActions;
