jest.dontMock('../TemplateField');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('TemplateField', function() {
    var TemplateField;

    beforeEach(function() {
        TemplateField = require('../TemplateField');
    });

    it('should execute template function with current entry if is a function', function() {
        var template = (e => e.first_name + " " + e.last_name.toUpperCase());
        var entry = { last_name: 'Doe', first_name: 'John' };

        var templateField = TestUtils.renderIntoDocument(<TemplateField template={template} entry={entry} />);
        templateField = React.findDOMNode(templateField);

        expect(templateField.textContent).toBe('John DOE');
    });

    xit('should transform template string through React compiler, giving access to `entry` value', function() {
        var template = "{e.first_name} {e.last_name.toUpperCase()}";
        var entry = { last_name: 'Doe', first_name: 'John' };

        var templateField = TestUtils.renderIntoDocument(<TemplateField template={template} entry={entry} />);
        templateField = React.findDOMNode(templateField);

        expect(templateField.textContent).toBe('John DOE');
    });
});
