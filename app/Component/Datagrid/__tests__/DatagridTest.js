jest.dontMock('../Datagrid.js');

var React = require('react/addons');
var Datagrid = require('../Datagrid.js');
var TestUtils = React.addons.TestUtils;

describe('Datagrid', function() {
    it('should set header with correct label for each field, plus an empty header for actions', function() {
        var fields = {
            'id': { label: function() { return '#'; } },
            'title': { label: function() { return 'Title'; } },
            'created_at': { label: function() { return 'Creation date'; } }
        };

        var datagrid = TestUtils.renderIntoDocument(<Datagrid fields={fields}/>);
            datagrid = React.findDOMNode(datagrid);

        var headers = [].slice.call(datagrid.querySelectorAll('thead th')).map(h => h.textContent);
        expect(headers).toEqual(['#', 'Title', 'Creation date', '']);
    });
});
