import React from 'react';
import {Link} from 'react-router';

class MaCreateButton extends React.Component {
    render() {
        const size = this.props.size ? ` btn-${this.props.size}` : '';
        const className = `btn btn-create btn-default${size}`;
        const params = {
                entity: this.props.entityName
            };

        return (
            <Link className={className} to="create" params={params}>
                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;{this.props.label || 'Create'}
            </Link>
        );
    }
}

MaCreateButton.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

require('../../autoloader')('MaCreateButton', MaCreateButton);

export default MaCreateButton;
