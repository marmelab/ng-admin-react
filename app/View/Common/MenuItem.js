import React from 'react';

class MenuItem extends React.Component {
    render() {
        var view = this.props.menuView;
        return (
            <li>
                <a href="#">
                    <span className="icon" dangerouslySetInnerHTML={{__html: view.icon() }}></span>
                    { view.title() || view.entity.label() }
                </a>
            </li>
        );
    }
}

export default MenuItem;
