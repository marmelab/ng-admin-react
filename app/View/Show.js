import React from 'react';
import Inflector from 'inflected'
import { shouldComponentUpdate } from 'react-immutable-render-mixin';

import ViewActions from '../Component/ViewActions';
import ShowActions from '../Actions/ShowActions';
import ShowStore from '../Stores/ShowStore';
import ShowFields from '../Component/Show/ShowFields';

class ShowView extends React.Component {
    constructor() {
        super();

        this.state = ShowStore.getState();
        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    componentWillMount() {
        ShowStore.addChangeListener(this.onChange.bind(this));

        this.refreshData();
    }

    componentWillUnmount() {
        ShowStore.removeChangeListener(this.onChange.bind(this));
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).views.ShowView;
    }

    onChange() {
        this.setState(ShowStore.getState());
    }

    refreshData() {
        let {id} = this.context.router.getCurrentParams();
        let {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        ShowActions.loadData(this.props.configuration, this.getView(), id, sortField, sortDir);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity
            || nextProps.query.sortField !== this.props.query.sortField
            || nextProps.query.sortDir !== this.props.query.sortDir) {

            this.refreshData();
        }
    }

    render() {
        let params = this.context.router.getCurrentParams(),
            entityName = params.entity,
            view = this.getView(),
            dataStore = this.state.data.get('dataStore'),
            entry = dataStore.getFirstEntry(view.getEntity().uniqueId),
            actions = view.actions() || ['list', 'edit', 'delete'];

        return (
            <div className="view show-view">
                <ViewActions entityName={view.entity.name()} entry={entry} buttons={actions} />

                <div className="page-header">
                    <h1>{view.title() || Inflector.singularize(entityName) + " detail"}</h1>
                    <p className="description">{view.description()}</p>
                </div>

                <div className="row form-horizontal" id="show-view">
                    <ShowFields
                        fields={view.getFields()}
                        dataStore={dataStore}
                        view={view} />
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
