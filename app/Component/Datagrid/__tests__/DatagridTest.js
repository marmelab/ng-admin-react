jest.autoMockOff();
jest.setMock('../../../Stores/DatagridStore', require('../__mocks__/DatagridStore'));
jest.setMock('../../../Actions/DatagridActions', require('../__mocks__/DatagridActions'));

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Datagrid = require('../Datagrid');
var routerWrapper = require('../../../Test/RouterWrapper');

function getDatagrid(fields, view, router) {
    return routerWrapper(function() {
        return <Datagrid fields={fields} view={view} router={router} />;
    });
}

describe('Datagrid', () => {
    var view;
    var router;

    beforeEach(function() {
        view = view = {
            listActions: function() {
                return [];
            },
            perPage: function() {
                return 10;
            },
            name: function() {
                return 'myView';
            },
            entity: {
                name: function () {
                    return 'myEntity';
                }
            }
        };

        router = {
            getCurrentQuery: function() {
                return {
                    page: 1
                };
            }
        };
    });

    describe('Column headers', () => {
        it('should set header with correct label for each field, plus an empty header for actions', () => {
            var fields = {
                'id': { label: function() { return '#'; } },
                'title': { label: function() { return 'Title'; } },
                'created_at': { label: function() { return 'Creation date'; } }
            };

            var datagrid = getDatagrid(fields, view, router);
            datagrid = React.findDOMNode(datagrid);

            var headers = [].slice.call(datagrid.querySelectorAll('thead th')).map(h => h.textContent);
            expect(headers).toEqual(['#', 'Title', 'Creation date', '']);
            expect(true).toEqual(true);
        });

        it('should send `sort` event to datagrid when clicking on header', function() {
            var fields = {
                'id': { label: function() { return '#'; } }
            };

            var DatagridActions = require('../../../Actions/DatagridActions');

            var datagrid = getDatagrid(fields, view, router);
            var datagridNode = React.findDOMNode(datagrid);
            var header = datagridNode.querySelector('thead th a');
            TestUtils.Simulate.click(header);

            expect(DatagridActions.sort).toBeCalled();
        });
    });
});
