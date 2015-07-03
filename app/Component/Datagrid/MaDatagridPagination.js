import React from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

class MaDatagridPagination extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }

    onChange(page) {
        return () => { this.props.onChange(page); };
    }

    range(page, nbPages) {
        let input = [];

        // display page links around the current page
        if (page > 2) {
            input.push('1');
        }
        if (4 == page) {
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
        const totalItems = this.props.totalItems;
        const page = this.props.page || 1;
        const perPage = this.props.perPage || 1;
        const nbPages = Math.ceil(totalItems / perPage) || 1;
        const offsetEnd = Math.min(page * perPage, totalItems);
        const offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd);
        const displayPagination = perPage < totalItems;

        let itemCount = null;
        let pagination = null;

        if (totalItems > 0) {
            itemCount = (
                <div className="total">
                    <strong>{ offsetBegin }</strong> - <strong>{ offsetEnd }</strong> on <strong>{ totalItems }</strong>
                </div>
            );
        } else {
            itemCount = (
                <div className="total no-record">
                    <strong>No record found.</strong>
                </div>
            );
        }

        if (displayPagination) {
            let prev = <li></li>;
            let next = <li></li>;
            let items = [];

            if (page != 1) {
                prev = <li><a className="prev" onClick={this.onChange(page - 1)}>« Prev</a></li>;
            }

            if (page != nbPages) {
                next = <li><a className="next" onClick={this.onChange(page + 1)}>Next »</a></li>;
            }

            this.range(page, nbPages).map(i => {
                const className = i == page ? 'active' : '';

                if ('.' == i) {
                    items.push(<li key={i} className={className}><span>&hellip;</span></li>);
                } else {
                    items.push(<li key={i} className={className}><a to="list" onClick={this.onChange(i)}>{i}</a></li>);
                }
            });

            pagination = (
                <ul className="pagination pagination-sm pull-right" role="group" aria-label="pagination">
                    {prev}
                    {items}
                    {next}
                </ul>
            );
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
    perPage: React.PropTypes.number.isRequired,
    page: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
};

require('../../autoloader')('MaDatagridPagination', MaDatagridPagination);

export default MaDatagridPagination;
