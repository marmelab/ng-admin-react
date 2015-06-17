jest.autoMockOff();
jest.dontMock('../BooleanColumn');

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

describe('BooleanColumn', () => {
    let BooleanColumn;

    beforeEach(() => {
        BooleanColumn = require('../BooleanColumn');
    });

    it('should get a span with correct class depending of Column value', () => {
        [true, false].forEach((booleanValue) => {
            let boolean = TestUtils.renderIntoDocument(<BooleanColumn value={booleanValue}/>);
            boolean = React.findDOMNode(boolean);

            expect(boolean.getAttribute('class')).toBe(`boolean-${booleanValue}`);
        });
    });
});
