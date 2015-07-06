import React from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import Compile from '../../Component/Compile';
import FieldViewConfiguration from '../../Field/FieldViewConfiguration';

class Filters extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    buildRows(filters) {
        const { entity, dataStore, updateField, hideFilter } = this.props;
        const configuration = this.context.configuration;
        const { search } = this.context.router.getCurrentQuery() || {};

        return filters.map((filter, i) => {
            const filterName = filter.name();
            const value = search && filterName in search ? search[filterName] : null;
            const autoFocus = !filter.pinned();
            const fieldName = filter.name();
            const fieldView = FieldViewConfiguration.getFieldView(filter.type());
            const className = `filter-value react-admin-field-${filter.name()} col-sm-8 col-md-8`;
            const fieldTemplate = fieldView ? fieldView.getFilterWidget : null;
            const values = null;
            let deleteLink = null;

            if (!filter.pinned()) {
                deleteLink = (
                    <a className="remove" onClick={hideFilter(filter)}>
                        <span className="glyphicon glyphicon-remove"></span>
                    </a>
                );
            }

            return (
                <div className={`form-field form-group filter-${fieldName}`} key={i}>
                    <span className="col-sm-1 col-xs-1">{deleteLink}</span>

                    <div>
                        <label htmlFor={fieldName} className={"control-label col-sm-3 col-md-3"}>{ filter.label() }</label>

                        <div className={className}>
                            <Compile field={filter} updateField={updateField} dataStore={dataStore}
                                entity={entity} value={value} values={values} fieldName={fieldName} entry={null}
                                configuration={configuration} autoFocus={autoFocus}>
                            {fieldTemplate}
                            </Compile>
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        const filters = this.props.filters;

        return (
            <div className="filters form-horizontal col-md-offset-6 col-md-6 col-lg-6">
                {this.buildRows(filters)}
            </div>
        );
    }
}

Filters.propTypes = {
    filters: React.PropTypes.object.isRequired,
    updateField: React.PropTypes.func.isRequired,
    hideFilter: React.PropTypes.func.isRequired,
    entity: React.PropTypes.object,
    dataStore: React.PropTypes.object
};

Filters.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired,
    configuration: React.PropTypes.object.isRequired
};

require('../../autoloader')('Filters', Filters);

export default Filters;
