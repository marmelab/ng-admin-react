jest.autoMockOff();

describe('autoloader', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    require('../Component/Column/NumberColumn');
    const autoload = require('../autoloader');

    describe('Should retrieve auto registrered component', () => {
        it('Should load a non loaded component', () => {
            var numberColumn = TestUtils.renderIntoDocument(<NumberColumn value={42} />);
            numberColumn = React.findDOMNode(numberColumn);

            expect(+numberColumn.innerHTML).toEqual(42);
        });
    });
});
