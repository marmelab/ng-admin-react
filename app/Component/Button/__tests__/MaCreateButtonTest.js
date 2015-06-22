jest.autoMockOff();
jest.setMock('react-router', {Link : require('../__mocks__/Link')});

describe('MaCreateButton', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const MaCreateButton = require('../MaCreateButton');

    describe('With good props', () => {
        it('Should display label and size', () => {
            let createButton = TestUtils.renderIntoDocument(<MaCreateButton entityName={'MyEntity'} label={'Hello'} size={'xs'} />);
            createButton = React.findDOMNode(createButton);

            expect(createButton.className).toContain('btn btn-create btn-default btn-xs');
            expect(createButton.innerHTML).toContain('Hello');
        });

        it('Should redirect to the create route', () => {
            let createButton = TestUtils.renderIntoDocument(<MaCreateButton entityName={'MyEntity'} label={'Hello'} size={'xs'} />);
            let createButtonNode = React.findDOMNode(createButton);

            expect(createButtonNode.attributes['data-click-to'].value).toEqual('');

            TestUtils.Simulate.click(createButtonNode);

            expect(createButtonNode.attributes['data-click-to'].value).toEqual('create');

            const params = JSON.parse(createButtonNode.attributes['data-params'].value);
            expect(params.entity).toEqual('MyEntity');
        });
    });
});
