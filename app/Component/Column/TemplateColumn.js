import React from 'react';
import Compile from '../Compile';

class TemplateColumn extends React.Component {
    render() {
        var template = this.props.template;

        var computedTemplate = template;
        if (typeof(template) === 'function') {
            computedTemplate = template(this.props.entry);
        }

        return (
            <Compile entry={this.props.entry}>{computedTemplate}</Compile>
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
