jest.dontMock('../TemplateField');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('TemplateField', () => {
    var TemplateField;

    beforeEach(() => {
        TemplateField = require('../TemplateField');
    });

    it('should execute template function with current entry if is a function', () => {
        var template = (e => e.first_name + " " + e.last_name.toUpperCase());
        var entry = { last_name: 'Doe', first_name: 'John' };

        var templateField = TestUtils.renderIntoDocument(<TemplateField template={template} entry={entry} />);
        templateField = React.findDOMNode(templateField);

        expect(templateField.textContent).toBe('John DOE');
    });

    xit('should transform template string through React compiler, giving access to `entry` value', () => {
        var template = "{e.first_name} {e.last_name.toUpperCase()}";
        var entry = { last_name: 'Doe', first_name: 'John' };

        var templateField = TestUtils.renderIntoDocument(<TemplateField template={template} entry={entry} />);
        templateField = React.findDOMNode(templateField);

        expect(templateField.textContent).toBe('John DOE');
    });
});
