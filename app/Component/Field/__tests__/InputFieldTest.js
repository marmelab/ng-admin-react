jest.autoMockOff();
jest.dontMock('../InputField');

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

describe('InputField', () => {
    let InputField, values = {};
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
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
