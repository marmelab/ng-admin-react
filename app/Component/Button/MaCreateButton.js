import React from 'react';
import {Link} from 'react-router';

class MaCreateButton extends React.Component {
    render() {
        let size = this.props.size ? 'btn-' + size : '',
            className = 'btn btn-default ' + size,
            params = {
                entity: this.props.entity.name()
            };

        return (
            <Link className={className} to="create" params={params}>
                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;{this.props.label || 'Create'}
            </Link>
        );
    }
}

MaCreateButton.propTypes = {
    entity: React.PropTypes.object.isRequired,
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

export default MaCreateButton;
