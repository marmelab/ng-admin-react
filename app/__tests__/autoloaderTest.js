jest.autoMockOff();
jest.dontMock('../autoloader');

var autoload = require('../autoloader');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

import '../Component/Column/NumberColumn';

describe('autoloader', () => {
    describe('Should retrieve auto registrered component', () => {
        it('Should load a non loaded component', () => {
            var numberColumn = TestUtils.renderIntoDocument(<NumberColumn value={42} />);
            numberColumn = React.findDOMNode(numberColumn);

            expect(+numberColumn.innerHTML).toEqual(42);
        });
    });
});
