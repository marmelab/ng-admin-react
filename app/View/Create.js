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

class CreateView extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {}; // needed for ReactComponentWithPureRenderMixin::shouldComponentUpdate()

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
        this.hasEntityAndView = hasEntityAndView.bind(this);
        this.getView = getView.bind(this);
        this.onLoadFailure = onLoadFailure.bind(this);
        this.onSendFailure = onSendFailure.bind(this);
        this.updateField = debounce(this.updateField.bind(this), 300);

        this.viewName = 'CreateView';
        this.isValidEntityAndView = this.hasEntityAndView(context.router.getCurrentParams().entity);
    }

    componentDidMount() {
        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);

        this.boundedOnCreate = this.onCreate.bind(this);
        EntityStore.addCreateListener(this.boundedOnCreate);

        EntityStore.addReadFailureListener(this.onLoadFailure);
        EntityStore.addWriteFailureListener(this.onSendFailure);

        if (this.isValidEntityAndView) {
            this.init();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity) {
            this.isValidEntityAndView = this.hasEntityAndView(nextProps.params.entity);
            if (this.isValidEntityAndView) {
                this.init();
            }
        }
    }

    componentWillUnmount() {
        EntityStore.removeCreateListener(this.boundedOnCreate);
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeReadFailureListener(this.onLoadFailure);
        EntityStore.removeWriteFailureListener(this.onSendFailure);
    }

    init() {
        this.actions = List(this.getView().actions() || ['list']);
        this.refreshData();
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        EntityActions.loadCreateData(this.context.restful, this.context.configuration, this.getView());
    }

    updateField(name, value) {
        EntityActions.updateData(name, value);
    }

    save(e) {
        e.preventDefault();

        EntityActions.saveData(this.context.restful, this.context.configuration, this.getView());
    }

    onCreate() {
        const entityName = this.context.router.getCurrentParams().entity;
        const dataStore = this.state.data.get('dataStore').first();
        const entry = dataStore.getFirstEntry(this.getView(entityName).entity.uniqueId);

        Notification.log('Element successfully created.', {addnCls: 'humane-flatty-success'});

        this.context.router.transitionTo('edit', { entity: entityName, id: entry.identifierValue });
    }

    buildFields(view, entry, dataStore) {
        let fields = [];
        const values = this.state.data.get('values');

        for (let field of view.getFields()) {
            const value = this.state.data.getIn(['values', field.name()]);

            fields.push(
                <div className="form-field form-group" key={field.order()}>
                    <Field field={field} value={value} entity={view.entity}
                           values={values} entry={entry}
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
            <div className="view create-view">
                <ViewActions entityName={view.entity.name()} entry={entry} buttons={this.actions} />

                <div className="page-header">
                    <h1><Compile entry={entry}>{view.title() || 'Create new ' + Inflector.singularize(entityName)}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <div className="row form-horizontal" id="create-view">
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

CreateView.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired,
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('CreateView', CreateView);

export default CreateView;
