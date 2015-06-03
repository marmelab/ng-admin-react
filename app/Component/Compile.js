
class Compile extends React.Component {
    evalInContext(template, context) {
        /*jshint evil:true*/
        return eval(jsx.fromString(template, context));
    }
    // Replace {someting} by {this.something}
    // Avoid to replace {this.someting} by {this.this.something}
    changePropsScope(element) {
        return element.replace(/{(\s*(?!this\.)[^}]+)}/g, '{this.$1}', element);
    }
    render() {
        let props = this.props || {};
        props.factory = 'this.createElement';
        props.createElement = React.createElement;

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
