jest.autoMockOff();
jest.setMock('../../../Stores/ListStore', require('../__mocks__/ListStore'));
jest.setMock('../../../Actions/ListActions', require('../__mocks__/ListActions'));

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Datagrid = require('../Datagrid');
var routerWrapper = require('../../../Test/RouterWrapper');

function getDatagrid(fields, view, router, actions, dataStore, sortDir, sortField) {
    return routerWrapper(() => <Datagrid fields={fields} view={view} router={router} dataStore={dataStore} sortDir={sortDir} sortField={sortField} actions={actions} />);
}

describe('Datagrid', () => {
    var view;
    var router;
    var dataStore;

    beforeEach(() => {
        view = {
            listActions: () => [],
            perPage: () => 10,
            name: () => 'myView',
            entity: {
                name: () => 'myEntity'
            }
        };

        router = {
            getCurrentQuery: () => 1
        };

        dataStore = {
            getEntries: (name) => []
        };
    });

    describe('Column headers', () => {
        it('should set header with correct label for each field, plus an empty header for actions', () => {
            var fields = {
                'id': { label: () => '#', name: () => 'id' },
                'title': { label: () => 'Title', name: () => 'title' },
                'created_at': { label: () => 'Creation date', name: () => 'created_at' }
            };

            var ListActions = require('../../../Actions/ListActions');

            var datagrid = getDatagrid(fields, view, router, ListActions, dataStore, null, null);
            datagrid = React.findDOMNode(datagrid);

            var headers = [].slice.call(datagrid.querySelectorAll('thead th')).map(h => h.textContent);
            expect(headers).toEqual(['#', 'Title', 'Creation date', '']);
            expect(true).toEqual(true);
        });

        it('should send `sort` event to datagrid when clicking on header', () => {
            var fields = {
                'id': { label: () => '#', name: () => 'id' }
            };

            var ListActions = require('../../../Actions/ListActions');

            var datagrid = getDatagrid(fields, view, router, ListActions, dataStore, null, null);
            var datagridNode = React.findDOMNode(datagrid);
            var header = datagridNode.querySelector('thead th a');
            TestUtils.Simulate.click(header);

            expect(ListActions.sort).toBeCalled();
        });
    });
});
