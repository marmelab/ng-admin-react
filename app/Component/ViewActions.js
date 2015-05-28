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
            size = this.props.size,
            entity = view ? view.entity : null,
            buttonNames = this.props.buttons,
            buttons;

        buttons = buttonNames.map(button => {
            switch (button) {
                case 'create':
                    return <MaCreateButton entity={entity} size={size} />;
                case 'show':
                    return <MaShowButton entity={entity} entry={this.props.entry} size={size} />;
                case 'back':
                    return <MaBackButton size={size} />;
                case 'list':
                    return <MaListButton entity={entity} size={size} />;
                case 'edit':
                    return <MaEditButton entity={entity} entry={this.props.entry} size={size} />;
                case 'delete':
                    return <MaDeleteButton entity={entity} entry={this.props.entry} size={size} />;
                default:
                    return React.createElement(button);
            }
        });

        return (
            <span className="ma-view-actions">{buttons}</span>
        );
    }
}

ViewActions.propTypes = {
    view: React.PropTypes.object,
    entry: React.PropTypes.object,
    buttons: React.PropTypes.array.isRequired,
    size: React.PropTypes.string
};

ViewActions.defaultProps = { view: null };

export default ViewActions;
