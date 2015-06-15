jest.dontMock('../StringColumn');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('StringColumn', () => {
    var StringColumn;

    beforeEach(() => {
        StringColumn = require('../StringColumn');
    });

    it('should display given value', () => {
        var field = TestUtils.renderIntoDocument(<StringColumn value={'Hello'} />);
        field = React.findDOMNode(field);

        expect(field.innerHTML).toBe('Hello');
        expect(field.tagName.toLowerCase()).toBe('span');
    });
});
