import React from 'react';
import Inflector from 'inflected';
import { shouldComponentUpdate } from 'react-immutable-render-mixin';
import Compile from '../Component/Compile';
import Notification from '../Services/Notification';

import ViewActions from '../Component/ViewActions';
import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';
import Field from '../Component/Field/Field';

class CreateView extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);

        this.boundedOnCreate = this.onCreate.bind(this);
        EntityStore.addCreateListener(this.boundedOnCreate);

        this.boundedOnFailure = this.onFailure.bind(this);
        EntityStore.addFailureListener(this.boundedOnFailure);

        this.refreshData();
    }

    componentWillUnmount() {
        EntityStore.removeCreateListener(this.boundedOnCreate);
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeFailureListener(this.boundedOnFailure);
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).creationView();
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        EntityActions.loadCreateData(this.context.restful, this.props.configuration, this.getView());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity) {

            this.refreshData();
        }
    }

    updateField(name, value) {
        EntityActions.updateData(name, value);
    }

    save(e) {
        e.preventDefault();

        EntityActions.saveData(this.context.restful, this.props.configuration, this.getView());
    }

    onCreate() {
        const entityName = this.context.router.getCurrentParams().entity;
        const dataStore = this.state.data.get('dataStore').first();
        const entry = dataStore.getFirstEntry(this.getView(entityName).entity.uniqueId);

        Notification.log('Element successfully created.', {addnCls: 'humane-flatty-success'});

        this.context.router.transitionTo('edit', { entity: entityName, id: entry.identifierValue });
    }

    onFailure(response) {
        let body = response.data;
        if (typeof message === 'object') {
            body = JSON.stringify(body);
        }

        Notification.log(`Oops, an error occured : (code: ${response.status}) ${body}`,
            {addnCls: 'humane-flatty-error'});
    }

    buildFields(view, entry, dataStore) {
        let fields = [];
        const values = this.state.data.get('values');

        for (let field of view.getFields()) {
            const value = this.state.data.getIn(['values', field.name()]);

            fields.push(
                <div className="form-field form-group" key={field.order()}>
                    <Field field={field} value={value} entity={view.entity}
                           values={values} entry={entry}
                           dataStore={dataStore} updateField={this.updateField} />
                </div>
            );
        }

        return fields;
    }

    render() {
        if (!this.state) {
            return null;
        }

        const entityName = this.context.router.getCurrentParams().entity;
        const view = this.getView(entityName);
        const dataStore = this.state.data.get('dataStore').first();
        const entry = dataStore.getFirstEntry(view.entity.uniqueId);
        const actions = view.actions() || ['list'];

        if (!entry) {
            return null;
        }

        return (
            <div className="view create-view">
                <ViewActions entityName={view.entity.name()} entry={entry} buttons={actions} />

                <div className="page-header">
                    <h1><Compile entry={entry}>{view.title() || "Create new " + Inflector.singularize(entityName)}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <div className="row form-horizontal" id="create-view">
                    <form className="col-lg-12 form-horizontal" onSubmit={this.save.bind(this)}>

                        {this.buildFields(view, entry, dataStore)}

                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="submit" className="btn btn-primary"><span className="glyphicon glyphicon-ok"></span> Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

CreateView.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired
};
CreateView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('CreateView', CreateView);

export default CreateView;
