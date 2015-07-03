jest.autoMockOff();

describe('MaDatagridPagination', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const MaDatagridPagination = require('../MaDatagridPagination');

    let pages = [];
    const onChange = page => {
        pages.push(page);
    };

    function getPagination(items, page, perPage) {
        return TestUtils.renderIntoDocument(<MaDatagridPagination totalItems={items} onChange={onChange} page={page} perPage={perPage} />);
    }

    describe('Without items', () => {
        it('Should display "No record found"', () => {
            let pagination = getPagination(0, 1, 10);
            pagination = React.findDOMNode(pagination);

            expect(pagination.innerHTML).toContain('No record found.');
        });

        it('Should not display a pagination', () => {
            const pagination = getPagination(0, 1, 10);
            const paginationElement = React.findDOMNode(pagination).querySelectorAll('.pagination');

            expect(paginationElement.length).toEqual(0);
        });
    });

    describe('Without less item than perPage', () => {
        it('Should display record number', () => {
            let pagination = getPagination(10, 1, 10);
            pagination = React.findDOMNode(pagination);

            expect(pagination.textContent).toContain('1 - 10 on 10');
        });

        it('Should not display a pagination', () => {
            const pagination = getPagination(10, 1, 10);
            const paginationElement = React.findDOMNode(pagination).querySelectorAll('.pagination');

            expect(paginationElement.length).toEqual(0);
        });
    });

    describe('On page 2', () => {
        it('Should display record number', () => {
            let pagination = getPagination(30, 2, 10);
            pagination = React.findDOMNode(pagination);

            expect(pagination.textContent).toContain('11 - 20 on 30');
        });

        it('Should display a pagination', () => {
            const pagination = getPagination(30, 2, 10);
            const paginationElements = React.findDOMNode(pagination).querySelectorAll('.pagination li');

            expect(paginationElements[0].textContent).toEqual('« Prev');
            expect(paginationElements[1].textContent).toEqual('1');
            expect(paginationElements[2].textContent).toEqual('2');
            expect(paginationElements[3].textContent).toEqual('3');
            expect(paginationElements[4].textContent).toEqual('Next »');
        });
    });

    describe('pagination link', () => {
        it('Should call onChange callback', () => {
            const pagination = getPagination(56, 2, 10);
            const nextPage = React.findDOMNode(pagination).querySelector('a.next');

            TestUtils.Simulate.click(nextPage);

            expect(pages).toEqual([3]);
        });
    });
});
