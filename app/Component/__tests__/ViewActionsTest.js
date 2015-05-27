jest.autoMockOff();
jest.dontMock('../ViewActions');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var ViewActions = require('../ViewActions');
var routerWrapper = require('../../Test/RouterWrapper');

function getActions(buttons, entry, view) {
    return routerWrapper(() => <ViewActions buttons={buttons} entry={entry} view={view} />);
}

describe('ViewActions', () => {
    var view;
    var entry;

    beforeEach(() => {
        entry = {
            identifierValue: 11
        };
        view = {
            entity: {
                name: () => 'MyEntity'
            }
        }
    });

    describe('With buttons prop', () => {
        it('Should display desired buttons', () => {
            var viewActions = getActions(['back', 'delete'], entry, view);
            viewActions = React.findDOMNode(viewActions);

            var buttons = viewActions.querySelectorAll('.btn');

            expect(buttons[0].innerHTML).toContain('Back');
            expect(buttons[1].innerHTML).toContain('Delete');
        });
    });
});
