import DateColumn from '../Component/Column/DateColumn';
import InputField from '../Component/Field/InputField';

class DateFieldView {
    static getReadWidget() {
        return <DateColumn value={this.props.value} />;
    }

    static getLinkWidget() {
        return <a onClick={this.props.detailAction}><DateColumn value={this.props.value} /></a>;
    }

    static getFilterWidget() {
        // @TODO : Add filter
        return null;
    }

    static getWriteWidget() {
        // @TODO : Add date field
        return <InputField type={"date"} name={this.props.fieldName} value={this.props.value} updateField={this.props.updateField} />;
    }
}

export default DateFieldView;
