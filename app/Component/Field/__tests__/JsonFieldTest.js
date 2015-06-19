jest.autoMockOff();

describe('JsonField', () => {
    let React, TestUtils, JsonField, Codemirror, values = {};
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        React = require('react/addons');
        TestUtils = React.addons.TestUtils;
        JsonField = require('../JsonField');
        Codemirror = require('react-codemirror');
    });

    it('should get a code mirror field with correct props and state', () => {
        const value = 'var code;';
        const instance = TestUtils.renderIntoDocument(<JsonField name="my_field" value={value} updateField={onChange}/>);
        const editor = TestUtils.findRenderedComponentWithType(instance, Codemirror);

        expect(editor.props.value).toBe(value);

        editor.codemirrorValueChanged({
            getValue: () => {
                return 'var code = 1;';
            }
        });

        expect(values).toEqual({ 'my_field': 'var code = 1;' });
    });
});
