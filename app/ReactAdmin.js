import React from 'react';
import Router from 'react-router';

import AdminBootstrap from './AdminBootstrap';
import DashboardView from './View/Dashboard';
import ListView from './View/List';
import ShowView from './View/Show';
import CreateView from './View/Create';
import EditView from './View/Edit';
import DeleteView from './View/Delete';
import ConfigurationFactory from 'admin-config/lib/Factory';

import Pace from 'pace';

let routes = (
    <Router.Route name="react-admin" path="/" handler={AdminBootstrap}>
        <Router.DefaultRoute name="dashboard" handler={DashboardView}/>

        <Router.Route name="list" path="/:entity" handler={ListView}/>
        <Router.Route name="create" path="/:entity/create" handler={CreateView}/>
        <Router.Route name="edit" path="/:entity/edit/:id" handler={EditView}/>
        <Router.Route name="delete" path="/:entity/delete/:id" handler={DeleteView}/>
        <Router.Route name="show" path="/:entity/:id" handler={ShowView}/>
    </Router.Route>
);

class ReactAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { handler: null, factory: ConfigurationFactory};
    }
    componentDidUpdate() {
        // stop progress bar
        Pace.stop();
    }

    componentDidMount() {
        Router.run(routes, this.handleNavigation.bind(this));
    }
    handleNavigation(Handler) {
        this.setState({
            handler: Handler
        });
    }
    render() {
        if(!this.state.handler || !this.props.configuration) return null;

        // start progress bar
        Pace.start();

        var Handler = this.state.handler;
        return <Handler configuration={this.props.configuration}/>;
    }
}

ReactAdmin.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default ReactAdmin;
