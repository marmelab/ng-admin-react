import React from 'react';

class TemplateField extends React.Component {
    render() {
        var template = this.props.template;

        var computedTemplate = template;
        if (typeof(template) === 'function') {
            computedTemplate = template(this.props.entry);
        }

        // @TODO: deal with string template

        return (
            <span>{computedTemplate}</span>
        );
    }
}

export default TemplateField;
