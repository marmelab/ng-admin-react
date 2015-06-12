jest.autoMockOff();
jest.dontMock('../InputField');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('InputField', () => {
    var InputField, values = {};
    var onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        InputField = require('../InputField');
    });

    it('should get an input with correct default value and editable', () => {
        var input = TestUtils.renderIntoDocument(<InputField name="my_field" value="default val" updateField={onChange}/>);
            input = React.findDOMNode(input);

        expect(input.value).toBe('default val');

        TestUtils.Simulate.change(input, { target: { value: 'Hello, world'} });

        expect(values['my_field']).toBe('Hello, world');
    });
});
