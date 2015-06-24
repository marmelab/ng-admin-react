var React = require('react');
var ReactRouter = require('react-router');
var ReactAdmin = require('./build/react-admin-standalone.min');
console.log(ReactAdmin);

function configureApp(nga, fieldViewConfiguration, components, routes, restful, autoload) {
    var admin = nga.application('rest-admin backend demo') // application main title
        .baseApiUrl('http://localhost:3000/'); // main API endpoint

    return admin;
}

React.render(<ReactAdmin configureApp={configureApp} />, document.getElementById('my-app'));
