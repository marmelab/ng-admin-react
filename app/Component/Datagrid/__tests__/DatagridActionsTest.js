jest.autoMockOff();
jest.setMock('react-router', { Link: require('../../Button/__mocks__/Link') });

describe('DatagridActions', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const DatagridActions = require('../DatagridActions');
    const routerWrapper = require('../../../Test/RouterWrapper');
    const Entry = require('admin-config/lib/Entry');

    let myEntry;

    function getActions(entityName, listActions, entry, size=null) {
        return routerWrapper(() => {
            return <DatagridActions entityName={entityName} listActions={listActions} entry={entry} size={size} />
        });
    }

    beforeEach(() => {
        myEntry = new Entry('posts', { 'id': 1, 'title': 'First Post' }, 1);
    });

    describe('Without actions', () => {
        it('Should not display anything', () => {
            let actions = getActions('MyEntity', [], myEntry);
            actions = React.findDOMNode(actions);

            expect(actions.childNodes.length).toEqual(0);
        });
    });

    describe('With actions', () => {
        it('Should display list of buttons with default size', () => {
            let actions = getActions('MyEntity', ['edit', 'delete'], myEntry);
            actions = React.findDOMNode(actions);

            expect(actions.childNodes.length).toEqual(2);
            expect(actions.childNodes[0].textContent).toContain('Edit');
            expect(actions.childNodes[1].textContent).toContain('Delete');
            expect(actions.childNodes[0].className).toEqual('btn btn-edit btn-default');
        });

        it('Should display list of buttons with specified', () => {
            let actions = getActions('MyEntity', ['edit', 'delete'], myEntry, 'xs');
            actions = React.findDOMNode(actions);

            expect(actions.childNodes[0].className).toEqual('btn btn-edit btn-default btn-xs');
        });

        it('Should display clickable button', () => {
            let actions = getActions('MyEntity', ['edit'], myEntry);
            actions = React.findDOMNode(actions);

            const edit = actions.childNodes[0];
            TestUtils.Simulate.click(edit);

            expect(edit.attributes['data-click-to'].value).toEqual('edit');
            expect(edit.attributes['data-params'].value).toEqual('{"entity":"MyEntity","id":1}');
        });
    });
});
