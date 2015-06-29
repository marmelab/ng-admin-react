import React from 'react';
import {Link} from 'react-router';

class MenuItem extends React.Component {
    componentDidMount() {
        this.setState({
            openMenus: []
        });
    }

    isOpen(menu) {
        const path = window.location.pathname;

        return menu.isChildActive(path) || this.state.openMenus.indexOf(menu) !== -1;
    }

    toggleChildren(e) {
        e.preventDefault();

        const menu = this.props.menu;
        const path = window.location.pathname;
        const openMenus = this.state.openMenus;

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

        const menu = this.props.menu;
        const link = menu.link();
        const hasChild = menu.hasChild();
        const path = window.location.pathname;
        let className = 'entities-repeat' + (menu.isActive(path) ? ' active' : '');
        let content;
        let childrenContainer;
        const icon = menu.icon()
                ? <span className="icon" dangerouslySetInnerHTML={{__html: menu.icon() }}></span>
                : <span className="glyphicon glyphicon-list"></span>;
        const arrowClass = 'glyphicon arrow ' + (this.isOpen(menu) ? 'glyphicon-menu-down' : 'glyphicon-menu-right');
        const arrow = hasChild ? <span className={arrowClass}></span> : null;

        // Children
        if (hasChild) {
            const containerClass = 'nav nav-second-level collapsible ' + (!this.isOpen(menu) ? 'collapsed' : '');
            const children = menu.children();
            let childrenElements = [];
            let child;

            for (let i in children) {
                child = children[i];
                childrenElements.push(<MenuItem key={child.uuid} menu={child} />);
            }

            childrenContainer = (
                <ul className={containerClass}>
                    {childrenElements}
                </ul>
            );
        }

        // No link provided
        if (!link) {
            content = (
                <a href="#" onClick={this.toggleChildren.bind(this)}>
                    { icon }
                    &nbsp;{ menu.title() }
                    {arrow}
                </a>
            );
        } else {
            content = (
                <Link to={link}>
                    { icon }
                    { menu.title() }
                    {arrow}
                </Link>
            );
        }

        return (
            <li className={className}>
                {content}

                {childrenContainer}
            </li>
        );
    }
}

MenuItem.propTypes = {
    menu: React.PropTypes.object.isRequired
};

require('../../autoloader')('MenuItem', MenuItem);

export default MenuItem;
