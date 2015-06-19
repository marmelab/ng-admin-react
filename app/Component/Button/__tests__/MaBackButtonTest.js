jest.autoMockOff();

describe('MaBackButton', () => {
    let React, TestUtils, MaBackButton;

    beforeEach(() => {
        React = require('react/addons');
        TestUtils = React.addons.TestUtils;
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
