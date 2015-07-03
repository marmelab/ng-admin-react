import React from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import Inflector from 'inflected';
import debounce from 'lodash/function/debounce';
import { List } from 'immutable';

import { hasEntityAndView, getView, onLoadFailure, onSendFailure } from '../Mixins/MainView';

import Compile from '../Component/Compile';
import Notification from '../Services/Notification';
import NotFoundView from './NotFound';

import ViewActions from '../Component/ViewActions';
import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';
import Field from '../Component/Field/Field';

class EditView extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {}; // needed for ReactComponentWithPureRenderMixin::shouldComponentUpdate()

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
        this.hasEntityAndView = hasEntityAndView.bind(this);
        this.getView = getView.bind(this);
        this.onLoadFailure = onLoadFailure.bind(this);
        this.onSendFailure = onSendFailure.bind(this);
        this.updateField = debounce(this.updateField.bind(this), 300);

        this.viewName = 'EditView';
        this.isValidEntityAndView = this.hasEntityAndView(context.router.getCurrentParams().entity);
    }

    componentDidMount() {
        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);

        this.boundedOnUpdate = this.onUpdate.bind(this);
        EntityStore.addUpdateListener(this.boundedOnUpdate);

        EntityStore.addReadFailureListener(this.onLoadFailure);
        EntityStore.addWriteFailureListener(this.onSendFailure);

        if (this.isValidEntityAndView) {
            this.init();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id ||
            nextProps.query.sortField !== this.props.query.sortField ||
            nextProps.query.sortDir !== this.props.query.sortDir) {

            this.isValidEntityAndView = this.hasEntityAndView(nextProps.params.entity);
            if (this.isValidEntityAndView) {
                this.init();
            }
        }
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeUpdateListener(this.boundedOnUpdate);
        EntityStore.removeReadFailureListener(this.onLoadFailure);
        EntityStore.removeWriteFailureListener(this.onSendFailure);
    }

    init() {
        this.actions = List(this.getView().actions() || ['list', 'delete']);
        this.refreshData();
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    onUpdate() {
        Notification.log('Changes successfully saved.', { addnCls: 'humane-flatty-success' });
    }

    refreshData() {
        const {id} = this.context.router.getCurrentParams();
        const {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EntityActions.loadEditData(this.context.restful, this.context.configuration, this.getView(), id, sortField, sortDir);
    }

    updateField(name, value) {
        const choiceFields = this.getView().getFieldsOfType('choice');

        EntityActions.updateData(name, value, choiceFields);
    }

    save(e) {
        e.preventDefault();

        EntityActions.saveData(this.context.restful, this.context.configuration, this.getView());
    }

    buildFields(view, entry, dataStore) {
        let fields = [];
        const values = this.state.data.get('values');

        for (let field of view.getFields()) {
            const value = this.state.data.getIn(['values', field.name()]);

            fields.push(
                <div className="form-field form-group" key={field.order()}>
                    <Field field={field} value={value} values={values}
                           entity={view.getEntity()} entry={entry}
                           dataStore={dataStore} updateField={this.updateField} />
                </div>
            );
        }

        return fields;
    }

    render() {
        if (!this.isValidEntityAndView) {
            return <NotFoundView/>;
        }

        if (!this.state.hasOwnProperty('data')) {
            return null;
        }

        if (this.state.data.get('resourceNotFound')) {
            return <NotFoundView/>;
        }

        const entityName = this.context.router.getCurrentParams().entity;
        const view = this.getView(entityName);
        const dataStore = this.state.data.get('dataStore').first();
        const entry = dataStore.getFirstEntry(view.entity.uniqueId);

        if (!entry) {
            return null;
        }

        return (
            <div className="view edit-view">
                <ViewActions entityName={view.entity.name()} entry={entry} buttons={this.actions} />

                <div className="page-header">
                    <h1><Compile entry={entry}>{view.title() || 'Edit one ' + Inflector.singularize(entityName)}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <div className="row form-horizontal" id="edit-view">
                    <form className="col-lg-12 form-horizontal" onSubmit={this.save.bind(this)}>

                        {this.buildFields(view, entry, dataStore)}

                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="submit" className="btn btn-primary"><span className="glyphicon glyphicon-ok"></span> Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

EditView.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired,
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('EditView', EditView);

export default EditView;
