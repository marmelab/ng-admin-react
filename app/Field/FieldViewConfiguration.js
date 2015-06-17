let fieldViews = {};

class FieldViewConfiguration {
    static registerFieldView(type, FieldView) {
        fieldViews[type] = FieldView;
    }

    static getFieldView(type) {
        return fieldViews[type];
    }
}

export default FieldViewConfiguration;
