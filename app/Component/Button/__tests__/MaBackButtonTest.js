jest.dontMock('../MaBackButton');

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

describe('MaBackButton', () => {
    let MaBackButton;

    beforeEach(() => {
        MaBackButton = require('../MaBackButton');
    });

    describe('With good props', () => {
        it('Should display label and size', () => {
            var backButton = TestUtils.renderIntoDocument(<MaBackButton label={'Hello'} size={'xs'} />);
            backButton = React.findDOMNode(backButton);

            expect(backButton.className).toContain('btn-xs');
            expect(backButton.innerHTML).toContain('Hello');
        });
    });
});
