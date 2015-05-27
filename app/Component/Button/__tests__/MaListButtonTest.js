jest.autoMockOff();
jest.setMock('react-router', {Link : require('../__mocks__/Link')});

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('MaListButton', () => {
    var MaListButton;
    var entity;

    beforeEach(() => {
        MaListButton = require('../MaListButton');
        entity = {
            name: () => 'MyEntity'
        };
    });

    describe('With good props', () => {
        it('Should display label and size', () => {
            var listButton = TestUtils.renderIntoDocument(<MaListButton entity={entity} label={'Hello'} size={'xs'} />);
            listButton = React.findDOMNode(listButton);

            expect(listButton.className).toContain('btn btn-default btn-xs');
            expect(listButton.innerHTML).toContain('Hello');
        });

        it('Should redirect to the create route', () => {
            var listButton = TestUtils.renderIntoDocument(<MaListButton entity={entity} label={'Hello'} size={'xs'} />);
            listButtonNode = React.findDOMNode(listButton);

            expect(listButtonNode.attributes['data-click-to'].value).toEqual('');

            TestUtils.Simulate.click(listButtonNode);

            expect(listButtonNode.attributes['data-click-to'].value).toEqual('list');

            var params = JSON.parse(listButtonNode.attributes['data-params'].value);
            expect(params.entity).toEqual('MyEntity');
        });
    });
});
