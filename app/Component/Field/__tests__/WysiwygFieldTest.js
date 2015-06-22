jest.autoMockOff();

describe('WysiwygField', () => {
    let React, WysiwygField, Editor, TestUtils, values = {};
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        React = require('react/addons');
        WysiwygField = require('../WysiwygField');
        Editor = require('react-medium-editor/lib/editor');

        TestUtils = React.addons.TestUtils;
    });

    it('should get a div with correct default value and editable', () => {
        const html = '<p>Para</p>';
        const instance = TestUtils.renderIntoDocument(<WysiwygField name="my_field" value={html} updateField={onChange}/>);
        const editor = TestUtils.findRenderedComponentWithType(instance, Editor);

        expect(editor.state.text).toBe('<p>Para</p>');

        editor.change('<p>Para</p><p>My new Para</p>');

        expect(values).toEqual({ 'my_field': '<p>Para</p><p>My new Para</p>' });
    });
});
