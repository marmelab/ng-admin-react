import React from 'react';
import {Link} from 'react-router';

class ReferenceManyColumn extends React.Component {
    render() {
        const {values, field, entry} = this.props;
        const referenceEntity = field.targetEntity();
        const isDetail = referenceEntity.isReadOnly ? referenceEntity.showView().enabled : referenceEntity.editionView().enabled;
        const to = referenceEntity.isReadOnly ? 'show' : field.detailLinkRoute();
        const identifiers = entry.values[field.name()];

        let params;

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
                        return (
                            <Link to={to} params={params} key={i} className="label label-default">
                                {value}
                            </Link>
                        );
                    }

                    return <span className="label label-default">{value}</span>;
                })}
            </span>
        );
    }
}

ReferenceManyColumn.propTypes = {
    values: React.PropTypes.array.isRequired,
    field: React.PropTypes.object.isRequired,
    entry: React.PropTypes.object.isRequired
};

require('../../autoloader')('ReferenceManyColumn', ReferenceManyColumn);

export default ReferenceManyColumn;
