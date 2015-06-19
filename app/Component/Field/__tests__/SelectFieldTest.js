jest.autoMockOff();

describe('SelectField', () => {
    let React, TestUtils, SelectField, Select, values = {};
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        React = require('react/addons');
        TestUtils = React.addons.TestUtils;
        SelectField = require('../SelectField');
        Select = require('react-select');
    });

    it('should get a select with correct props and state', () => {
        const choices = [
            { value: 1, label: 'First choice' },
            { value: 2, label: 'Second choice' },
            { value: 3, label: 'Third choice' }
        ];
        const value = 1;
        const instance = TestUtils.renderIntoDocument(<SelectField name="my_field" value={value} choices={choices} updateField={onChange}/>);
        const select = TestUtils.findRenderedComponentWithType(instance, Select);

        expect(select.props.name).toBe('my_field');
        expect(select.state.value).toBe('1');
        expect(select.state.placeholder).toBe('First choice');
        expect(select.state.isFocused).toBeFalsy();
        expect(select.state.options).toEqual([
            { value: '1', label: 'First choice' },
            { value: '2', label: 'Second choice' },
            { value: '3', label: 'Third choice' }
        ]);

        select.selectValue('2');

        expect(values).toEqual({ 'my_field': '2' });
    });
});
