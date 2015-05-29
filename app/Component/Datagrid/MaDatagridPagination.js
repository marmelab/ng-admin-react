import React from 'react';
import {Link} from 'react-router';

class MaDatagridPagination extends React.Component {
    componentDidMount() {
        let totalItems = this.props.totalItems;
        let page = this.props.page || 1;
        let perPage = this.props.perPage || 1;
        let nbPages =  Math.ceil(totalItems / perPage) || 1;
        let offsetEnd = Math.min(page * perPage, totalItems);
        let offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd);
        let displayPagination = perPage < totalItems;

        this.setState({
            offsetBegin: offsetBegin,
            offsetEnd: offsetEnd,
            nbPages: nbPages,
            displayPagination: displayPagination,
            page: page
        });
    }

    range (page) {
        var input = [],
            nbPages = this.state.nbPages;

        // display page links around the current page
        if (page > 2) {
            input.push('1');
        }
        if (page == 4) {
            input.push('2');
        }
        if (page > 4) {
            input.push('.');
        }
        if (page > 1) {
            input.push(page - 1);
        }
        input.push(page);
        if (page < nbPages) {
            input.push(page + 1);
        }
        if (page == (nbPages - 3)) {
            input.push(nbPages - 1);
        }
        if (page < (nbPages - 3)) {
            input.push('.');
        }
        if (page < (nbPages - 1)) {
            input.push(nbPages);
        }

        return input;
    }

    render() {
        if (!this.state) {
            return null;
        }

        let totalItems = this.props.totalItems;
        let entity = this.props.entity;
        let page = +this.state.page;
        let itemCount = null;
        let pagination = null;

        if (totalItems > 0) {
            itemCount = <div className="total">
                <strong>{ this.state.offsetBegin }</strong> - <strong>{ this.state.offsetEnd }</strong> on <strong>{ totalItems }</strong>
            </div>
        } else {
            itemCount = <div className="total no-record">
                <strong>No record found.</strong>
            </div>
        }

        if (this.state.displayPagination) {
            let prev = null;
            let next = null;
            let items = [];
            let query = {
            };

            if (page != 1) {
                prev = <li><Link className="prev" to="list" params={{entity: entity}} query={{page: page - 1}}>« Prev</Link></li>
            }

            if (page != this.state.nbPages) {
                next = <li><Link className="next" to="list" params={{entity: entity}} query={{page: page + 1}}>Next »</Link></li>
            }

            this.range(page).map(i => {
                let className = i == page ? 'active' : '';

                if (i == '.') {
                    items.push(<li key={i} className={className}><span>&hellip;</span></li>)
                } else {
                    items.push(<li key={i} className={className}><Link to="list" params={{entity: entity}} query={{page: i}}>{i}</Link></li>)
                }
            });

            pagination = <ul className="pagination pagination-sm pull-right" role="group" aria-label="pagination">
                {prev}
                {items}
                {next}
            </ul>
        }

        return (
            <nav className="pagination-bar">
                {itemCount}

                {pagination}
            </nav>
        );
    }
}

MaDatagridPagination.propTypes = {
    totalItems: React.PropTypes.number.isRequired,
    perPage: React.PropTypes.number.isRequired
};

export default MaDatagridPagination;
