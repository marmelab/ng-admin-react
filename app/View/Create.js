import React from 'react';
import Inflector from 'inflected'
import Datagrid from '../Component/Datagrid/Datagrid';
import ViewActions from '../Component/ViewActions';
import Compile from '../Component/Compile';

class CreateView extends React.Component {
    render() {
        let params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.props.configuration.getEntity(entityName).views["CreateView"];

        return (
            <div className="view show-view">
                <ViewActions entityName={view.entity.name()} buttons={['list']} />

                <div className="page-header">
                    <h1><Compile>{view.title() || "Create new " + Inflector.singularize(entityName)}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>
            </div>
        )
    }
}

CreateView.contextTypes = {
    router: React.PropTypes.func.isRequired
};
CreateView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default CreateView;
