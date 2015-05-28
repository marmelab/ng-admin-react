import React from 'react';
import MaShowButton from '../Button/MaShowButton';
import MaEditButton from '../Button/MaEditButton';
import MaDeleteButton from '../Button/MaDeleteButton';

class ListActions extends React.Component {
    render() {
        let view = this.props.view,
            size = this.props.size,
            entity = view.entity,
            buttonNames = view.listActions(),
            buttons;

        buttons = buttonNames.map(button => {
            switch (button) {
                case 'show':
                    return <MaShowButton entity={entity} entry={this.props.entry} size={size} />;
                case 'edit':
                    return <MaEditButton entity={entity} entry={this.props.entry} size={size} />;
                case 'delete':
                    return <MaDeleteButton entity={entity} entry={this.props.entry} size={size} />;
                default:
                    return React.createElement(button)
            }
        });

        return (
            <span>{buttons}</span>
        );
    }
}

ListActions.propTypes = {
    view: React.PropTypes.object.isRequired,
    entry: React.PropTypes.object.isRequired,
    size: React.PropTypes.string,
};

export default ListActions;
