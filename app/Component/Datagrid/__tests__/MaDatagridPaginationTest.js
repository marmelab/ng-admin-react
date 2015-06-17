jest.autoMockOff();
jest.dontMock('../MaDatagridPagination');
jest.dontMock('../../../Test/RouterWrapper');
jest.setMock('react-router', {Link : require('../../Button/__mocks__/Link')});

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;
const MaDatagridPagination = require('../MaDatagridPagination');
const routerWrapper = require('../../../Test/RouterWrapper');

function getPagination(items, page, perPage, entity = null) {
    return routerWrapper(() => {
        return <MaDatagridPagination totalItems={items} entity={entity} page={page} perPage={perPage} />
    });
}

describe('MaDatagridPagination', () => {

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
        it('Should change url parameters', () => {
            const entity = {
                name: 'MyEntity'
            };

            const pagination = getPagination(56, 2, 10, entity);
            const nextPage = React.findDOMNode(pagination).querySelector('a.next');

            TestUtils.Simulate.click(nextPage);

            const params = JSON.parse(nextPage.attributes['data-params'].value);
            const query = JSON.parse(nextPage.attributes['data-query'].value);

            expect(params.entity.name).toEqual('MyEntity');
            expect(query.page).toEqual(3);
        });
    });
});
