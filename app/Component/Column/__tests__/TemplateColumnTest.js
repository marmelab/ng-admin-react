jest.autoMockOff();

describe('TemplateColumn', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const TemplateColumn = require('../TemplateColumn');

    it('should execute template function with current entry if is a function', () => {
        const template = e => e.first_name + ' ' + e.last_name.toUpperCase();
        const entry = { 'last_name': 'Doe', 'first_name': 'John' };

        let templateColumn = TestUtils.renderIntoDocument(<TemplateColumn template={template} entry={entry} />);
        templateColumn = React.findDOMNode(templateColumn);

        expect(templateColumn.textContent).toBe('John DOE');
    });

    it('should transform template string through React compiler, giving access to `entry` value', () => {
        const template = '{entry.first_name} {entry.last_name.toUpperCase()}';
        const entry = { 'last_name': 'Doe', 'first_name': 'John' };

        let templateColumn = TestUtils.renderIntoDocument(<TemplateColumn template={template} entry={entry} />);
        templateColumn = React.findDOMNode(templateColumn);

        expect(templateColumn.textContent).toBe('John DOE');
    });
});
