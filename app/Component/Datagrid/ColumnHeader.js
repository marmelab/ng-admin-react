import React from 'react';

import DatagridActions from '../../Actions/DatagridActions';

class ColumnHeader extends React.Component {
    handleSort(e) {
        e.preventDefault();

        DatagridActions.sort({
            sortField: this.props.view.name() + "." + this.props.fieldName,
            sortDir: this.props.sort === 'ASC' ? 'DESC' : 'ASC',
            view: this.props.view
        });
    }

    render() {
        let sort = null;
        if (this.props.sort) {
            sort = <span className={"sorted sorted-" + this.props.sort.toLowerCase()}></span>
        }

        return (
            <th key={this.props.fieldName}>
                <a href="#" onClick={this.handleSort.bind(this)}>
                    {sort}
                    {this.props.label}
                </a>
            </th>
        );
    }
}

export default ColumnHeader;
