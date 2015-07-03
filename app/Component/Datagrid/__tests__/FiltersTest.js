jest.autoMockOff();

describe('Filters', () => {
    const Immutable = require('immutable');
    const React = require('react/addons');
    //const TestUtils = React.addons.TestUtils;
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
        hidden.push(filter.name);
    };

    let updated = {};
    const updateField = (name, value) => {
        updated[name] = value;
    };

    function getFilters(filters) {
        return routerWrapper(() => <Filters filters={filters} hideFilter={hideFilter} updateField={updateField} />);
    }

    describe('Display', () => {
        it('should display selected filters', () => {
            const selectedFilters = Immutable.List([pinnedFilter, notPinned]);
            let filters = getFilters(selectedFilters);
            filters = React.findDOMNode(filters);

            const field = filters.querySelector('input');
            const label = filters.querySelector('label');

            expect(field.attributes.name.value).toEqual('author');
            expect(field.attributes.type.value).toEqual('text');
            expect(label.innerHTML).toEqual('Author');
        });
    });
});
