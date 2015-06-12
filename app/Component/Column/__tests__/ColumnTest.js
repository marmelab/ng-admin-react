jest.autoMockOff();
jest.dontMock('../../../Field/FieldViewConfiguration');
jest.dontMock('../../../Field/StringFieldView');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

import Field from 'admin-config/lib/Field/Field';
import NumberField from 'admin-config/lib/Field/NumberField';
import Entity from 'admin-config/lib/Entity/Entity';

var Column = require('../Column');
var FieldViewConfiguration = require('../../../Field/FieldViewConfiguration');
var StringFieldView = require('../../../Field/StringFieldView');
var NumberFieldView = require('../../../Field/NumberFieldView');

FieldViewConfiguration.registerFieldView('string', StringFieldView);
FieldViewConfiguration.registerFieldView('number', NumberFieldView);


function getColumn(field, entity, entry, dataStore, configuration) {
    let col = TestUtils.renderIntoDocument(<Column field={field} entity={entity} entry={entry}
                                                         dataStore={dataStore} configuration={configuration} />);

    return React.findDOMNode(col);
}

describe('Column', () => {

    it('should display a string field', () => {
        let field = new Field('name');
        let entity = new Entity('posts');
        let entry = {
            values: {
                'name': 'my posts #1'
            }
        };

        var col = getColumn(field, entity, entry);

        expect(col.innerHTML).toEqual('my posts #1');
    });

    it('should display a string field with a link', () => {
        let field = new NumberField('count');
        let entity = new Entity('posts');
        let entry = {
            values: {
                'count': 123
            }
        };

        field.isDetailLink(true);

        var col = getColumn(field, entity, entry);

        expect(col.tagName.toLowerCase()).toEqual('a');
        expect(col.querySelector('span').innerHTML).toEqual('123');
    });
});
