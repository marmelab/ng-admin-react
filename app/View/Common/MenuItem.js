import React from 'react';
import {Link} from 'react-router';

class MenuItem extends React.Component {
    componentDidMount() {
        this.setState({
            openMenus : []
        });
    }

    isOpen(menu) {
        let path = window.location.pathname;

        return menu.isChildActive(path) || this.state.openMenus.indexOf(menu) !== -1;
    }

    toggleChildren(e) {
        e.preventDefault();

        let menu = this.props.menu;
        let path = window.location.pathname;
        let openMenus = this.state.openMenus;

        if (openMenus.indexOf(menu) !== -1) {
            // menu is already open, the click closes it
            // except if a submenu is open
            if (menu.isChildActive(path)) {
                return;
            }

            openMenus.splice(openMenus.indexOf(menu), 1);
        } else {
            openMenus.push(menu);
        }

        this.setState({
            openMenus: openMenus
        });
    }

    render() {
        if (!this.state) {
            return null;
        }
        let menu = this.props.menu;
        let link = menu.link();
        let hasChild = menu.hasChild();
        let path = window.location.pathname;
        let className = 'entities-repeat' + (menu.isActive(path) ? ' active' : '');
        let content;
        let childrenContainer;
        let icon = menu.icon()
                ? <span className="icon" dangerouslySetInnerHTML={{__html: menu.icon() }}></span>
                : <span className="glyphicon glyphicon-list"></span>;
        let arrowClass = 'glyphicon arrow ' + (this.isOpen(menu) ? 'glyphicon-menu-down' : 'glyphicon-menu-right');
        let arrow = hasChild ? <span className={arrowClass}></span> : null;

        // Children
        if (menu.hasChild()) {
            let containerClass = 'nav nav-second-level collapsible ' + (!this.isOpen(menu) ? 'collapsed' : '');
            let children = menu.children();
            let childrenElements = [];

            for (let i in children) {
                childrenElements.push(<MenuItem menu={children[i]} />);
            }

            childrenContainer = <ul className={containerClass}>
                {childrenElements}
            </ul>
        }

        // No link provided
        if (link === null) {
            content = <a href="#" onClick={this.toggleChildren.bind(this)}>
                { icon }
                &nbsp;{ menu.title() }
                {arrow}
            </a>;
        } else {
            content = <Link to={link}>
                { icon }
                &nbsp;{ menu.title() }
                {arrow}
            </Link>
        }

        return (
            <li className={className}>
                {content}

                {childrenContainer}
            </li>
        );
    }
}

export default MenuItem;
