jest.autoMockOff();
jest.dontMock('../TemplateColumn');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('TemplateColumn', () => {
    var TemplateColumn;

    beforeEach(() => {
        TemplateColumn = require('../TemplateColumn');
    });

    it('should execute template function with current entry if is a function', () => {
        var template = (e => e.first_name + " " + e.last_name.toUpperCase());
        var entry = { last_name: 'Doe', first_name: 'John' };

        var templateColumn = TestUtils.renderIntoDocument(<TemplateColumn template={template} entry={entry} />);
        templateColumn = React.findDOMNode(templateColumn);

        expect(templateColumn.textContent).toBe('John DOE');
    });

    xit('should transform template string through React compiler, giving access to `entry` value', () => {
        var template = "{e.first_name} {e.last_name.toUpperCase()}";
        var entry = { last_name: 'Doe', first_name: 'John' };

        var templateColumn = TestUtils.renderIntoDocument(<TemplateColumn template={template} entry={entry} />);
        templateColumn = React.findDOMNode(templateColumn);

        expect(templateColumn.textContent).toBe('John DOE');
    });
});
