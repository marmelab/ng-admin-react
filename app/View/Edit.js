import React from 'react';
import Inflector from 'inflected';
import { shouldComponentUpdate } from 'react-immutable-render-mixin';
import Compile from '../Component/Compile';
import Notification from '../Services/Notification';

import ViewActions from '../Component/ViewActions';
import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';
import Field from '../Component/Field/Field';

class EditView extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);

        this.boundedOnUpdate = this.onUpdate.bind(this);
        EntityStore.addUpdateListener(this.boundedOnUpdate);

        this.boundedOnFailure = this.onFailure.bind(this);
        EntityStore.addFailureListener(this.boundedOnFailure);

        this.refreshData();
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeUpdateListener(this.boundedOnUpdate);
        EntityStore.removeFailureListener(this.boundedOnFailure);
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).editionView();
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    onUpdate() {
        Notification.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
    }

    refreshData() {
        const {id} = this.context.router.getCurrentParams();
        const {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EntityActions.loadEditData(this.context.restful, this.props.configuration, this.getView(), id, sortField, sortDir);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id ||
            nextProps.query.sortField !== this.props.query.sortField ||
            nextProps.query.sortDir !== this.props.query.sortDir) {

            this.refreshData();
        }
    }

    updateField(name, value) {
        const choiceFields = this.getView().getFieldsOfType('choice');

        EntityActions.updateData(name, value, choiceFields);
    }

    onFailure(response) {
        let body = response.data;
        if (typeof message === 'object') {
            body = JSON.stringify(body);
        }

        Notification.log(`Oops, an error occured : (code: ${response.status}) ${body}`,
            {addnCls: 'humane-flatty-error'});
    }

    save(e) {
        e.preventDefault();

        EntityActions.saveData(this.context.restful, this.props.configuration, this.getView());
    }

    buildFields(view, entry, dataStore) {
        let fields = [];
        const values = this.state.data.get('values');

        for (let field of view.getFields()) {
            const value = this.state.data.getIn(['values', field.name()]);

            fields.push(
                <div className="form-field form-group" key={field.order()}>
                    <Field field={field} value={value} values={values}
                           entity={view.getEntity()} entry={entry}
                           configuration={this.props.configuration}
                           dataStore={dataStore} updateField={this.updateField.bind(this)} />
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
        const actions = view.actions() || ['list', 'delete'];

        if (!entry) {
            return null;
        }

        return (
            <div className="view edit-view">
                <ViewActions entityName={view.entity.name()} entry={entry} buttons={actions} />

                <div className="page-header">
                    <h1><Compile entry={entry}>{view.title() || "Edit one " + Inflector.singularize(entityName)}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <div className="row form-horizontal" id="edit-view">
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

EditView.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired
};
EditView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('EditView', EditView);

export default EditView;
