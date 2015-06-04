import React from 'react';

import { InputField, CheckboxField } from './';

class Field extends React.Component {
    render() {
        let field = this.props.field;
        let fieldName = field.name();
        let value = this.props.value;
        let className = 'show-value react-admin-field-' + field.name() + ' ' +
            (field.getCssClasses(this.props.entry) || 'col-sm-10 col-md-8 col-lg-7');

        let renderedField;
        switch (field.type()) {
            case 'string':
                renderedField = <InputField type={'text'} name={fieldName} value={value} updateField={this.props.updateField} />;
                break;

            case 'boolean':
                renderedField = <CheckboxField name={fieldName} value={value} updateField={this.props.updateField} />;
                break;

            default:
                // TODO: add more types
                renderedField = ''; // temporay
                //throw new Error(`Unknown field type "${field.type()}".`);
        }

        return (
            <div>
                <label htmlFor={fieldName} className="col-sm-2 control-label">{ field.label() }</label>

                <div className={className}>
                    {renderedField}
                </div>
            </div>
        );
    }
}

Field.propTypes = {
    entity: React.PropTypes.object.isRequired,
    entry: React.PropTypes.object.isRequired,
    field: React.PropTypes.object.isRequired,
    dataStore: React.PropTypes.object.isRequired,
    value: React.PropTypes.any,
    updateField: React.PropTypes.func.isRequired,
};

export default Field;
