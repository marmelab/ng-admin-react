import React from 'react';

class ColumnHeader extends React.Component {
    onSort(sortDir) {
        const { name, fieldName } = this.props;

        return () => {
            this.props.onSort(`${name}.${fieldName}`, sortDir);
        };
    }

    render() {
        const { sort, fieldName, label, onSort } = this.props;
        let element = <span>{label}</span>;

        if (onSort) {
            let sortIcon = null;
            if (sort) {
                sortIcon = <span className={`sorted sorted-${sort.toLowerCase()}`}></span>;
            }
            const sortDir = 'ASC' === sort ? 'DESC' : 'ASC';

            element = <a onClick={this.onSort(sortDir)}>{sortIcon}{label}</a>;
        }

        return (
            <th className={`react-admin-column-${fieldName}`} key={fieldName}>
                {element}
            </th>
        );
    }
}

ColumnHeader.propTypes = {
    fieldName: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    sort: React.PropTypes.string,
    name: React.PropTypes.string,
    onSort: React.PropTypes.func
};

ColumnHeader.contextTypes = {
    router: React.PropTypes.func.isRequired
};

require('../../autoloader')('ColumnHeader', ColumnHeader);

export default ColumnHeader;
