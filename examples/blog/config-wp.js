var ReactAdmin = require('./build/react-admin-standalone.min');

function configureApp(nga, fieldViewConfiguration, components, routes, restful, autoload) {
    var admin = nga.application('rest-admin backend demo') // application main title
        .baseApiUrl('http://localhost:3000/'); // main API endpoint

    return admin;
}

class MyApp extends React.Component {
    render() {
        return <span>OK</span>;
    }
}
React.render(<MyApp />, document.getElementById('my-app'));
