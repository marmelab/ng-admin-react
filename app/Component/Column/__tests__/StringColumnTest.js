jest.dontMock('../StringColumn');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('StringColumn', () => {
    var StringColumn;

    beforeEach(() => {
        StringColumn = require('../StringColumn');
    });

    it('sould display given value', () => {
        var field = TestUtils.renderIntoDocument(<StringColumn value={'Hello'} />);
        field = React.findDOMNode(field);

        expect(field.innerHTML).toBe('Hello');
        expect(field.tagName.toLowerCase()).toBe('span');
    });

    it('should call detailAction when given', () => {
        var isCalled = false;
        function cb() {
            isCalled = true;
        }

        var field = TestUtils.renderIntoDocument(<StringColumn value={123} detailAction={cb} />);
        field = React.findDOMNode(field);

        TestUtils.Simulate.click(field);

        expect(isCalled).toBeTruthy();
    });
});
