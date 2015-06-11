import React from 'react';
import {RouteHandler} from 'react-router';

import Header from "./View/Common/Header";
import Sidebar from "./View/Common/Sidebar";

import FieldViewConfiguration from './Field/FieldViewConfiguration';

import BooleanFieldView from './Field/BooleanFieldView';
import DateFieldView from './Field/DateFieldView';
import EmailFieldView from './Field/EmailFieldView';
import JsonFieldView from './Field/JsonFieldView';
import NumberFieldView from './Field/NumberFieldView';
import StringFieldView from './Field/StringFieldView';
import ReferencedListFieldView from './Field/ReferencedListFieldView';
import ReferenceFieldView from './Field/ReferenceFieldView';
import ReferenceManyFieldView from './Field/ReferenceManyFieldView';
import TextFieldView from './Field/TextFieldView';
import TemplateFieldView from './Field/TemplateFieldView';

FieldViewConfiguration.registerFieldView('boolean', BooleanFieldView);
FieldViewConfiguration.registerFieldView('date', TextFieldView);
FieldViewConfiguration.registerFieldView('datetime', TextFieldView);
FieldViewConfiguration.registerFieldView('email', EmailFieldView);
FieldViewConfiguration.registerFieldView('json', JsonFieldView);
FieldViewConfiguration.registerFieldView('number', NumberFieldView);
FieldViewConfiguration.registerFieldView('referenced_list', ReferencedListFieldView);
FieldViewConfiguration.registerFieldView('reference', ReferenceFieldView);
FieldViewConfiguration.registerFieldView('reference_many', ReferenceManyFieldView);
FieldViewConfiguration.registerFieldView('string', StringFieldView);
FieldViewConfiguration.registerFieldView('template', TemplateFieldView);
FieldViewConfiguration.registerFieldView('text', TextFieldView);

require('../styles/app.scss');

class AdminBootstrap extends React.Component {
    render() {
        return (
            <div>
                <Header title={this.props.configuration.title()}/>
                <Sidebar menuViews={this.props.configuration.menu()}/>
                <div className="view-wrapper">
                    <RouteHandler configuration={this.props.configuration}/>
                </div>
            </div>
        );
    }
}

export default AdminBootstrap;
