import React from 'react';
import Inflector from 'inflected'
import ViewActions from '../Component/ViewActions';
import Compile from '../Component/Compile';

class DeleteView extends React.Component {
    render() {
        let params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.props.configuration.getEntity(entityName).views["DeleteView"];

        return (
            <div className="view list-view">
                <ViewActions entityName={view.entity.name()} buttons={['back']} />

                <div className="page-header">
                    <h1><Compile>{view.title()|| "Delete one " + Inflector.singularize(entityName)}</Compile> </h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
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
