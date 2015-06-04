import React from 'react';

import EditActions from '../../Actions/EditActions';
import { InputField } from '../Field';

class FormFields extends React.Component {
    buildFields(entry) {
        let fields = [];

        for (let i in this.props.fields) {
            let field = this.props.fields[i];
            let fieldName = field.name();
            let renderedField;
            let value = this.props.values.get(fieldName);
            let className = 'show-value react-admin-field-' + field.name() + ' ' +
                (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7');

            switch (field.type()) {
                case 'string':
                    renderedField = <InputField type={'text'} name={fieldName} value={value} updateField={this.props.updateField} />;
                    break;

                default:
                    renderedField = ''; // temparay
                    //throw new Error(`Unknown field type "${field.type()}".`);
            }

            fields.push(
                <div className="col-lg-12 form-group" key={i}>
                    <label for={fieldName} className="col-sm-2 control-label">{ field.label() }</label>

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

FormFields.propTypes = {
    view: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired,
    dataStore: React.PropTypes.object.isRequired,
    values: React.PropTypes.object.isRequired,
    updateField: React.PropTypes.func.isRequired,
};

FormFields.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default FormFields;
