jest.autoMockOff();
jest.mock('react-select', jest.genMockFromModule('react-select'));

describe('SelectField', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const SelectField = require('../SelectField');
    const Select = require('react-select');

    let values = {};
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        Select.mockClear();
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

        Select.mock.instances[0].fireChangeEvent.mockImplementation(function (value) {
            this.props.onChange(value, value);
        });

        expect(select.props.name).toBe('my_field');
        expect(select.props.value).toBe('1');
        expect(select.props.options).toEqual([
            { value: '1', label: 'First choice' },
            { value: '2', label: 'Second choice' },
            { value: '3', label: 'Third choice' }
        ]);

        select.fireChangeEvent('2');

        expect(values).toEqual({ 'my_field': '2' });
    });

    it('should get a multi select with correct props and state', () => {
        const choices = [
            { value: 1, label: 'First choice' },
            { value: 2, label: 'Second choice' },
            { value: 3, label: 'Third choice' }
        ];
        const value = [2, 3];
        const instance = TestUtils.renderIntoDocument(<SelectField name="my_field" value={value} multiple={true} choices={choices} updateField={onChange}/>);
        const select = TestUtils.findRenderedComponentWithType(instance, Select);

        Select.mock.instances[0].fireChangeEvent.mockImplementation(function (value) {
            this.props.onChange(value, []);
        });

        expect(select.props.value).toBe('2,3');

        select.fireChangeEvent('2,3,1');

        expect(values).toEqual({ 'my_field': ['2', '3', '1'] });
    });
});
