jest.autoMockOff();

describe('Filters', () => {
    const Immutable = require('immutable');
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const routerWrapper = require('../../../Test/RouterWrapper');

    const Field = require('admin-config/lib/Field/Field');

    const FieldViewConfiguration = require('../../../Field/FieldViewConfiguration');
    const StringFieldView = require('../../../Field/StringFieldView');

    const Filters = require('../Filters');

    FieldViewConfiguration.registerFieldView('string', StringFieldView);

    let pinnedFilter = new Field('author');
    pinnedFilter.pinned(true);

    let notPinned = new Field('name');

    let hidden = [];
    const hideFilter = (filter) => {
        return () => {
            hidden.push(filter.name());
        };
    };

    let updated = {};
    const updateField = (name, value) => {
        updated[name] = value;
    };

    function getFilters(filters) {
        return routerWrapper(() => <Filters filters={filters} hideFilter={hideFilter} updateField={updateField} />);
    }

    describe('Display', () => {
        it('should display pinned and selected filters', () => {
            const selectedFilters = Immutable.List([pinnedFilter, notPinned]);
            let filters = getFilters(selectedFilters);
            filters = React.findDOMNode(filters);

            const pinnedField = filters.querySelector('.filter-author input');
            const pinnedLabel = filters.querySelector('.filter-author label');
            const pinnedRemove = filters.querySelector('.filter-author a.remove');

            expect(pinnedField.attributes.name.value).toEqual('author');
            expect(pinnedField.attributes.type.value).toEqual('text');
            expect(pinnedLabel.innerHTML).toEqual('Author');
            expect(pinnedRemove).toEqual(null);

            const notPinnedField = filters.querySelector('.filter-name input');
            const notPinnedLabel = filters.querySelector('.filter-name label');
            const notPinnedRemove = filters.querySelector('.filter-name a.remove');

            expect(notPinnedField.attributes.name.value).toEqual('name');
            expect(notPinnedLabel.innerHTML).toEqual('Name');
            expect(notPinnedRemove.innerHTML).toContain('glyphicon-remove');
        });
    });

    describe('Callback', () => {
        it('should call hideFilter callback on filter remove', () => {
            const selectedFilters = Immutable.List([pinnedFilter, notPinned]);
            let filters = getFilters(selectedFilters);
            filters = React.findDOMNode(filters);

            const notPinnedRemove = filters.querySelector('.filter-name a.remove');

            TestUtils.Simulate.click(notPinnedRemove);

            expect(hidden).toEqual(['name']);
        });

        it('should call updateField callback on filter value changed', () => {
            const selectedFilters = Immutable.List([pinnedFilter, notPinned]);
            let filters = getFilters(selectedFilters);
            filters = React.findDOMNode(filters);

            const notPinnedField = filters.querySelector('.filter-name input');

            TestUtils.Simulate.change(notPinnedField, { target: { value: 'Me'} });

            expect(updated).toEqual({ name: 'Me' });
        });
    });
});
