'use strict';

import React from 'react';

class TemplateColumn extends React.Component {
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

TemplateColumn.propTypes = {
    template: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func
    ]).isRequired
};

export default TemplateColumn;
