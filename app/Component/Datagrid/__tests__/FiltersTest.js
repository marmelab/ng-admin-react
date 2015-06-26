jest.autoMockOff();

let storeFilters;
let listenerCb;

jest.setMock('../../../Stores/ApplicationStore', {
    getState: () => ({
        data: {
            get: function() {
                return storeFilters;
            }
        }
    }),
    addFilterListener: (cb) => { listenerCb = cb; },
    removeFilterListener: () => {}
});

describe('Filters', () => {
    const Immutable = require('immutable');
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const routerWrapper = require('../../../Test/RouterWrapper');

    const ListView = require('admin-config/lib/View/ListView');
    const Field = require('admin-config/lib/Field/Field');
    const Entity = require('admin-config/lib/Entity/Entity');

    const FieldViewConfiguration = require('../../../Field/FieldViewConfiguration');
    const StringFieldView = require('../../../Field/StringFieldView');

    const Filters = require('../Filters');

    FieldViewConfiguration.registerFieldView('string', StringFieldView);

    let view = new ListView('myView');
    let entity = new Entity('myEntity');
    let pinnedFilter = new Field('author');
    pinnedFilter.pinned(true);

    let notPinned = new Field('name');

    view.setEntity(entity);

    function getFilters(view) {
        return routerWrapper(() => <Filters view={view} />);
    }

    describe('Filter', () => {
        it('should display pinned filter directly', () => {
            storeFilters = new Immutable.List();
            storeFilters = storeFilters.push(pinnedFilter);

            let filters = getFilters(view);
            filters = React.findDOMNode(filters);

            const field = filters.querySelector('input');
            const label = filters.querySelector('label');

            expect(field.attributes.name.value).toEqual('author');
            expect(field.attributes.type.value).toEqual('text');
            expect(label.innerHTML).toEqual('Author');
        });

        it('should display a filter from store', () => {
            storeFilters = new Immutable.List();

            let filters = getFilters(view);

            storeFilters = storeFilters.push(notPinned);
            listenerCb();

            let filtersNode = React.findDOMNode(filters);


            const field = filtersNode.querySelector('input');
            const label = filtersNode.querySelector('label');

            expect(field.attributes.name.value).toEqual('name');
            expect(label.innerHTML).toEqual('Name');
        });
    });
});
