jest.autoMockOff();
jest.dontMock('../Compile');

var Link = require('../Button/__mocks__/Link');
jest.setMock('react-router', {Link : Link});

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Compile = require('../Compile');
var routerWrapper = require('../../Test/RouterWrapper');

function getCompiledLinkFromString(strElement) {
    return routerWrapper(() => <Compile>{strElement}</Compile>);
}

function getCompiledLink(to, params) {
    return routerWrapper(() => <Compile><Link to={to} params={params}></Link></Compile>);
}

describe('Compile', () => {
    describe('With simple string', () => {
        it('Should wrap text inside a span', () => {
            var compiled = TestUtils.renderIntoDocument(<Compile>Hello</Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.querySelector('span').innerHTML).toEqual('Hello');
        });

        it('Should wrap react text inside when a root tag exists', () => {
            var compiled = TestUtils.renderIntoDocument(<Compile>{'My text'}</Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.querySelector('span').innerHTML).toEqual('My text');
        });

        it('Should not wrap text inside when a jsx root tag exists', () => {
            var compiled = TestUtils.renderIntoDocument(<Compile><p>My text</p></Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.innerHTML).toEqual('My text');
        });

        it('Should not wrap text inside when a root tag exists', () => {
            var compiled = TestUtils.renderIntoDocument(<Compile>{'<p>My text</p>'}</Compile>);
            compiled = React.findDOMNode(compiled);

            // <p /> is not wrapper by Compile, but React wrap the text
            expect(compiled.querySelector('span').innerHTML).toContain('My text');
        });
    });

    describe('With context', () => {
        it('Should be able to use context with jsx', () => {
            var entry = {id: 42};
            var compiled = TestUtils.renderIntoDocument(<Compile entry={entry}>I'm entry {entry.id}</Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.querySelector('span').innerHTML).toEqual('I\'m entry 42');
        });

        it('Should be able to use context with a string', () => {
            var entry = {id: 42};
            var compiled = TestUtils.renderIntoDocument(<Compile entry={entry}>{"I\'m entry {entry.id}"}</Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.childNodes[0].innerHTML).toEqual('I\'m entry ');
            expect(compiled.childNodes[1].innerHTML).toEqual('42');
        });
    });

    describe('With external component', () => {
        it('Should be able to use Link component from string', () => {
            var compiled = getCompiledLinkFromString('<Link to={"create"} params={{entity: "posts"}} />');
            compiled = React.findDOMNode(compiled);

            TestUtils.Simulate.click(compiled);

            expect(compiled.attributes['data-click-to'].value).toEqual('create');
            var params = JSON.parse(compiled.attributes['data-params'].value);
            expect(params.entity).toEqual('posts');
        });

        it('Should be able to use another component from string', () => {
            var compiled = getCompiledLinkFromString('<MaCreateButton entityName={"tags"} />');
            compiled = React.findDOMNode(compiled);

            TestUtils.Simulate.click(compiled);

            expect(compiled.attributes['data-click-to'].value).toEqual('create');
            var params = JSON.parse(compiled.attributes['data-params'].value);
            expect(params.entity).toEqual('tags');
        });

        it('Should be able to use another component from jsx', () => {
            var compiled = getCompiledLink('create', {entity: 'posts'});
            compiled = React.findDOMNode(compiled);

            TestUtils.Simulate.click(compiled);

            expect(compiled.attributes['data-click-to'].value).toEqual('create');
            var params = JSON.parse(compiled.attributes['data-params'].value);
            expect(params.entity).toEqual('posts');
        });
    });
});
