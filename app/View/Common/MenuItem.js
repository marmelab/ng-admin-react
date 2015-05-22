import React from 'react';
import {Link} from 'react-router';

class MenuItem extends React.Component {
    render() {
        let menu = this.props.menu;
        let link = menu.link();
        let path = window.location.pathname;
        let className = 'entities-repeat' + (menu.isActive(path) ? ' active' : '');
        let icon = <span className="icon" dangerouslySetInnerHTML={{__html: menu.icon() || '' }}></span>;
        let content;

        // No link provided
        if (link === null) {
            content = <span>
                { icon }
                { menu.title() }
            </span>;
        } else {
            content = <Link to={link}>
                { icon }
                { menu.title() }
            </Link>
        }

        return (
            <li className={className}>
                {content}
            </li>
        );
    }
}

export default MenuItem;
