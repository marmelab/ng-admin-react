jest.autoMockOff();

describe('MaBackButton', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const MaBackButton = require('../MaBackButton');

    describe('With good props', () => {
        it('Should display label and size', () => {
            var backButton = TestUtils.renderIntoDocument(<MaBackButton label={'Hello'} size={'xs'} />);
            backButton = React.findDOMNode(backButton);

            expect(backButton.className).toContain('btn-xs');
            expect(backButton.innerHTML).toContain('Hello');
        });
    });
});
