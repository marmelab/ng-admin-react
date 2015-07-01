import autoload from './autoloader';

import React from 'react';
import Router from 'react-router';
import Restful from 'restful.js';

import ConfigurationFactory from 'admin-config/lib/Factory';

import AdminBootstrap from './AdminBootstrap';

import DashboardView from './View/Dashboard';
import ListView from './View/List';
import ShowView from './View/Show';
import CreateView from './View/Create';
import EditView from './View/Edit';
import DeleteView from './View/Delete';
import NotFoundView from './View/NotFound';

import ViewActions from './Component/ViewActions';
import FieldViewConfiguration from './Field/FieldViewConfiguration';

import Pace from 'pace';

let routes = (
    <Router.Route name="react-admin" path="/" handler={AdminBootstrap}>
        <Router.DefaultRoute name="dashboard" handler={DashboardView}/>

        <Router.Route name="list" path="/:entity/list" handler={ListView}/>
        <Router.Route name="create" path="/:entity/create" handler={CreateView}/>
        <Router.Route name="edit" path="/:entity/edit/:id" handler={EditView}/>
        <Router.Route name="delete" path="/:entity/delete/:id" handler={DeleteView}/>
        <Router.Route name="show" path="/:entity/show/:id" handler={ShowView}/>

        <Router.NotFoundRoute handler={NotFoundView}/>
    </Router.Route>
);

class ReactAdmin extends React.Component {
    constructor(props, context) {
        super(props, context);

        const restful = Restful();
        const components = {
            ViewActions: ViewActions
        };
        const configuration = props.configureApp(
            new ConfigurationFactory(),
            FieldViewConfiguration,
            components,
            routes,
            restful,
            autoload
        );

        this.loaded = false;

        Router.run(routes, (Handler) => {
            if (this.loaded) {
                this.setState({
                    handler: Handler
                });
            }

            this.state = {
                handler: Handler,
                configuration: configuration,
                restful: restful
            };
            this.loaded = true;
        });
    }

    getChildContext() {
        return {
            restful: this.state.restful
        };
    }

    componentDidUpdate() {
        // stop progress bar
        Pace.stop();
    }

    render() {
        // start progress bar
        Pace.start();

        const Handler = this.state.handler;

        return <Handler configuration={this.state.configuration}/>;
    }
}

ReactAdmin.childContextTypes = {
    restful: React.PropTypes.func.isRequired
};

ReactAdmin.propTypes = {
    configureApp: React.PropTypes.func.isRequired
};

export default ReactAdmin;
