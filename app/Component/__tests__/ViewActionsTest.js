jest.autoMockOff();

describe('ViewActions', () => {
    const React = require('react/addons');
    const ViewActions = require('../ViewActions');
    const routerWrapper = require('../../Test/RouterWrapper');

    function getActions(buttons, entry, view) {
        return routerWrapper(() => <ViewActions buttons={buttons} entry={entry} entityName={view.entity.name()} />);
    }

    let view;
    let entry;

    beforeEach(() => {
        entry = {
            identifierValue: 11
        };
        view = {
            entity: {
                name: () => 'MyEntity'
            }
        };
    });

    describe('With buttons prop', () => {
        it('Should display desired buttons', () => {
            let viewActions = getActions(['back', 'delete'], entry, view);
            viewActions = React.findDOMNode(viewActions);

            const buttons = viewActions.querySelectorAll('.btn');

            expect(buttons[0].innerHTML).toContain('Back');
            expect(buttons[1].innerHTML).toContain('Delete');
        });
    });
});
