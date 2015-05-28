jest.dontMock('../JsonColumn');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('JsonColumn', () => {
    var JsonColumn;

    beforeEach(() => {
        JsonColumn = require('../JsonColumn');
    });

    it('should display an array of literals', () => {
        var jsonColumn = TestUtils.renderIntoDocument(<JsonColumn value={['abc', 123]}/>);
        jsonColumn = React.findDOMNode(jsonColumn);

        expect(jsonColumn.querySelector('table').getAttribute('class')).toBe('table table-condensed');
        expect(jsonColumn.querySelector('tr:first-child td').innerHTML).toBe('abc');
        expect(jsonColumn.querySelector('tr:last-child td').innerHTML).toBe('123');
    });

    it('should display an object of literals', () => {
        var jsonColumn = TestUtils.renderIntoDocument(<JsonColumn value={{title1: 'name1', title2: 'name2'}}/>);
        jsonColumn = React.findDOMNode(jsonColumn);

        expect(jsonColumn.querySelector('table').getAttribute('class')).toBe('table table-condensed table-bordered');
        expect(jsonColumn.querySelector('tr:first-child th').innerHTML).toBe('title1');
        expect(jsonColumn.querySelector('tr:first-child td').innerHTML).toBe('name1');

        expect(jsonColumn.querySelector('tr:last-child th').innerHTML).toBe('title2');
        expect(jsonColumn.querySelector('tr:last-child td').innerHTML).toBe('name2');
    });

    it('should display a mix of array and objects', () => {
        var jsonColumn = TestUtils.renderIntoDocument(<JsonColumn value={[123, {test1: 'value1'}]}/>);
        jsonColumn = React.findDOMNode(jsonColumn);

        expect(jsonColumn.querySelector('table:first-child').getAttribute('class')).toBe('table table-condensed');
        expect(jsonColumn.querySelector('tr:first-child td').innerHTML).toBe('123');
        
        var table2 = jsonColumn.querySelector('table table');

        expect(table2.getAttribute('class')).toBe('table table-condensed table-bordered');
        expect(table2.querySelector('th').innerHTML).toBe('test1');
        expect(table2.querySelector('td').innerHTML).toBe('value1');
    });
});
