const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

export default function ComponentWrapper(childContextTypes, childContext, cb) {
    const TestWrapper = React.createClass({
        childContextTypes: childContextTypes,

        getChildContext () {
            return childContext;
        },

        render () {
            return cb();
        }
    });

    return TestUtils.renderIntoDocument(
        <TestWrapper />
    );
}
