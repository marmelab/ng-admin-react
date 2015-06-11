import React from 'react';
import {Link} from 'react-router';

class ReferenceManyColumn extends React.Component {
    render() {
        let {values, field, entry} = this.props,
            referenceEntity = field.targetEntity(),
            isDetail = referenceEntity.isReadOnly ? referenceEntity.showView().enabled : referenceEntity.editionView().enabled,
            to = referenceEntity.isReadOnly ? 'show' : field.detailLinkRoute(),
            identifiers = entry.values[field.name()],
            params;

        if (!values) {
            return <span />;
        }

        return (
            <span className="reference-many-column">
                {values.map((value, i) => {
                    params = {
                        entity: referenceEntity.name(),
                        id: identifiers[i]
                    };

                    if (isDetail) {
                        return <Link to={to} params={params} key={i} className="label label-default">
                            {value}
                        </Link>;
                    }

                    return <span className="label label-default">{value}</span>
                })}
            </span>
        );
    }
}

ReferenceManyColumn.propTypes = {
    values: React.PropTypes.array.isRequired
};

require('../../autoloader')('ReferenceManyColumn', ReferenceManyColumn);

export default ReferenceManyColumn;
