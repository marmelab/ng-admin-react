import React from 'react';
import Inflector from 'inflected';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';
import { List } from 'immutable';

import { hasEntityAndView, getView, onLoadFailure } from '../Mixins/MainView';

import NotFoundView from './NotFound';

import ViewActions from '../Component/ViewActions';
import EntityActions from '../Actions/EntityActions';
import EntityStore from '../Stores/EntityStore';
import Column from '../Component/Column/Column';
import Compile from '../Component/Compile';

class ShowView extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {}; // needed for ReactComponentWithPureRenderMixin::shouldComponentUpdate()

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
        this.hasEntityAndView = hasEntityAndView.bind(this);
        this.getView = getView.bind(this);
        this.onLoadFailure = onLoadFailure.bind(this);

        this.viewName = 'ShowView';
        this.isValidEntityAndView = this.hasEntityAndView(context.router.getCurrentParams().entity);
    }

    componentDidMount() {
        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);
        EntityStore.addReadFailureListener(this.onLoadFailure);

        if (this.isValidEntityAndView) {
            this.refreshData();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id ||
            nextProps.query.sortField !== this.props.query.sortField ||
            nextProps.query.sortDir !== this.props.query.sortDir) {

            this.isValidEntityAndView = this.hasEntityAndView(nextProps.params.entity);
            if (this.isValidEntityAndView) {
                this.refreshData();
            }
        }
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeReadFailureListener(this.onLoadFailure);
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        const {id} = this.context.router.getCurrentParams();
        const {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EntityActions.loadShowData(this.context.restful, this.context.configuration, this.getView(), id, sortField, sortDir);
    }

    render() {
        if (!this.isValidEntityAndView) {
            return <NotFoundView/>;
        }

        if (!this.state.hasOwnProperty('data')) {
            return null;
        }

        if (this.state.data.get('resourceNotFound')) {
            return <NotFoundView/>;
        }

        const entityName = this.context.router.getCurrentParams().entity;
        const view = this.getView(entityName);
        const dataStore = this.state.data.getIn(['dataStore', 'object']);
        const entry = dataStore.getFirstEntry(view.getEntity().uniqueId);
        const actions = List(view.actions() || ['list', 'edit', 'delete']);

        if (!entry) {
            return null;
        }

        return (
            <div className="view show-view">
                <ViewActions entityName={view.entity.name()} entry={entry} buttons={actions} />

                <div className="page-header">
                    <h1><Compile>{view.title() || Inflector.singularize(entityName) + ' detail'}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <div className="row form-horizontal" id="show-view">
                    { view.getFields().map((field, i) => (
                        <div className="col-lg-12 form-group" key={i}>
                            <label className="col-sm-2 control-label">{ field.label() }</label>

                            <div className={'show-value react-admin-field-' + field.name() + ' ' + (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7')}>
                                <Column field={field} entity={view.getEntity()} entry={entry} dataStore={dataStore} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

ShowView.contextTypes = {
    router: React.PropTypes.func.isRequired,
    restful: React.PropTypes.func.isRequired,
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('ShowView', ShowView);

export default ShowView;
