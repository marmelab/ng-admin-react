import React from 'react';
import MaBackButton from './Button/MaBackButton';
import MaCreateButton from './Button/MaCreateButton';
import MaShowButton from './Button/MaShowButton';
import MaEditButton from './Button/MaEditButton';
import MaDeleteButton from './Button/MaDeleteButton';
import MaListButton from './Button/MaListButton';

class ViewActions extends React.Component {
    render() {
        let view = this.props.view,
            entity = view.entity,
            buttonNames = this.props.buttons,
            buttons;

        buttons = buttonNames.map(button => {
            switch (button) {
                case 'create':
                    return <MaCreateButton entity={entity} />
                case 'show':
                    return <MaShowButton entity={entity} entry={this.props.entry} />
                case 'back':
                    return <MaBackButton />
                case 'list':
                    return <MaListButton entity={entity} />
                case 'edit':
                    return <MaEditButton entity={entity} entry={this.props.entry} />
                case 'delete':
                    return <MaDeleteButton entity={entity} entry={this.props.entry} />
                default:
                    return React.createElement(button)
            }
        });

        return (
            <span>{buttons}</span>
        );
    }
}

ViewActions.propTypes = {
    view: React.PropTypes.object.isRequired,
    buttons: React.PropTypes.array.isRequired
};

export default ViewActions;
