import React from 'react';
import ViewActions from '../Component/ViewActions';

class EditView extends React.Component {
    render() {
        let params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.props.configuration.getEntity(entityName).views["EditView"];

        return (
            <div className="view list-view">
                <ViewActions view={view} buttons={['list'/* @TODO add other links when entry is present*/]} />

                <div className="page-header">
                    <h1>{view.title() || "Edit one " +entityName}</h1>
                    <p className="description">{view.description()}</p>
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
