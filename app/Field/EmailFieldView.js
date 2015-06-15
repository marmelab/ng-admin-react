import StringColumn from '../Component/Column/StringColumn';
import InputField from '../Component/Field/InputField';

class EmailFieldView {
    static getReadWidget() {
        return <StringColumn value={this.props.value} />;
    }

    static getLinkWidget() {
        return <a onClick={this.props.detailAction}><StringColumn value={this.props.value} /></a>;
    }

    static getFilterWidget() {
        // @TODO : Add filter
        return null;
    }

    static getWriteWidget() {
        // @TODO : use email input when implemented
        return <InputField type={"email"} name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />;
    }
}

export default EmailFieldView;
