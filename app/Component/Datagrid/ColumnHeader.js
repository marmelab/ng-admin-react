import React from 'react';

import DatagridActions from '../../Actions/DatagridActions';

class ColumnHeader extends React.Component {
    handleSort(e) {
        e.preventDefault();

        DatagridActions.sort({
            sortField: this.props.view.name() + '.' + this.props.fieldName,
            sortDir: this.props.sort === 'ASC' ? 'DESC' : 'ASC',
            configuration: this.props.configuration,
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

ColumnHeader.propTypes = {
    view: React.PropTypes.object.isRequired,
    configuration: React.PropTypes.object.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    sort: React.PropTypes.string
};

export default ColumnHeader;
