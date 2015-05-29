import React from 'react';
import {Link} from 'react-router';

class ColumnHeader extends React.Component {
    render() {
        let params = this.context.router.getCurrentParams();
        let routes = this.context.router.getCurrentRoutes();
        let currentQuery = this.context.router.getCurrentQuery();
        let route = routes[routes.length - 1];
        let sort = null;

        if (this.props.sort) {
            sort = <span className={'sorted sorted-' + this.props.sort.toLowerCase()}></span>
        }

        let query = {
            sortField: this.props.name + '.' + this.props.fieldName,
            sortDir: this.props.sort === 'ASC' ? 'DESC' : 'ASC'
        };

        if (currentQuery.page) {
            query.page = currentQuery.page;
        }

        return (
            <th key={this.props.fieldName}>
                <Link to={route.name} params={params} query={query}>
                    {sort}
                    {this.props.label}
                </Link>
            </th>
        );
    }
}

ColumnHeader.propTypes = {
    configuration: React.PropTypes.object.isRequired,
    routeName: React.PropTypes.string.isRequired,
    actions: React.PropTypes.object.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    sort: React.PropTypes.string,
    name: React.PropTypes.string
};

ColumnHeader.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default ColumnHeader;
