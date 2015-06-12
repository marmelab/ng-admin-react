import React from 'react';
import Inflector from 'inflected'
import { shouldComponentUpdate } from 'react-immutable-render-mixin';

import ViewActions from '../Component/ViewActions';
import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';
import Column from '../Component/Column/Column';
import Compile from '../Component/Compile';

class ShowView extends React.Component {
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

        return this.props.configuration.getEntity(entityName).showView();
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        let {id} = this.context.router.getCurrentParams();
        let {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EntityActions.loadShowData(this.props.configuration, this.getView(), id, sortField, sortDir);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id ||
            nextProps.query.sortField !== this.props.query.sortField ||
            nextProps.query.sortDir !== this.props.query.sortDir) {

            this.refreshData();
        }
    }

    render() {
        if (!this.state) {
            return <div />;
        }

        let params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.getView(),
            dataStore = this.state.data.getIn(['dataStore', 'object']),
            entry = dataStore.getFirstEntry(view.getEntity().uniqueId),
            actions = view.actions() || ['list', 'edit', 'delete'];

        if (!entry) {
            return <div />;
        }

        return (
            <div className="view show-view">
                <ViewActions entityName={view.entity.name()} entry={entry} buttons={actions} />

                <div className="page-header">
                    <h1><Compile>{view.title() || Inflector.singularize(entityName) + " detail"}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <div className="row form-horizontal" id="show-view">
                    { view.getFields().map((field, i) => (
                        <div className="col-lg-12 form-group" key={i}>
                            <label className="col-sm-2 control-label">{ field.label() }</label>

                            <div className={'show-value react-admin-field-' + field.name() + (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7')}>
                                <Column field={field} entity={view.getEntity()} entry={entry} configuration={this.props.configuration} />
                            </div>
                        </div>
                    ))}
                </div>
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
