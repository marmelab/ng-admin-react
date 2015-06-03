import React from 'react';
import jsx from 'jsx-transform';

class Compile extends React.Component {
    evalInContext(template, context) {
        /*jshint evil:true*/
        return eval(jsx.fromString(template, context));
    }
    // Replace {something} by {this.something}
    // Avoid to replace {this.something} by {this.this.something}
    // Allows to escape like \{something\}
    changePropsScope(element) {
        // Real regexp should be /(?<!\\){(\s*(?!this\.)[^}]+)(?<!\\)}/
        // But JS doesn't handle negative lookbehind
        return element.replace(/(\\)?{(\s*(?!this\.)[^\\}]+)(\\)?}/g, function($0, $1, $2)  {
            return $1 === '\\' ?  '{' + $2 + '}' : '{this.' + $2 + '}';
        });
    }
    render() {
        let props = this.props || {};
        props.factory = 'this.createElement';
        props.createElement = React.createElement;

        if (!this.props || !this.props.children) {
            return null;
        }

        // Avoid string without root element
        let children = this.props.children;

        if (Array.isArray(children)) {
            children = children.join('');
        }

        if (typeof(children) === 'string') {
            // Wrap element without root tag
            if (children.trim()[0] !== '<') {
                children = '<span>' + children + '</span>';
            }

            // Trick to allow scope swapping in eval statement
            children = this.changePropsScope(children);

            return this.evalInContext.apply(props, [children, props]);
        }

        return children;
    }
}

export default Compile;
