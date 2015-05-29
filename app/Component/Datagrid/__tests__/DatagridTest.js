jest.autoMockOff();
jest.setMock('../../../Stores/ListStore', require('../__mocks__/ListStore'));
jest.setMock('../../../Actions/ListActions', require('../__mocks__/ListActions'));
jest.setMock('react-router', {Link : require('../../Button/__mocks__/Link')});

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Datagrid = require('../Datagrid');
var routerWrapper = require('../../../Test/RouterWrapper');

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
        it('should set header with correct label for each field, plus an empty header for actions', () => {
            var fields = {
                'id': { label: () => '#', name: () => 'id' },
                'title': { label: () => 'Title', name: () => 'title' },
                'created_at': { label: () => 'Creation date', name: () => 'created_at' }
            };

            var datagrid = getDatagrid('myView', 'myEntity', fields, view, router, [], null, null);
            datagrid = React.findDOMNode(datagrid);

            var headers = [].slice.call(datagrid.querySelectorAll('thead th')).map(h => h.textContent);
            expect(headers).toEqual(['#', 'Title', 'Creation date', '']);
        });

        it('should send `sort` event to datagrid when clicking on header', () => {
            var fields = {
                'id': { label: () => '#', name: () => 'id' }
            };

            var datagrid = getDatagrid('myView', 'myEntity', fields, view, router, [], null, null);
            var datagridNode = React.findDOMNode(datagrid);
            var header = datagridNode.querySelector('thead th a');
            TestUtils.Simulate.click(header);

            expect(header.attributes['data-click-to'].value).toEqual('my-route');
        });
    });
});
