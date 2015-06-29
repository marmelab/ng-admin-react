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
        /*jshint evil:true*/
        var variables = [];
        for (let i in context) {
            if (context.hasOwnProperty(i)) {
                variables.push(`var ${i} = this.${i}`);
            }
        }

        if ('function' === typeof template) {
            this.React = React;
            template = template.apply(this, []);
        }

        if ('string' === typeof template) {
            return eval(`${variables.join(';')}; ${jsx.fromString(template, context)}`);
        }

        return template;
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
