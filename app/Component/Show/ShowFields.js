'use strict';

import React from 'react';

import { BooleanColumn, DateColumn, NumberColumn, ReferenceColumn, ReferenceManyColumn, ReferencedList, TemplateColumn, JsonColumn } from '../Column';

class ShowFields extends React.Component {

    buildFields(entry) {
        let fields = [];

        for (let i in this.props.fields) {
            let field = this.props.fields[i];
            let fieldName = field.name();
            let renderedField;
            let content = entry.values[fieldName];
            let className = 'show-value react-admin-field-' + field.name() + ' ' +
                (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7');

            switch (field.type()) {
                case 'string':
                case 'text':
                    renderedField = content;
                    break;

                case 'wysiwyg':
                    renderedField = <div dangerouslySetInnerHTML={{__html: content}} />;
                    break;

                case 'json':
                    renderedField = <JsonColumn value={content || {}} />;
                    break;

                case 'boolean':
                    renderedField = <BooleanColumn value={content} />;
                    break;

                case 'date':
                    renderedField = <DateColumn value={content} format={field.format()} />;
                    break;

                case 'template':
                    renderedField = <TemplateColumn template={field.template()} entry={entry} />;
                    break;

                case 'number':
                    renderedField = <NumberColumn value={content} />;
                    break;

                case 'reference':
                    renderedField = <ReferenceColumn value={entry.listValues[fieldName]} />;
                    break;

                case 'referenced_list':
                    let entries = this.props.dataStore.getEntries(field.targetEntity().uniqueId + '_list');

                    renderedField = <ReferencedList entries={entries} entityName={entry.entityName} field={field} />;
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
            entry = this.props.dataStore.getFirstEntry(view.getEntity().uniqueId);

        if (!entry) {
            return <div />;
        }

        return (
            <div>
                {this.buildFields(entry)}
            </div>
        );
    }
}

ShowFields.propTypes = {
    view: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired,
    dataStore: React.PropTypes.object.isRequired
};

ShowFields.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default ShowFields;
