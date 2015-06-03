import React from 'react';
import {RouteHandler} from 'react-router';

import Header from "./View/Common/Header";
import Sidebar from "./View/Common/Sidebar";

require('../styles/app.scss');

class AdminBootstrap extends React.Component {
    render() {
        return (
            <div>
                <Header title={this.props.configuration.title()}/>
                <Sidebar menuViews={this.props.configuration.menu()}/>
                <div className="view-wrapper">
                    <RouteHandler configuration={this.props.configuration}/>
                </div>
            </div>
        );
    }
}

export default AdminBootstrap;
