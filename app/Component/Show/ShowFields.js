import React from 'react';

import ListActions from '../../Component/Datagrid/ListActions';
import { BooleanColumn, DateColumn, NumberColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn } from '../Column';

class ShowFields extends React.Component {

    buildFields(entry) {
        let cells = [];
        let actions = this.props.view.listActions();

        for (let i in this.props.fields) {
            let field = this.props.fields[i];
            let fieldName = field.name();
            let renderedField;
            let className = 'react-admin-field-' + field.name() + ' ' +
                (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7');

            switch (field.type()) {
                case 'string':
                    renderedField = entry.values[fieldName];
                    break;

                case 'boolean':
                    renderedField = <BooleanColumn value={entry.values[fieldName]} />;
                    break;

                case 'date':
                    renderedField = <DateColumn value={entry.values[fieldName]} format={field.format()} />;
                    break;

                case 'template':
                    renderedField = <TemplateColumn template={field.template()} entry={entry} />;
                    break;

                case 'number':
                    renderedField = <NumberColumn value={entry.values[fieldName]} />;
                    break;

                case 'reference':
                    renderedField = <ReferenceColumn value={entry.values[fieldName]} />;
                    break;

                case 'reference_many':
                    renderedField = <ReferenceManyColumn values={entry.values[fieldName]} />;
                    break;

                default:
                    throw new Error(`Unknown field type "${field.type()}".`);
            }

            cells.push(
                <div class="col-lg-12 form-group" key={i}>
                    <label class="col-sm-2 control-label">{ field.label() }</label>

                    <div class="show-value" className={className}>
                        {renderedField}
                    </div>
                </div>);
        }

        if (actions && actions.length) {
            cells.push(<td><ListActions view={this.props.view} entry={row} /></td>);
        }

        return cells;
    }

    render() {
        let view = this.props.view,
            entry = dataStore.getFirstEntry(view.getEntity().uniqueId),
            showFields = this.buildFields(entry);

        return (
            <div>
                {showFields}
            </div>
        );
    }
}

ShowFields.propTypes = {
    view: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired,
    dataStore: React.PropTypes.object.isRequired
};

export default ShowFields;
