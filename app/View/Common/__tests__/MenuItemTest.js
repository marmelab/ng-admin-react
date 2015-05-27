jest.autoMockOff();
jest.setMock('react-router', {Link : require('../../../Component/Button/__mocks__/Link')});
jest.dontMock('../MenuItem');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var MenuItem = require('../MenuItem');
var routerWrapper = require('../../../Test/RouterWrapper');

function getMenuItem(menu) {
    return routerWrapper(() => {
        return <MenuItem menu={menu} />;
    });
}

function getMenu(title, link, children, icon, isActive, isChildActive) {
    children = children || [];

    return {
        title: () => title,
        isActive: () => isActive,
        isChildActive: () => isChildActive,
        link: () => link,
        icon: () => icon,
        hasChild: () => !!children.length,
        children: () => children
    }
}

describe('MenuItem', () => {

    describe('With simple menu without child', () => {
        it('Should display desired menu', () => {
            var menu = getMenu('Post', '/posts/list', [], null, true);
            var menuItem = getMenuItem(menu);
            menuItem = React.findDOMNode(menuItem);

            var link = menuItem.querySelector('a');
            var icons = menuItem.querySelectorAll('.glyphicon-list');
            TestUtils.Simulate.click(link);

            expect(icons.length).toEqual(1);
            expect(menuItem.className).toContain('active');
            expect(link.attributes['data-click-to'].value).toEqual('/posts/list');
            expect(link.innerHTML).toContain('Post');
        });
    });

    describe('With simple menu with children', () => {
        it('Should display desired buttons', () => {
            var child1 = getMenu('Post', '/posts/list', [], null, true);
            var child2 = getMenu('Comment', '/posts/list', [], null, false);
            var menu = getMenu('Blog', null, [child1, child2], null, false, true);
            var menuItem = getMenuItem(menu);
            menuItem = React.findDOMNode(menuItem);

            var arrow = menuItem.querySelector('.arrow');
            var childrenContainer = menuItem.querySelector('.nav-second-level');
            var childNodes = menuItem.querySelectorAll('ul li');

            expect(arrow.className).toContain('glyphicon-menu-down');
            expect(childrenContainer).toBeTruthy();

            expect(childNodes[0].innerHTML).toContain('Post');
            expect(childNodes[1].innerHTML).toContain('Comment');
        });
    });
});
