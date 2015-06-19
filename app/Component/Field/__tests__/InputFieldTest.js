jest.autoMockOff();

describe('InputField', () => {
    let InputField, React, TestUtils, values = {};
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        React = require('react/addons');
        TestUtils = React.addons.TestUtils;
        InputField = require('../InputField');
    });

    it('should get an input with correct default value and editable', () => {
        let input = TestUtils.renderIntoDocument(<InputField name="my_field" value="default val" updateField={onChange}/>);
            input = React.findDOMNode(input);

        expect(input.value).toBe('default val');

        TestUtils.Simulate.change(input, { target: { value: 'Hello, world'} });

        expect(values['my_field']).toBe('Hello, world');
    });
});
