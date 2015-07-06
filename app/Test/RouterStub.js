// Mock router
// @see https://github.com/rackt/react-router/blob/master/docs/guides/testing.md

function RouterStub() {}

RouterStub.makePath = () => { };
RouterStub.makeHref = () => { };
RouterStub.isActive = () => { };
RouterStub.getCurrentParams = () => ({ });
RouterStub.getCurrentQuery = () => ({ });
RouterStub.getCurrentRoutes = () => ([{name: 'my-route'}]);
RouterStub.transitionTo = () => { };

export default RouterStub;
