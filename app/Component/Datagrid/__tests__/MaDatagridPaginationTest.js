jest.dontMock('../MaDatagridPagination');
jest.dontMock('../../../Test/RouterWrapper');

var React = require('react/addons');
var MaDatagridPagination = require('../MaDatagridPagination');
var routerWrapper = require('../../../Test/RouterWrapper');

function getPagination(items, page, perPage) {
    return routerWrapper(function() {
        return <MaDatagridPagination totalItems={items} entity={null} page={page} perPage={perPage} />
    });
}

describe('MaDatagridPagination', function() {

    describe('Without items', () => {
        it('Should display "No record found"', () => {
            var pagination = getPagination(0, 1, 10);

            pagination = React.findDOMNode(pagination);

            expect(pagination.innerHTML).toContain('No record found.');
        });

        it('Should not display a pagination', () => {
            var pagination = getPagination(0, 1, 10);
            var paginationElement = React.findDOMNode(pagination).querySelectorAll('.pagination');

            expect(paginationElement.length).toEqual(0);
        });
    });

    describe('Without less item than perPage', () => {
        it.only('Should display record number', () => {
            var pagination = getPagination(10, 1, 10);
            pagination = React.findDOMNode(pagination);

            expect(pagination.textContent).toContain('1 - 10 on 10');
        });

        it('Should not display a pagination', () => {
            var pagination = getPagination(10, 1, 10);
            var paginationElement = React.findDOMNode(pagination).querySelectorAll('.pagination');

            expect(paginationElement.length).toEqual(0);
        });
    });

    describe('On page 2', () => {
        it('Should display record number', () => {
            var pagination = getPagination(30, 2, 10);
            pagination = React.findDOMNode(pagination);

            expect(pagination.textContent).toContain('11 - 20 on 30');
        });

        it.only('Should display a pagination', () => {
            var pagination = getPagination(30, 2, 10);
            var paginationElements = React.findDOMNode(pagination).querySelectorAll('.pagination li');

            expect(paginationElements[0].textContent).toEqual('« Prev');
            expect(paginationElements[1].textContent).toEqual('1');
            expect(paginationElements[2].textContent).toEqual('2');
            expect(paginationElements[3].textContent).toEqual('3');
            expect(paginationElements[4].textContent).toEqual('Next »');
        });
    });
});
