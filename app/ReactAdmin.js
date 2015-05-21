import React from 'react';
import Router from 'react-router';

import AdminBootstrap from './AdminBootstrap';
import DashboardView from './View/Dashboard';
import ListView from './View/List';
import ConfigurationFactory from 'admin-config/lib/Factory';

var routes = (
    <Router.Route name="react-admin" path="/" handler={AdminBootstrap}>
        <Router.DefaultRoute name="dashboard" handler={DashboardView}/>
        <Router.Route name="list" path="/list/:entity" handler={ListView}/>
    </Router.Route>
);

class ReactAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { handler: null };
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
        if(!this.state.handler) return null;

        var Handler = this.state.handler;
        return <Handler configuration={this.props.configuration}/>;
    }
}

ReactAdmin.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

// Exports classes that can be used by ES5 files
global.ConfigurationFactory = ConfigurationFactory;

export default ReactAdmin;
