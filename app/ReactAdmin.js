import React from 'react';
import {RouteHandler} from 'react-router';

import Header from "./View/Common/Header";
import Sidebar from "./View/Common/Sidebar";

require('../styles/app.scss');

class ReactAdmin extends React.Component {
    render() {
        return (
            <div>
                <Header title={this.props.configuration.title()}/>
                <Sidebar menuViews={this.props.configuration.getViewsOfType("MenuView")}/>
                <div className="view-wrapper">
                    <RouteHandler configuration={this.props.configuration}/>
                </div>
            </div>
        );
    }
}

ReactAdmin.propTypes = {
    configuration: React.PropTypes.object.isRequired
}

export default ReactAdmin;
