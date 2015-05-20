import React from 'react';

class ColumnHeader extends React.Component {
    handleSort(e) {
        e.preventDefault();

        this.props.actions.sort({
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

ColumnHeader.propTypes = {
    view: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    sort: React.PropTypes.string
}

export default ColumnHeader;
