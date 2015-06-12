jest.autoMockOff();
jest.dontMock('../CheckboxField');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('CheckboxField', () => {
    var CheckboxField, values = {};
    var onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        CheckboxField = require('../CheckboxField');
    });

    it('should get an input with correct default value and editable', () => {
        [true, false, 1, 0].forEach((booleanValue) => {
            var checkbox = TestUtils.renderIntoDocument(<CheckboxField name="my_checkbox_field" value={booleanValue} updateField={onChange}/>);
                checkbox = React.findDOMNode(checkbox);

            expect(checkbox.checked).toBe(booleanValue ? true : false);

            TestUtils.Simulate.change(checkbox, { 'target': { 'checked': booleanValue ? false : true} });

            expect(values['my_checkbox_field']).toBe(booleanValue ? 0 : 1);
        });
    });
});
