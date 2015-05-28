import React from 'react';
import MaBackButton from './Button/MaBackButton';
import MaCreateButton from './Button/MaCreateButton';
import MaShowButton from './Button/MaShowButton';
import MaEditButton from './Button/MaEditButton';
import MaDeleteButton from './Button/MaDeleteButton';
import MaListButton from './Button/MaListButton';

class ViewActions extends React.Component {
    render() {
        let {size, entityName, buttons} = this.props;
        let results;

        results = buttons.map(button => {
            switch (button) {
                case 'create':
                    return <MaCreateButton entityName={entityName} size={size} />;
                case 'show':
                    return <MaShowButton entityName={entityName} entry={this.props.entry} size={size} />;
                case 'back':
                    return <MaBackButton size={size} />;
                case 'list':
                    return <MaListButton entityName={entityName} size={size} />;
                case 'edit':
                    return <MaEditButton entityName={entityName} entry={this.props.entry} size={size} />;
                case 'delete':
                    return <MaDeleteButton entityName={entityName} entry={this.props.entry} size={size} />;
                default:
                    return React.createElement(button);
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
    size: React.PropTypes.string
};

ViewActions.defaultProps = { view: null };

export default ViewActions;
