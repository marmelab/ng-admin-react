import React from 'react';
import ViewActions from '../Component/ViewActions';

class DeleteView extends React.Component {
    render() {
        let params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.props.configuration.getEntity(entityName).views["DeleteView"];

        return (
            <div className="view list-view">
                <div className="page-header">
                    <h1>{view.title() || "Delete one " +entityName}</h1>
                    <p className="description">{view.description()}</p>
                </div>
                <ViewActions view={view} buttons={['back']} />
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
