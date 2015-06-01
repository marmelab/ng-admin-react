jest.autoMockOff();
jest.setMock('../../../Actions/ListActions', require('../../../Actions/__mocks__/ListActions'));
jest.setMock('react-router', {Link : require('../../Button/__mocks__/Link')});

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Datagrid = require('../Datagrid');
var routerWrapper = require('../../../Test/RouterWrapper');
var Entry = require('admin-config/lib/Entry');

function getDatagrid(name, entityName, fields, view, router, entries, sortDir, sortField) {
    return routerWrapper(() => <Datagrid
        name={name}
        fields={fields}
        entityName={entityName}
        view={view}
        router={router}
        entries={entries}
        sortDir={sortDir}
        sortField={sortField}
        listActions={[]}/>
    );
}

describe('Datagrid', () => {
    var view;
    var router;

    beforeEach(() => {
        view = {
            listActions: () => [],
            perPage: () => 10,
            name: () => 'myView'
        };

        router = {
            getCurrentQuery: () => 1
        };
    });

    describe('Column headers', () => {
        it('should set header with correct label for each field', () => {
            var fields = [
                { label: () => '#', name: () => 'id' },
                { label: () => 'Title', name: () => 'title' },
                { label: () => 'Creation date', name: () => 'created_at' }
            ];

            var datagrid = getDatagrid('myView', 'myEntity', fields, view, router, [], null, null);
            datagrid = React.findDOMNode(datagrid);

            var headers = [].slice.call(datagrid.querySelectorAll('thead th')).map(h => h.textContent);
            expect(headers).toEqual(['#', 'Title', 'Creation date']);
        });

        it('should send `sort` event to datagrid when clicking on header', () => {
            var fields = [{ label: () => '#', name: () => 'id' }];

            var datagrid = getDatagrid('myView', 'myEntity', fields, view, router, [], null, null);
            var datagridNode = React.findDOMNode(datagrid);
            var header = datagridNode.querySelector('thead th a');
            TestUtils.Simulate.click(header);

            expect(header.attributes['data-click-to'].value).toEqual('my-route');
        });
    });

    describe('Datagrid entries', () => {
        it('should set rows with correct value for each field, plus action buttons', () => {
            var fields = [
                { label: () => '#', name: () => 'id' },
                { label: () => 'Title', name: () => 'title' },
                { label: () => 'Creation date', name: () => 'created_at' }
            ];

            var entries = [
                new Entry('posts', { 'id': 1, 'title': 'First Post', 'created_at': '2015-05-27' }, 1),
                new Entry('posts', { 'id': 2, 'title': 'Second Post', 'created_at': '2015-05-28' }, 2),
                new Entry('posts', { 'id': 3, 'title': 'Third Post', 'created_at': '2015-05-29' }, 3)
            ];

            var ListActions = require('../../../Actions/ListActions');

            var datagrid = getDatagrid('myView', 'myEntity', fields, view, router, entries);
            datagrid = React.findDOMNode(datagrid);
        });
    });
});
