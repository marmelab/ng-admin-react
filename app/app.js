import React from 'react';
import Router from 'react-router';

import flux from './flux';

import ReactAdmin from './ReactAdmin';
import DashboardView from './View/Dashboard';
import ListView from './View/List';

var configuration = require('./config');

var routes = (
    <Router.Route name="react-admin" path="/" handler={ReactAdmin}>
        <Router.DefaultRoute name="dashboard" handler={DashboardView}/>
        <Router.Route name="list" path="/list/:entity" handler={ListView}/>
    </Router.Route>
);

Router.run(routes, function(ReactAdmin) {
    React.render(<ReactAdmin configuration={configuration} flux={flux}/>, document.body);
});
