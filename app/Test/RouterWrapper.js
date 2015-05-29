var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var MaDatagridPagination = require('../Component/Datagrid/MaDatagridPagination');

// Mock router
// @see https://github.com/rackt/react-router/blob/master/docs/guides/testing.md
function RouterStub() { };
RouterStub.makePath = () => { };
RouterStub.makeHref = () => { };
RouterStub.isActive = () => { };
RouterStub.getCurrentParams = () => ({ });
RouterStub.getCurrentQuery = () => ({ });
RouterStub.getCurrentRoutes = () => ([{name: 'my-route'}]);

function wrapComponent(cb) {
    var TestWrapper = React.createClass({
        childContextTypes: {
            router: React.PropTypes.func
        },

        getChildContext () {
            return {
                router: RouterStub
            };
        },

        render () {
            return cb();
        }
    });

    return TestUtils.renderIntoDocument(
        <TestWrapper />
    );
}

export default wrapComponent;
