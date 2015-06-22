jest.autoMockOff();
jest.setMock('react-router', {Link : require('../__mocks__/Link')});

describe('MaListButton', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const MaListButton = require('../MaListButton');

    describe('With good props', () => {
        it('Should display label', () => {
            let listButton = TestUtils.renderIntoDocument(<MaListButton entityName={'MyEntity'} label={'Hello'} />);
            listButton = React.findDOMNode(listButton);

            expect(listButton.className).toContain('btn btn-list btn-default');
            expect(listButton.innerHTML).toContain('Hello');
        });

        it('Should display size', () => {
            let listButton = TestUtils.renderIntoDocument(<MaListButton entityName={'MyEntity'} label={'Hello'} size={'xs'} />);
            listButton = React.findDOMNode(listButton);

            expect(listButton.className).toEqual('btn btn-list btn-default btn-xs');
        });

        it('Should redirect to the create route', () => {
            const listButton = TestUtils.renderIntoDocument(<MaListButton entityName={'MyEntity'} label={'Hello'} size={'xs'} />);
            const listButtonNode = React.findDOMNode(listButton);

            expect(listButtonNode.attributes['data-click-to'].value).toEqual('');

            TestUtils.Simulate.click(listButtonNode);

            expect(listButtonNode.attributes['data-click-to'].value).toEqual('list');

            const params = JSON.parse(listButtonNode.attributes['data-params'].value);
            expect(params.entity).toEqual('MyEntity');
        });
    });
});
