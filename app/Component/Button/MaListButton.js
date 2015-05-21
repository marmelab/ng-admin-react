import React from 'react';
import {Link} from 'react-router';

class MaListButton extends React.Component {
    render() {
        let size = 'btn-' + (this.props.size ? size : 'xs'),
            className = 'btn btn-default ' + size,
            params = {
                entity: this.props.entity.name()
            };

        return (
            <Link className={className} to="list" params={params}>
                <span className="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;{this.props.label || 'List'}
            </Link>
        );
    }
}

MaListButton.propTypes = {
    entity: React.PropTypes.object.isRequired,
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

export default MaListButton;
