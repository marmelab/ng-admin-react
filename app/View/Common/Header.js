import React from 'react';
import {Link} from 'react-router';

class Header extends React.Component {
    render() {
        return (
            <header className="header">
                <h1>
                    <Link to="dashboard">{this.props.title}</Link>
                </h1>
            </header>
        )
    }
}

export default Header;
