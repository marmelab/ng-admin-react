import React from 'react';
import Datagrid from '../Component/Datagrid/Datagrid';
import ViewActions from '../Component/ViewActions';

class ShowView extends React.Component {
    render() {
        let params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.props.configuration.getEntity(entityName).views["ShowView"];

        return (
            <div className="view show-view">
                <div className="page-header">
                    <h1>{view.title() || entityName + " detail"}</h1>
                    <p className="description">{view.description()}</p>
                </div>

                <ViewActions view={view} buttons={['list' /* @TODO add other links when entry is present*/]} />
            </div>
        )
    }
}

ShowView.contextTypes = {
    router: React.PropTypes.func.isRequired
};
ShowView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default ShowView;
