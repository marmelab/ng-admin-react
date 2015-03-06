import React from 'react';
import MenuItem from './MenuItem.js';

class Sidebar extends React.Component {
    render() {
        var menuViews = this.props.menuViews
            .sort((a, b) => (b.order() < a.order()))
            .map(v => <MenuItem menuView={v} />);

        return (
            <aside className="sidebar">
                <nav>
                    <ul>{menuViews}</ul>
                </nav>
            </aside>
        )
    }
}

export default Sidebar;
