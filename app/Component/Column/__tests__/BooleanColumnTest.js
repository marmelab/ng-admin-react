jest.autoMockOff();
jest.dontMock('../BooleanColumn');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('BooleanColumn', () => {
    var BooleanColumn;

    beforeEach(() => {
        BooleanColumn = require('../BooleanColumn');
    });

    it('should get a span with correct class depending of Column value', () => {
        [true, false].forEach((booleanValue) => {
            var boolean = TestUtils.renderIntoDocument(<BooleanColumn value={booleanValue}/>);
                boolean = React.findDOMNode(boolean);

            expect(boolean.getAttribute('class')).toBe(`boolean-${booleanValue}`);
        });
    });
});
