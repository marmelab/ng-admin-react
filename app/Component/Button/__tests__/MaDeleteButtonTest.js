jest.autoMockOff();
jest.setMock('react-router', {Link : require('../__mocks__/Link')});

describe('MaDeleteButton', () => {
    let React, TestUtils, MaDeleteButton, entry;

    beforeEach(() => {
        React = require('react/addons');
        TestUtils = React.addons.TestUtils;
        MaDeleteButton = require('../MaDeleteButton');

        entry = {
            identifierValue: 23
        };
    });

    describe('With good props', () => {
        it('Should display label and size', () => {
            let deleteButton = TestUtils.renderIntoDocument(<MaDeleteButton entityName={'MyEntity'} entry={entry} label={'Delete'} size={'xs'} />);
            deleteButton = React.findDOMNode(deleteButton);

            expect(deleteButton.className).toContain('btn btn-delete btn-default btn-xs');
            expect(deleteButton.innerHTML).toContain('Delete');
        });

        it('Should redirect to the create route', () => {
            let deleteButton = TestUtils.renderIntoDocument(<MaDeleteButton entityName={'MyEntity'} entry={entry} label={'Hello'} size={'xs'} />);
            deleteButtonNode = React.findDOMNode(deleteButton);

            expect(deleteButtonNode.attributes['data-click-to'].value).toEqual('');

            TestUtils.Simulate.click(deleteButtonNode);

            expect(deleteButtonNode.attributes['data-click-to'].value).toEqual('delete');

            const params = JSON.parse(deleteButtonNode.attributes['data-params'].value);
            expect(params.entity).toEqual('MyEntity');
            expect(params.id).toEqual(23);
        });
    });
});
