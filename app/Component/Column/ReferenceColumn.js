import React from 'react';
import {Link} from 'react-router';

class ReferenceColumn extends React.Component {
    render() {
        const {value, field, entry} = this.props;
        const referenceEntity = field.targetEntity();
        const isDetail = referenceEntity.isReadOnly ? referenceEntity.showView().enabled : referenceEntity.editionView().enabled;

        if (isDetail) {
            const to = referenceEntity.isReadOnly ? 'show' : field.detailLinkRoute(),
                referenceId = entry.values[field.name()],
                params = {
                    entity: referenceEntity.name(),
                    id: referenceId
                };

            return (
                <Link className="reference-column" to={to} params={params}>
                    {value}
                </Link>
            );
        }

        return (
            <span>{value}</span>
        );
    }
}

ReferenceColumn.propTypes = {
    value: React.PropTypes.string,
    entry: React.PropTypes.object,
    field: React.PropTypes.object
};

require('../../autoloader')('ReferenceColumn', ReferenceColumn);

export default ReferenceColumn;
