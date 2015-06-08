import React from 'react';
import Inflector from 'inflected';
import {Link} from 'react-router';
import ViewActions from '../Component/ViewActions';
import Compile from '../Component/Compile';

import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';

class DeleteView extends React.Component {
    componentDidMount() {
        EntityStore.addDeleteListener(this.onDelete.bind(this));
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.onDelete.bind(this));
    }

    deleteEntry() {
        let {id} = this.context.router.getCurrentParams();

        EntityActions.deleteData(this.props.configuration, id, this.getView());
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).editionView();
    }

    onDelete() {
        let params = this.context.router.getCurrentParams(),
            entityName = params.entity;

        this.context.router.transitionTo('list', {entity: entityName});
    }

    render() {
        let params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.props.configuration.getEntity(entityName).views["DeleteView"],
            {id} = this.context.router.getCurrentParams(),
            backParams = {
                entity: entityName,
                id: id
            };

        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <ViewActions entityName={view.entity.name()} buttons={['back']} />

                        <div className="page-header">
                            <h1><Compile>{view.title()|| "Delete one " + Inflector.singularize(entityName)}</Compile> </h1>
                            <p className="description"><Compile>{view.description()}</Compile></p>
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
        )
    }
}

DeleteView.contextTypes = {
    router: React.PropTypes.func.isRequired
};
DeleteView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default DeleteView;
