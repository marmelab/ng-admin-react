const React = require('react/addons');
const RouterStub = require('./RouterStub');
const ComponentWrapper = require('./ComponentWrapper');

function wrapComponent(cb) {
    const childContextTypes = {
        router: React.PropTypes.func
    };
    const childContext = {
        router: RouterStub
    };

    return ComponentWrapper(childContextTypes, childContext, cb);
}

export default wrapComponent;
