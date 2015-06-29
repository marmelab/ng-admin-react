import React from 'react';
import Compile from '../Compile';

class TemplateColumn extends React.Component {
    render() {
        const template = this.props.template;

        let computedTemplate = template;
        if ('function' === typeof template) {
            computedTemplate = template.apply(this, [this.props.entry]);
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
    ]).isRequired,
    entry: React.PropTypes.object
};

require('../../autoloader')('TemplateColumn', TemplateColumn);

export default TemplateColumn;
