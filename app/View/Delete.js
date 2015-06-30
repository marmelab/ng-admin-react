import React from 'react';
import Inflector from 'inflected';
import {Link} from 'react-router';
import {shouldComponentUpdate} from 'react-immutable-render-mixin';

import Compile from '../Component/Compile';
import NotFoundView from './NotFound';

import ViewActions from '../Component/ViewActions';
import EntityActions from '../Actions/EntityActions';

import EntityStore from '../Stores/EntityStore';
import Notification from '../Services/Notification';

class DeleteView extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        this.boundedOnDelete = this.onDelete.bind(this);
        EntityStore.addDeleteListener(this.boundedOnDelete);

        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);

        this.boundedOnFailure = this.onDeletionFailure.bind(this);
        EntityStore.addFailureListener(this.boundedOnFailure);

        if (this.hasEntityAndView()) {
            this.refreshData();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id) {
            if (this.hasEntityAndView(nextProps.params.entity)) {
                this.refreshData();
            }
        }
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeDeleteListener(this.boundedOnDelete);
        EntityStore.removeFailureListener(this.boundedOnFailure);
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        const {id} = this.context.router.getCurrentParams();

        EntityActions.loadDeleteData(this.context.restful, this.props.configuration, this.getView(), id);
    }

    deleteEntry() {
        const {id} = this.context.router.getCurrentParams();

        EntityActions.deleteData(this.context.restful, this.props.configuration, id, this.getView());
    }

    hasEntityAndView(entityName) {
        try {
            const view = this.getView(entityName);

            return view.enabled;
        } catch (e) {
            return false;
        }
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).deletionView();
    }

    onDelete() {
        const params = this.context.router.getCurrentParams();
        const entityName = params.entity;

        Notification.log('Element successfully deleted.', { addnCls: 'humane-flatty-success' });

        this.context.router.transitionTo('list', {entity: entityName});
    }

    onDeletionFailure(response) {
        if (response.status && 404 === response.status) {
            EntityActions.flagResourceNotFound(true);

            return;
        }

        let body = response.data;
        if ('object' === typeof message) {
            body = JSON.stringify(body);
        }

        Notification.log(`Oops, an error occured : (code: ${response.status}) ${body}`, {addnCls: 'humane-flatty-error'});
    }

    render() {
        const entityName = this.context.router.getCurrentParams().entity;
        if (!this.hasEntityAndView(entityName)) {
            return <NotFoundView/>;
        }

        if (!this.state) {
            return null;
        }

        if (this.state.data.get('resourceNotFound')) {
            return <NotFoundView/>;
        }

        const view = this.props.configuration.getEntity(entityName).deletionView();
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
                        <ViewActions entityName={view.entity.name()} buttons={['back']} />

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
    restful: React.PropTypes.func.isRequired
};
DeleteView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('DeleteView', DeleteView);

export default DeleteView;
