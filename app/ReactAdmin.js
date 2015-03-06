import React from 'react';

import Header from "./View/Common/Header";
import Sidebar from "./View/Common/Sidebar";

require('../styles/app.scss');

class ReactAdmin extends React.Component {
    render() {
        return (
            <div>
                <Header title={this.props.configuration.title}/>
                <Sidebar/>
                <div className="view-wrapper">
                    <h1>Dashboard</h1>
                </div>
            </div>
        );
    }
}

export default ReactAdmin;
