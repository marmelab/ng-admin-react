import React from 'react';
import Inflector from 'inflected';
import {Link} from 'react-router';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import { List } from 'immutable';

import { hasEntityAndView, getView, onLoadFailure, onSendFailure } from '../Mixins/MainView';

import Compile from '../Component/Compile';
import NotFoundView from './NotFound';

import ViewActions from '../Component/ViewActions';
import EntityActions from '../Actions/EntityActions';

import EntityStore from '../Stores/EntityStore';
import Notification from '../Services/Notification';

class DeleteView extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {}; // needed for ReactComponentWithPureRenderMixin::shouldComponentUpdate()

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
        this.hasEntityAndView = hasEntityAndView.bind(this);
        this.getView = getView.bind(this);
        this.onLoadFailure = onLoadFailure.bind(this);
        this.onSendFailure = onSendFailure.bind(this);

        this.viewName = 'DeleteView';
        this.isValidEntityAndView = this.hasEntityAndView(context.router.getCurrentParams().entity);
    }

    componentDidMount() {
        this.boundedOnDelete = this.onDelete.bind(this);
        EntityStore.addDeleteListener(this.boundedOnDelete);

        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);

        EntityStore.addReadFailureListener(this.onLoadFailure);
        EntityStore.addWriteFailureListener(this.onSendFailure);

        if (this.isValidEntityAndView) {
            this.refreshData();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity || nextProps.params.id !== this.props.params.id) {
            this.isValidEntityAndView = this.hasEntityAndView(nextProps.params.entity);
            if (this.isValidEntityAndView) {
                this.refreshData();
            }
        }
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeDeleteListener(this.boundedOnDelete);
        EntityStore.removeReadFailureListener(this.onLoadFailure);
        EntityStore.removeWriteFailureListener(this.onSendFailure);
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        const { id } = this.context.router.getCurrentParams();

        EntityActions.loadDeleteData(this.context.restful, this.context.configuration, this.getView(), id);
    }

    deleteEntry() {
        const { id } = this.context.router.getCurrentParams();

        EntityActions.deleteData(this.context.restful, this.context.configuration, id, this.getView());
    }

    onDelete() {
        const params = this.context.router.getCurrentParams();
        const entityName = params.entity;

        Notification.log('Element successfully deleted.', { addnCls: 'humane-flatty-success' });

        this.context.router.transitionTo('list', {entity: entityName});
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
        const backParams = {
            entity: entityName,
            id: this.context.router.getCurrentParams().id
        };

        if (!entry) {
            return null;
        }

        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <ViewActions entityName={view.entity.name()} buttons={List(['back'])} />

                        <div className="page-header">
                            <h1><Compile entry={entry}>{view.title() || 'Delete one ' + Inflector.singularize(entityName)}</Compile></h1>
                            <p className="description"><Compile entry={entry}>{view.description()}</Compile></p>
                        </div>
                    </div>
                </div>

                <div className="row" id="delete-view">
                    <div className="col-lg-12">
                        <p>Are you sure ?</p>
                        <button className="btn btn-danger" onClick={this.deleteEntry.bind(this)}>Yes</button>
                        <Link to="edit" params={backParams} className="btn btn-default">No</Link>
                    </div>
                </div>
            </div>
        );
    }
}

DeleteView.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired,
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('DeleteView', DeleteView);

export default DeleteView;
