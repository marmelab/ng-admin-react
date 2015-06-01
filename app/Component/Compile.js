import React from 'react';
import jsx from 'jsx-transform';

class Compile extends React.Component {
    evalInContext(template, context) {
        /*jshint evil:true*/
        with (context) {
            return eval(jsx.fromString(template, context));
        }
    }
    render() {
        let props = this.props || {};
        props.factory = 'createElement';
        props.createElement = React.createElement;

        // Avoid string without root element
        let children = this.props.children.trim();
        if (children.length && children[0] !== '<') {
            children = '<span>' + children + '</span>';
        }

        return this.evalInContext(children, props);
    }
}

export default Compile;
