import React from 'react';

import Header from "./View/Common/Header";
import Sidebar from "./View/Common/Sidebar";

class ReactAdmin extends React.Component {
    render() {
        return (
            <div>
                <Header title={this.props.configuration.title}/>
                <Sidebar/>
                <h1>Content</h1>
            </div>
        );
    }
}

export default ReactAdmin;
