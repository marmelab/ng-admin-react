import React from 'react';
import {Link} from 'react-router';

class MenuItem extends React.Component {
    render() {
        var view = this.props.menuView;
        return (
            <li>
                <Link to="list" params={{entity: view.entity.name()}}>
                    <span className="icon" dangerouslySetInnerHTML={{__html: view.icon() }}></span>
                    { view.title() || view.entity.label() }
                </Link>
            </li>
        );
    }
}

export default MenuItem;
