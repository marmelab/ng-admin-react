import React from 'react';
import {Link} from 'react-router';
import jsx from 'jsx-transform';
import objectAssign from 'object-assign';

import { MaBackButton, MaCreateButton, MaShowButton, MaEditButton, MaDeleteButton, MaListButton } from './Button';
import { BooleanColumn, DateColumn, NumberColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn } from './Column';
import { InputField, CheckboxField, ButtonField } from './Field';

let Components = {
    MaBackButton, MaCreateButton, MaShowButton, MaEditButton, MaDeleteButton, MaListButton,
    BooleanColumn, DateColumn, NumberColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn,
    InputField, CheckboxField, ButtonField,
    Link, React
};

class Compile extends React.Component {
    evalInContext(template, context) {
        /*jshint evil:true*/
        var variables = [];
        for (let i in context) {
            if (context.hasOwnProperty(i)) {
                variables.push('var ' + i + ' = this.' + i);
            }
        }

        return eval(variables.join(';') + '; ' + jsx.fromString(template, context));
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

        if (typeof(children) === 'string') {
            // Wrap element without root tag
            if (children.trim()[0] !== '<') {
                children = '<span>' + children + '</span>';
            }

            // Import components into context
            props = objectAssign(props, Components);

            return this.evalInContext.apply(props, [children, props]);
        }

        return children;
    }
}

export default Compile;
