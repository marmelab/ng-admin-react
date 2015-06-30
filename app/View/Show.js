import React from 'react';
import Inflector from 'inflected';
import { shouldComponentUpdate } from 'react-immutable-render-mixin';

import Notification from '../Services/Notification';
import NotFoundView from './NotFound';

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
        this.boundedOnChange = this.onChange.bind(this);
        EntityStore.addChangeListener(this.boundedOnChange);

        this.boundedOnFailure = this.onLoadFailure.bind(this);
        EntityStore.addFailureListener(this.boundedOnFailure);

        this.refreshData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id ||
            nextProps.query.sortField !== this.props.query.sortField ||
            nextProps.query.sortDir !== this.props.query.sortDir) {

            if (this.hasEntityAndView(nextProps.params.entity)) {
                this.refreshData();
            }
        }
    }

    componentWillUnmount() {
        EntityStore.removeChangeListener(this.boundedOnChange);
        EntityStore.removeFailureListener(this.boundedOnFailure);
    }

    hasEntityAndView(entityName) {
        try {
            this.getView(entityName);

            return true;
        } catch (e) {
            return false;
        }
    }

    getView(entityName) {
        entityName = entityName || this.context.router.getCurrentParams().entity;

        return this.props.configuration.getEntity(entityName).showView();
    }

    onChange() {
        this.setState(EntityStore.getState());
    }

    refreshData() {
        const {id} = this.context.router.getCurrentParams();
        const {sortField, sortDir} = this.context.router.getCurrentQuery() || {};

        EntityActions.loadShowData(this.context.restful, this.props.configuration, this.getView(), id, sortField, sortDir);
    }

    onLoadFailure(response) {
        let body = response.data;
        if ('object' === typeof message) {
            body = JSON.stringify(body);
        }

        Notification.log(`Oops, an error occured during data fetching : (code: ${response.status}) ${body}`,
            {addnCls: 'humane-flatty-error'});
    }

    render() {
        const entityName = this.context.router.getCurrentParams().entity;
        if (!this.hasEntityAndView(entityName)) {
            return <NotFoundView/>;
        }

        if (!this.state) {
            return null;
        }

        const view = this.getView();
        const dataStore = this.state.data.getIn(['dataStore', 'object']);
        const entry = dataStore.getFirstEntry(view.getEntity().uniqueId);
        const actions = view.actions() || ['list', 'edit', 'delete'];

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
                                <Column field={field} entity={view.getEntity()} entry={entry} dataStore={dataStore}
                                        configuration={this.props.configuration} />
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
    restful: React.PropTypes.func.isRequired
};
ShowView.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

require('../autoloader')('ShowView', ShowView);

export default ShowView;
