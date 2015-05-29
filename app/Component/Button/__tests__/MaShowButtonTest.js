jest.autoMockOff();
jest.setMock('react-router', {Link : require('../__mocks__/Link')});

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('MaShowButton', () => {
    var MaShowButton;
    var entry;

    beforeEach(() => {
        MaShowButton = require('../MaShowButton');

        entry = {
            identifierValue: 23
        }
    });

    describe('With good props', () => {
        it('Should display label and size', () => {
            var showButton = TestUtils.renderIntoDocument(<MaShowButton entityName={'MyEntity'} entry={entry} label={'Show'} size={'xs'} />);
            showButton = React.findDOMNode(showButton);

            expect(showButton.className).toContain('btn btn-default btn-xs');
            expect(showButton.innerHTML).toContain('Show');
        });

        it('Should redirect to the create route', () => {
            var showButton = TestUtils.renderIntoDocument(<MaShowButton entityName={'MyEntity'} entry={entry} label={'Hello'} size={'xs'} />);
            showButtonNode = React.findDOMNode(showButton);

            expect(showButtonNode.attributes['data-click-to'].value).toEqual('');

            TestUtils.Simulate.click(showButtonNode);

            expect(showButtonNode.attributes['data-click-to'].value).toEqual('show');

            var params = JSON.parse(showButtonNode.attributes['data-params'].value);
            expect(params.entity).toEqual('MyEntity');
            expect(params.id).toEqual(23);
        });
    });
});
