import React from 'react';
import Datagrid from '../Component/Datagrid/Datagrid';

class ListView extends React.Component {
    render() {
        var params = this.context.router.getCurrentParams();
        var entityName = params.entity;
        var view = this.props.configuration.getEntity(entityName).views["ListView"];

        return (
            <div className="view list-view">
                <div className="page-header">
                    <h1>{view.title() || entityName + " list"}</h1>
                    <p className="description">{view.description()}</p>
                </div>
                <Datagrid view={view} fields={view.fields()} />
            </div>
        )
    }
}

ListView.contextTypes = {
    router: React.PropTypes.func.isRequired
};
ListView.propTypes = {
    configuration: React.PropTypes.object.isRequired
}

export default ListView;
