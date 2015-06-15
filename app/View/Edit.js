import React from 'react';
import Inflector from 'inflected';
import { shouldComponentUpdate } from 'react-immutable-render-mixin';
import Compile from '../Component/Compile';

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
        EntityStore.addChangeListener(this.onChange.bind(this));

        this.refreshData();
    }

    componentWillUnmount() {
        EntityStore.removeAllListeners();
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).editionView();
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        let {id} = this.context.router.getCurrentParams();
        let {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EntityActions.loadEditData(this.props.configuration, this.getView(), id, sortField, sortDir);
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
        EntityActions.updateData(name, value);
    }

    save(e) {
        e.preventDefault();

        EntityActions.saveData(this.props.configuration, this.getView());
    }

    buildFields(view, entry, dataStore) {
        let fields = [];

        for (let field of view.getFields()) {
            let value = this.state.data.getIn(['values', field.name()]);

            fields.push(
                <div className="form-field form-group" key={field.order()}>
                    <Field field={field} value={value} entity={view.getEntity()} entry={entry} configuration={this.props.configuration}
                           dataStore={dataStore} updateField={this.updateField} />
                </div>
            );
        }

        return fields;
    }

    render() {
        if (!this.state) {
            return <div />;
        }

        let entityName = this.context.router.getCurrentParams().entity;
        let view = this.getView(entityName);
        let dataStore = this.state.data.get('dataStore').first();
        let entry = dataStore.getFirstEntry(view.entity.uniqueId);
        let actions = view.actions() || ['list', 'delete'];

        if (!entry) {
            return <div />;
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
    router: React.PropTypes.func.isRequired
};
EditView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default EditView;
