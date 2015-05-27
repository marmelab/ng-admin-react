jest.dontMock('../BooleanField');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('BooleanField', () => {
    var BooleanField;

    beforeEach(() => {
        BooleanField = require('../BooleanField');
    });

    it('should get a span with correct class depending of field value', () => {
        [true, false].forEach((booleanValue) => {
            var boolean = TestUtils.renderIntoDocument(<BooleanField value={booleanValue}/>);
                boolean = React.findDOMNode(boolean);

            expect(boolean.getAttribute('class')).toBe(`boolean-${booleanValue}`);
        });
    });
});
