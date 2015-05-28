import React from 'react';
import {Link} from 'react-router';

class MaDeleteButton extends React.Component {
    render() {
        let size = !!this.props.size ? 'btn-' + this.props.size : null,
            className = 'btn btn-default ' + size,
            params = {
                entity: this.props.entity.name(),
                id: this.props.entry.identifierValue
            };

        return (
            <Link className={className} to="delete" params={params}>
                <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;{this.props.label || 'Delete'}
            </Link>
        );
    }
}

MaDeleteButton.propTypes = {
    entity: React.PropTypes.object.isRequired,
    entry: React.PropTypes.object.isRequired,
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

export default MaDeleteButton;
