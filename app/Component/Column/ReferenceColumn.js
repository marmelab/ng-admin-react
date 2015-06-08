import React from 'react';
import {Link} from 'react-router';

class ReferenceColumn extends React.Component {
    render() {
        let {value, field, entry} = this.props,
            referenceEntity = field.targetEntity(),
            to = referenceEntity.isReadOnly ? 'show' : field.detailLinkRoute(),
            referenceId = entry.values[field.name()],
            params = {
                entity: referenceEntity.name(),
                id: referenceId
            };

        return (
            <Link to={to} params={params}>
                {value}
            </Link>
        );
    }
}

ReferenceColumn.propTypes = {
    value: React.PropTypes.string,
    entry: React.PropTypes.object,
    field: React.PropTypes.object
};

export default ReferenceColumn;
