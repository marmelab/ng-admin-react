import React from 'react';

class TemplateField extends React.Component {
    render() {
        let template = this.props.template,
            computedTemplate = template;

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
