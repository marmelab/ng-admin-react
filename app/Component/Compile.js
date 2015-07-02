import React from 'react';
import {Link} from 'react-router';
import jsx from 'jsx-transform';
import objectAssign from 'object-assign';

import { MaBackButton, MaCreateButton, MaShowButton, MaEditButton, MaDeleteButton, MaListButton } from './Button';
import { StringColumn, BooleanColumn, DateColumn, NumberColumn, ChoicesColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn, JsonColumn, ReferencedList, WysiwygColumn } from './Column';
import { InputField, CheckboxField, ButtonField, JsonField, DateField, SelectField, TextField, WysiwygField } from './Field';

const Components = {
    MaBackButton, MaCreateButton, MaShowButton, MaEditButton, MaDeleteButton, MaListButton,
    StringColumn, BooleanColumn, DateColumn, NumberColumn, ChoicesColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn, JsonColumn, ReferencedList, WysiwygColumn,
    InputField, CheckboxField, ButtonField, JsonField, DateField, SelectField, TextField, WysiwygField,
    Link, React
};

class Compile extends React.Component {
    evalInContext(template, context) {
        let variables = [];

        if ('string' === typeof template) {
            let args = [];
            for (let i in context) {
                if (this.hasOwnProperty(i)) {
                    args.push(i);
                    variables.push(this[i]);
                }
            }
            // code string to eval
            args.push(`return ${jsx.fromString(template, context)};`);

            // code will be executed in an isolated scope
            template = Function.apply(null, args);
        }

        if ('function' === typeof template) {
            return template.apply(this, variables);
        }

        if (console) {
            console.error(`Unable to compile template of type ${typeof template}`);
        }

        return '';
    }

    render() {
        let compiledElement = React.cloneElement(this);

        let props = compiledElement.props || {};
        props.factory = 'this.createElement';
        props.passUnknownTagsToFactory = true;
        props.createElement = React.createElement;

        if (!props || !props.children) {
            return null;
        }

        // Avoid string without root element
        let children = props.children;

        if (Array.isArray(children)) {
            children = children.join('');
        }

        if ('string' === typeof children || 'function' === typeof children) {
            // Wrap element without root tag
            if ('string' === typeof children) {
                if (children.trim()[0] !== '<') {
                    children = `<span>${children}</span>`;
                }
            }

            // Import components into context
            props = objectAssign(props, Components);
            props.props = this.props;

            return this.evalInContext.apply(props, [children, props]);
        }

        return children;
    }
}

require('../autoloader')('Compile', Compile);

export default Compile;
