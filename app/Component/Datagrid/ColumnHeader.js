import React from 'react';
import {Link} from 'react-router';

class ColumnHeader extends React.Component {
    render() {
        let params = this.context.router.getCurrentParams();
        let routes = this.context.router.getCurrentRoutes();
        let currentQuery = this.context.router.getCurrentQuery();
        let route = routes[routes.length - 1];
        let {sort, fieldName, name, label} = this.props;

        let query = {
            sortField: name + '.' + fieldName,
            sortDir: sort === 'ASC' ? 'DESC' : 'ASC'
        };

        if (currentQuery.page) {
            query.page = currentQuery.page;
        }

        if (sort) {
            sort = <span className={'sorted sorted-' + sort.toLowerCase()}></span>
        }

        return (
            <th className={'react-admin-column-' + fieldName} key={fieldName}>
                <Link to={route.name} params={params} query={query}>
                    {sort}
                    {label}
                </Link>
            </th>
        );
    }
}

ColumnHeader.propTypes = {
    configuration: React.PropTypes.object,
    fieldName: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    sort: React.PropTypes.string,
    name: React.PropTypes.string
};

ColumnHeader.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default ColumnHeader;
