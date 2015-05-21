import React from 'react';

class MaDatagridPagination extends React.Component {
    componentDidMount() {
        let params = this.context.router.getCurrentParams();
        let page = params.page || 1;
        let perPage = this.props.perPage || 1;
        let nbPages =  Math.ceil(this.props.totalItems / perPage) || 1;
        let offsetEnd = Math.min(page * perPage, totalItems);
        let offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd);
        let displayPagination = perPage < totalItems;

        this.setState({
            offsetBegin: offsetBegin,
            offsetEnd: offsetEnd,
            nbPages: nbPages,
            displayPagination: displayPagination
        })
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
        let totalItems = this.props.totalItems;
        let page = this.props.page;
        let itemCount = null;
        let pagination = null;

        if (totalItems > 0) {
            itemCount = <div class="total">
                <strong>{ this.state.offsetBegin }</strong> - <strong>{ this.state.offsetEnd }</strong> on <strong>{ totalItems }</strong>
            </div>
        } else {
            itemCount = <div class="total no-record">
                <strong>No record found.</strong>
            </div>
        }

        if (this.state.displayPagination) {
            let prev = null;
            let next = null;
            let items = [];

            if (this.state.page != 1) {
                prev = <li><a href onClick="this.setPage(this.state.page - 1)">« Prev</a></li>
            }

            if (this.state.page != this.state.nbPages) {
                next = <li><a href onClick="this.setPage(this.state.page + 1)">Next »</a></li>
            }

            for (var i in this.range(this.state.page)) {
                let className = i == page ? 'active' : '';

                if (i == '.') {
                    items.push(<li className={className}><span>&hellip;</span></li>)
                } else {
                    items.push(<li className={className}><span  onClick="set.setPage(i)">{i}</span></li>)
                }
            }

            pagination = <ul class="pagination pagination-sm pull-right" role="group" aria-label="pagination">
                {prev}
                {next}
            </ul>
        }

        return (
            <nav class="pagination-bar">
                {itemCount}

                {pagination}
            </nav>
        );
    }
}

MaDatagridPagination.propTypes = {
    totalItems: React.PropTypes.number.isRequired,
    perPage: React.PropTypes.number.isRequired,
    offsetBegin: React.PropTypes.number.offsetBegin,
    offsetEnd: React.PropTypes.number.isRequired
};

export default MaDatagridPagination;
