jest.autoMockOff();
jest.setMock('react-router', { Link: require('../../../Component/Button/__mocks__/Link') });

describe('MenuItem', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const MenuItem = require('../MenuItem');
    const routerWrapper = require('../../../Test/RouterWrapper');

    function getMenuItem(menu) {
        return routerWrapper(() => {
            return <MenuItem menu={menu} />;
        });
    }

    function getMenu(title, link, children = [], icon = null, isActive = false, isChildActive = false) {
        const uuid =  Math.random();

        return {
            uuid: uuid,
            title: () => title,
            isActive: () => isActive,
            isChildActive: () => isChildActive,
            link: () => link,
            icon: () => icon,
            hasChild: () => !!children.length,
            children: () => children
        };
    }

    describe('With simple menu without child', () => {
        it('Should display desired menu', () => {
            let menu = getMenu('Post', '/posts/list', [], null, true);
            let menuItem = getMenuItem(menu);
            menuItem = React.findDOMNode(menuItem);

            let link = menuItem.querySelector('a');
            let icons = menuItem.querySelectorAll('.glyphicon-list');
            TestUtils.Simulate.click(link);

            expect(icons.length).toEqual(1);
            expect(menuItem.className).toContain('active');
            expect(link.attributes['data-click-to'].value).toEqual('/posts/list');
            expect(link.innerHTML).toContain('Post');
        });
    });

    describe('With simple menu with children', () => {
        it('Should display desired buttons', () => {
            let child1 = getMenu('Post', '/posts/list', [], null, true);
            let child2 = getMenu('Comment', '/posts/list', [], null, false);
            let menu = getMenu('Blog', null, [child1, child2], null, false, true);
            let menuItem = getMenuItem(menu);
            menuItem = React.findDOMNode(menuItem);

            let arrow = menuItem.querySelector('.arrow');
            let childrenContainer = menuItem.querySelector('.nav-second-level');
            let childNodes = menuItem.querySelectorAll('ul li');

            expect(arrow.className).toContain('glyphicon-menu-down');
            expect(childrenContainer).toBeTruthy();

            expect(childNodes[0].innerHTML).toContain('Post');
            expect(childNodes[1].innerHTML).toContain('Comment');
        });
    });
});
