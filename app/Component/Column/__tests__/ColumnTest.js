jest.autoMockOff();

describe('Column', () => {
    let React, TestUtils, Column, Field, NumberField, Entity, FieldViewConfiguration, StringFieldView, NumberFieldView;

    function getColumn(field, entity, entry, dataStore, configuration) {
        const col = TestUtils.renderIntoDocument(<Column field={field} entity={entity} entry={entry}
                                                             dataStore={dataStore} configuration={configuration} />);

        return React.findDOMNode(col);
    }

    beforeEach(() => {
        React = require('react/addons');
        TestUtils = React.addons.TestUtils;
        Column = require('../Column');
        Field = require('admin-config/lib/Field/Field');
        NumberField = require('admin-config/lib/Field/NumberField');
        Entity = require('admin-config/lib/Entity/Entity');
        FieldViewConfiguration = require('../../../Field/FieldViewConfiguration');
        StringFieldView = require('../../../Field/StringFieldView');
        NumberFieldView = require('../../../Field/NumberFieldView');

        FieldViewConfiguration.registerFieldView('string', StringFieldView);
        FieldViewConfiguration.registerFieldView('number', NumberFieldView);
    });

    it('should display a string field', () => {
        const field = new Field('name');
        const entity = new Entity('posts');
        const entry = {
            values: {
                'name': 'my posts #1'
            }
        };

        const col = getColumn(field, entity, entry);

        expect(col.innerHTML).toEqual('my posts #1');
    });

    it('should display a string field with a link', () => {
        const field = new NumberField('count');
        const entity = new Entity('posts');
        const entry = {
            values: {
                'count': 123
            }
        };

        field.isDetailLink(true);

        const col = getColumn(field, entity, entry);

        expect(col.tagName.toLowerCase()).toEqual('a');
        expect(col.querySelector('span').innerHTML).toEqual('123');
    });
});
