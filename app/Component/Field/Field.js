import React from 'react';

import Compile from '../Compile';
import FieldViewConfiguration from '../../Field/FieldViewConfiguration';


class Field extends React.Component {
    render() {
        let {field, value, entity} = this.props;
        let fieldName = field.name();

        let fieldView = FieldViewConfiguration.getFieldView(field.type());
        let className = 'edit-value react-admin-field-' + field.name() + ' ' +
            (field.getCssClasses(this.props.entry) || 'col-sm-10 col-md-8 col-lg-7');

        let fieldTemplate = fieldView ? fieldView.getWriteWidget : null;

        return (
            <div>
                <label htmlFor={fieldName} className="col-sm-2 control-label">{ field.label() }</label>

                <div className={className}>
                    <Compile field={field} updateField={this.props.updateField} dataStore={this.props.dataStore}
                             entity={entity} value={value} fieldName={fieldName} configuration={this.props.configuration}>
                        {fieldTemplate}
                    </Compile>
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
    configuration: React.PropTypes.object,
    value: React.PropTypes.any,
    updateField: React.PropTypes.func.isRequired,
};

require('../../autoloader')('Field', Field);

export default Field;
