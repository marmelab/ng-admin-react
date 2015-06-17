jest.autoMockOff();
jest.dontMock('../autoloader');

const autoload = require('../autoloader');
const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

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
