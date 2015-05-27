jest.autoMockOff();
jest.dontMock('../MaDatagridPagination');
jest.dontMock('../../../Test/RouterWrapper');
jest.setMock('react-router', {Link : require('../../Button/__mocks__/Link')});

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var MaDatagridPagination = require('../MaDatagridPagination');
var routerWrapper = require('../../../Test/RouterWrapper');

function getPagination(items, page, perPage, entity) {
    entity = entity || null;

    return routerWrapper(() => {
        return <MaDatagridPagination totalItems={items} entity={entity} page={page} perPage={perPage} />
    });
}

describe('MaDatagridPagination', () => {

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
        it('Should display record number', () => {
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

        it('Should display a pagination', () => {
            var pagination = getPagination(30, 2, 10);
            var paginationElements = React.findDOMNode(pagination).querySelectorAll('.pagination li');

            expect(paginationElements[0].textContent).toEqual('« Prev');
            expect(paginationElements[1].textContent).toEqual('1');
            expect(paginationElements[2].textContent).toEqual('2');
            expect(paginationElements[3].textContent).toEqual('3');
            expect(paginationElements[4].textContent).toEqual('Next »');
        });
    });

    describe('pagination link', () => {
        it('Should change url parameters', () => {
            var entity = {
                name: 'MyEntity'
            };

            var pagination = getPagination(56, 2, 10, entity);
            var nextPage = React.findDOMNode(pagination).querySelector('a.next');

            TestUtils.Simulate.click(nextPage);

            var params = JSON.parse(nextPage.attributes['data-params'].value);
            var query = JSON.parse(nextPage.attributes['data-query'].value);

            expect(params.entity.name).toEqual('MyEntity');
            expect(query.page).toEqual(3);
        });
    });
});
