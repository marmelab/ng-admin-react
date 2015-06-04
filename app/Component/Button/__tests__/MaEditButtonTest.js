jest.autoMockOff();
jest.setMock('react-router', {Link : require('../__mocks__/Link')});

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('MaEditButton', () => {
    var MaEditButton;
    var entry;

    beforeEach(() => {
        MaEditButton = require('../MaEditButton');

        entry = {
            identifierValue: 23
        }
    });

    describe('With good props', () => {
        it('Should display label and size', () => {
            var editButton = TestUtils.renderIntoDocument(<MaEditButton entityName={'MyEntity'} entry={entry} label={'Delete'} size={'xs'} />);
            editButton = React.findDOMNode(editButton);

            expect(editButton.className).toContain('btn btn-edit btn-default btn-xs');
            expect(editButton.innerHTML).toContain('Delete');
        });

        it('Should redirect to the create route', () => {
            var editButton = TestUtils.renderIntoDocument(<MaEditButton entityName={'MyEntity'} entry={entry} label={'Hello'} size={'xs'} />);
            editButtonNode = React.findDOMNode(editButton);

            expect(editButtonNode.attributes['data-click-to'].value).toEqual('');

            TestUtils.Simulate.click(editButtonNode);

            expect(editButtonNode.attributes['data-click-to'].value).toEqual('edit');

            var params = JSON.parse(editButtonNode.attributes['data-params'].value);
            expect(params.entity).toEqual('MyEntity');
            expect(params.id).toEqual(23);
        });
    });
});
