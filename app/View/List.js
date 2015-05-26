import React from 'react';
import Datagrid from '../Component/Datagrid/Datagrid';
import ViewActions from '../Component/ViewActions';

class ListView extends React.Component {
    render() {
        let entityName = this.context.router.getCurrentParams().entity;
        let configuration = this.props.configuration;
        let view = configuration.getEntity(entityName).views.ListView;

        return (
            <div className="view list-view">
                <ViewActions view={view} buttons={['create']} />

                <div className="page-header">
                    <h1>{view.title() || entityName + " list"}</h1>
                    <p className="description">{view.description()}</p>
                </div>

                <Datagrid router={this.context.router} configuration={configuration} view={view} fields={view.fields()} />
            </div>
        )
    }
}

ListView.contextTypes = {
    router: React.PropTypes.func.isRequired
};
ListView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default ListView;
