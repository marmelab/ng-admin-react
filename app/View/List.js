import React from 'react';
import Router from 'react-router';

export default React.createClass({
    mixins: [Router.State],
    render() {
        return (
            <h1>List of {this.getParams().entity}</h1>
        )
    }
});
