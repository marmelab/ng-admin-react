import React from 'react';
import {Link} from 'react-router';
import jsx from 'jsx-transform';
import objectAssign from 'object-assign';

import { MaBackButton, MaCreateButton, MaShowButton, MaEditButton, MaDeleteButton, MaListButton } from './Button';
import { StringColumn, BooleanColumn, DateColumn, NumberColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn, JsonColumn, ReferencedList, WysiwygColumn } from './Column';
import { InputField, CheckboxField, ButtonField, JsonField, DateField, SelectField, TextField, WysiwygField } from './Field';

const Components = {
    MaBackButton, MaCreateButton, MaShowButton, MaEditButton, MaDeleteButton, MaListButton,
    StringColumn, BooleanColumn, DateColumn, NumberColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn, JsonColumn, ReferencedList, WysiwygColumn,
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

        if (typeof(template) === 'function') {
            this.React = React;
            template = template.apply(this, []);
        }

        if (typeof(template) === 'string') {
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

        if (typeof(children) === 'string' || typeof(children) === 'function') {
            // Wrap element without root tag
            if (typeof(children) === 'string') {
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
