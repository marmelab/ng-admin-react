jest.autoMockOff();
jest.setMock('react-router', {Link : require('../__mocks__/Link')});

describe('MaShowButton', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const MaShowButton = require('../MaShowButton');

    let entry;

    beforeEach(() => {

        entry = {
            identifierValue: 23
        };
    });

    describe('With good props', () => {
        it('Should display label and default size', () => {
            let showButton = TestUtils.renderIntoDocument(<MaShowButton entityName={'MyEntity'} entry={entry} label={'Show'} size={'xs'} />);
            showButton = React.findDOMNode(showButton);

            expect(showButton.className).toEqual('btn btn-show btn-default btn-xs');
            expect(showButton.innerHTML).toContain('Show');
        });

        it('Should redirect to the create route', () => {
            const showButton = TestUtils.renderIntoDocument(<MaShowButton entityName={'MyEntity'} entry={entry} label={'Hello'} size={'xs'} />);
            const showButtonNode = React.findDOMNode(showButton);

            expect(showButtonNode.attributes['data-click-to'].value).toEqual('');

            TestUtils.Simulate.click(showButtonNode);

            expect(showButtonNode.attributes['data-click-to'].value).toEqual('show');

            const params = JSON.parse(showButtonNode.attributes['data-params'].value);
            expect(params.entity).toEqual('MyEntity');
            expect(params.id).toEqual(23);
        });
    });
});
