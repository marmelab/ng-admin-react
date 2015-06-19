jest.autoMockOff();

describe('TemplateColumn', () => {
    let React, TestUtils, TemplateColumn;

    beforeEach(() => {
        React = require('react/addons');
        TestUtils = React.addons.TestUtils;
        TemplateColumn = require('../TemplateColumn');
    });

    it('should execute template function with current entry if is a function', () => {
        const template = (e => e.first_name + " " + e.last_name.toUpperCase());
        const entry = { last_name: 'Doe', first_name: 'John' };

        let templateColumn = TestUtils.renderIntoDocument(<TemplateColumn template={template} entry={entry} />);
        templateColumn = React.findDOMNode(templateColumn);

        expect(templateColumn.textContent).toBe('John DOE');
    });

    xit('should transform template string through React compiler, giving access to `entry` value', () => {
        const template = "{e.first_name} {e.last_name.toUpperCase()}";
        const entry = { last_name: 'Doe', first_name: 'John' };

        let templateColumn = TestUtils.renderIntoDocument(<TemplateColumn template={template} entry={entry} />);
        templateColumn = React.findDOMNode(templateColumn);

        expect(templateColumn.textContent).toBe('John DOE');
    });
});
