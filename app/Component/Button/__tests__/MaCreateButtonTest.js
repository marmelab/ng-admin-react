jest.autoMockOff();
jest.setMock('react-router', {Link : require('../__mocks__/Link')});

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('MaCreateButton', () => {
    var MaCreateButton;

    beforeEach(() => {
        MaCreateButton = require('../MaCreateButton');
    });

    describe('With good props', () => {
        it('Should display label and size', () => {
            var createButton = TestUtils.renderIntoDocument(<MaCreateButton entityName={'MyEntity'} label={'Hello'} size={'xs'} />);
            createButton = React.findDOMNode(createButton);

            expect(createButton.className).toContain('btn btn-create btn-default btn-xs');
            expect(createButton.innerHTML).toContain('Hello');
        });

        it('Should redirect to the create route', () => {
            var createButton = TestUtils.renderIntoDocument(<MaCreateButton entityName={'MyEntity'} label={'Hello'} size={'xs'} />);
            createButtonNode = React.findDOMNode(createButton);

            expect(createButtonNode.attributes['data-click-to'].value).toEqual('');

            TestUtils.Simulate.click(createButtonNode);

            expect(createButtonNode.attributes['data-click-to'].value).toEqual('create');

            var params = JSON.parse(createButtonNode.attributes['data-params'].value);
            expect(params.entity).toEqual('MyEntity');
        });
    });
});
