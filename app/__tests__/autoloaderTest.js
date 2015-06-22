jest.autoMockOff();

describe('autoloader', () => {
    let React, TestUtils, autoload;

    beforeEach(() => {
        React = require('react/addons');
        TestUtils = React.addons.TestUtils;
        require('../Component/Column/NumberColumn');
        autoload = require('../autoloader');
    });

    describe('Should retrieve auto registrered component', () => {
        it('Should load a non loaded component', () => {
            var numberColumn = TestUtils.renderIntoDocument(<NumberColumn value={42} />);
            numberColumn = React.findDOMNode(numberColumn);

            expect(+numberColumn.innerHTML).toEqual(42);
        });
    });
});
