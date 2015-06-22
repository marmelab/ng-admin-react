jest.autoMockOff();

describe('StringColumn', () => {
    let React, TestUtils, StringColumn;

    beforeEach(() => {
        React = require('react/addons');
        TestUtils = React.addons.TestUtils;
        StringColumn = require('../StringColumn');
    });

    it('should display given value', () => {
        let field = TestUtils.renderIntoDocument(<StringColumn value={'Hello'} />);
        field = React.findDOMNode(field);

        expect(field.innerHTML).toBe('Hello');
        expect(field.tagName.toLowerCase()).toBe('span');
    });
});
