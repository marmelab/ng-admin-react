import React from 'react';
import {Link} from 'react-router';

class MaListButton extends React.Component {
    render() {
        const size = this.props.size ? ` btn-${this.props.size}` : '';
        const className = `btn btn-list btn-default${size}`;
        const params = {
                entity: this.props.entityName
            };

        return (
            <Link className={className} to="list" params={params}>
                <span className="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;{this.props.label || 'List'}
            </Link>
        );
    }
}

MaListButton.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

require('../../autoloader')('MaListButton', MaListButton);

export default MaListButton;
