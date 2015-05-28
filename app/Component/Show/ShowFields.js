import React from 'react';

import { BooleanColumn, DateColumn, NumberColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn } from '../Column';

class ShowFields extends React.Component {

    buildFields(entry) {
        let fields = [];

        for (let i in this.props.fields) {
            let field = this.props.fields[i];
            let fieldName = field.name();
            let renderedField;
            let className = 'show-value react-admin-field-' + field.name() + ' ' +
                (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7');

            switch (field.type()) {
                case 'string':
                case 'text':
                case 'wysiwyg':
                    renderedField = entry.values[fieldName];
                    break;

                case 'json':
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
                    renderedField = <ReferenceColumn value={entry.listValues[fieldName]} />;
                    break;

                case 'referenced_list':
                    break;

                case 'reference_many':
                    renderedField = <ReferenceManyColumn values={entry.listValues[fieldName]} />;
                    break;

                default:
                    throw new Error(`Unknown field type "${field.type()}".`);
            }

            fields.push(
                <div className="col-lg-12 form-group" key={i}>
                    <label className="col-sm-2 control-label">{ field.label() }</label>

                    <div className={className}>
                        {renderedField}
                    </div>
                </div>);
        }

        return fields;
    }

    render() {
        let view = this.props.view,
            entry = this.props.dataStore.getFirstEntry(view.getEntity().uniqueId),
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
