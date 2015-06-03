import React from 'react';
import ViewActions from '../Component/ViewActions';
import Compile from '../Component/Compile';

class EditView extends React.Component {
    render() {
        let params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.props.configuration.getEntity(entityName).views["EditView"];

        return (
            <div className="view list-view">
                <ViewActions entityName={view.entity.name()} buttons={['list'/* @TODO add other links when entry is present*/]} />

                <div className="page-header">
                    <h1><Compile>{view.title() || "Edit one " +entityName}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>
            </div>
        )
    }
}

EditView.contextTypes = {
    router: React.PropTypes.func.isRequired
};
EditView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default EditView;
