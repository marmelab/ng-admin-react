import React from 'react';
import Inflector from 'inflected';
import { shouldComponentUpdate } from 'react-immutable-render-mixin';
import Compile from '../Component/Compile';

import ViewActions from '../Component/ViewActions';
import EditActions from '../Actions/EditActions';
import EditStore from '../Stores/EditStore';
import FormFields from '../Component/Form/FormFields';

class EditView extends React.Component {
    constructor() {
        super();

        this.state = EditStore.getState();
        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
        this.save = this.save.bind(this);
    }

    componentWillMount() {
        EditStore.addChangeListener(this.onChange.bind(this));

        this.refreshData();
    }

    componentWillUnmount() {
        EditStore.removeChangeListener(this.onChange.bind(this));
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).editionView();
    }

    onChange() {
        this.setState(EditStore.getState());
    }

    refreshData() {
        let {id} = this.context.router.getCurrentParams();
        let {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EditActions.loadData(this.props.configuration, this.getView(), id, sortField, sortDir);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity
            || nextProps.query.sortField !== this.props.query.sortField
            || nextProps.query.sortDir !== this.props.query.sortDir) {

            this.refreshData();
        }
    }

    updateField(name, value) {
        EditActions.updateData(name, value);
    }

    save(e) {
        e.preventDefault();

        EditActions.saveData(this.props.configuration, this.getView());
    }

    render() {
        let params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.getView(entityName),
            dataStore = this.state.data.get('dataStore'),
            values = this.state.data.get('values'),
            entry = dataStore.getFirstEntry(view.getEntity().uniqueId),
            actions = view.actions() || ['list', 'delete'];

        return (
            <div className="view edit-view">
                <ViewActions entityName={view.entity.name()} entry={entry} buttons={actions} />

                <div className="page-header">
                    <h1><Compile>{view.title() || "Edit one " +entityName}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <div className="row form-horizontal" id="edit-view">
                    <form className="col-lg-12 form-horizontal" onSubmit={this.save}>
                        <FormFields
                        fields={view.getFields()}
                        dataStore={dataStore}
                        values={values}
                        view={view}
                        updateField={this.updateField} />

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
