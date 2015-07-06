jest.autoMockOff();

describe('FieldButton', () => {
    const { List } = require('immutable');
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const FilterButton = require('../FilterButton');
    const Field = require('admin-config/lib/Field/Field');

    const FieldViewConfiguration = require('../../../Field/FieldViewConfiguration');
    const StringFieldView = require('../../../Field/StringFieldView');

    FieldViewConfiguration.registerFieldView('string', StringFieldView);

    let filter = new Field('note');
    filter.pinned(true);

    let showned = [];
    const showFilter = f => {
        showned.push(f.name());
    };

    describe('With good props', () => {
        it('Should display label and default size', () => {
            let filterButton = TestUtils.renderIntoDocument(<FilterButton filters={List([filter])} showFilter={showFilter} />);
            filterButton = React.findDOMNode(filterButton);

            expect(filterButton.className).toEqual('btn-group');

            const filterButtonButton = filterButton.querySelector('button');

            expect(filterButtonButton.type).toEqual('button');
            expect(filterButtonButton.className).toEqual('dropdown-toggle btn btn-default');
            expect(filterButtonButton.innerHTML).toContain('Add filters');
        });

        it('Should call showFilter callback', () => {
            let filterButton = TestUtils.renderIntoDocument(<FilterButton filters={List([filter])} showFilter={showFilter} />);
            filterButton = React.findDOMNode(filterButton);

            const unselectedFilter = filterButton.querySelector('.dropdown-menu a');
            TestUtils.Simulate.click(unselectedFilter);

            expect(showned).toEqual(['note']);
        });
    });
});
