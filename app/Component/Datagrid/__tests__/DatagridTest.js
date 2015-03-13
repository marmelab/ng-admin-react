jest.dontMock('../Datagrid');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

xdescribe('Datagrid', function() {
    var Datagrid;

    beforeEach(function() {
        Datagrid = require('../Datagrid');
    });

    describe('Column headers', function() {
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

        it('should send `sort` event to datagrid when clicking on header', function() {
            var fields = {
                'id': { label: function() { return '#'; } }
            };

            var DatagridActions = require('../../../Actions/DatagridActions');
            DatagridActions.sort = jest.genMockFunction();

            var datagrid = TestUtils.renderIntoDocument(<Datagrid fields={fields}/>);
            var datagridNode = React.findDOMNode(datagrid);
            var header = datagridNode.querySelector('thead th a');
            TestUtils.Simulate.click(header);

            expect(DatagridActions.sort).toBeCalled();
        });
    });
});
