import React from 'react';
import ChoicesColumn from '../Component/Column/ChoicesColumn';
import SelectField from '../Component/Field/SelectField';

class ChoicesFieldView {
    static getReadWidget() {
        return <ChoicesColumn values={this.props.value} />;
    }

    static getLinkWidget() {
        // Due to a scope issue, we can't call ChoicesFieldView.getReadWidget() here
        return <a onClick={this.props.detailAction}><ChoicesColumn values={this.props.value} /></a>;
    }

    static getFilterWidget() {
        // @TODO : change when reference filter will be implemented
        return null;
    }

    static getWriteWidget() {
        let choices = this.props.field.choices();
        if (typeof(choices) === 'function') {
            choices = choices({ values: this.props.values.toJS() });
        }

        return <SelectField name={this.props.fieldName}
                            choices={choices} value={this.props.value}
                            multiple={true}
                            updateField={this.props.updateField} />;
    }
}

export default ChoicesFieldView;
