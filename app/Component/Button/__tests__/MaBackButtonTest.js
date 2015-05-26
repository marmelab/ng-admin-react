jest.dontMock('../MaBackButton');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('MaBackButton', function() {
    var MaBackButton;

    beforeEach(function() {
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
