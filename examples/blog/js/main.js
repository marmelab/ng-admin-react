var React = require('react');
var ReactRouter = require('react-router');
var ReactAdmin = require('../build/react-admin-standalone.min');

function truncate(value) {
    if (!value) {
        return '';
    }

    return value.length > 50 ? value.substr(0, 50) + '...' : value;
}

function configureApp(nga, fieldViewConfiguration, components, routes, restful, autoload) {

    require('./api_flavor').init(restful);

    // Add custom component
    var SendEmail = React.createClass({
        render: function () {
            return <a className='btn btn-default' href='#/stats'>Show stats</a>;
        }
    });
    autoload('SendEmail', SendEmail);

    var admin = nga.application('rest-admin backend demo') // application main title
        .baseApiUrl('http://localhost:3000/'); // main API endpoint

    // create da entities
    admin
        .addEntity(nga.entity('tags'))
        .addEntity(nga.entity('comments'))
        .addEntity(nga.entity('posts'));
    // init them
    var tag = require('./entities/tag')(nga, admin);
    var comment = require('./entities/comment')(nga, admin, truncate);
    var post = require('./entities/post')(nga, admin, truncate);

    // customize menu
    admin.menu(require('./menu')(nga, admin));

    // Add custom route
    var ViewActions = components.ViewActions;
    var Route = ReactRouter.Route;
    var Stats = React.createClass({
        render: function () {
            return <div>
                <ViewActions buttons={['back']} />
                <h1>Stats</h1>
                <p className='lead'>You can add custom pages, too</p>
            </div>;
        }
    });

    routes.props.children.push(<Route name="stats" path="/stats" handler={Stats} />);

    return admin;
}

React.render(
  <ReactAdmin configureApp={configureApp} />,
  document.getElementById('my-app')
);
