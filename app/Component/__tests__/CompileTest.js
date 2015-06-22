jest.autoMockOff();

const Link = require('../Button/__mocks__/Link');
jest.setMock('react-router', { Link : Link });

describe('Compile', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const Compile = require('../Compile');
    const routerWrapper = require('../../Test/RouterWrapper');
    const StringColumn = require('../Column/StringColumn');

    function getCompiledLinkFromString(strElement) {
        return routerWrapper(() => <Compile>{strElement}</Compile>);
    }

    function getCompiledLink(to, params) {
        return routerWrapper(() => <Compile><Link to={to} params={params}></Link></Compile>);
    }

    describe('With simple string', () => {
        it('Should wrap text inside a span', () => {
            let compiled = TestUtils.renderIntoDocument(<Compile>Hello</Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.querySelector('span').innerHTML).toEqual('Hello');
        });

        it('Should wrap react text inside when a root tag exists', () => {
            let compiled = TestUtils.renderIntoDocument(<Compile>{'My text'}</Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.querySelector('span').innerHTML).toEqual('My text');
        });

        it('Should not wrap text inside when a jsx root tag exists', () => {
            let compiled = TestUtils.renderIntoDocument(<Compile><p>My text</p></Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.innerHTML).toEqual('My text');
        });

        it('Should not wrap text inside when a root tag exists', () => {
            let compiled = TestUtils.renderIntoDocument(<Compile>{'<p>My text</p>'}</Compile>);
            compiled = React.findDOMNode(compiled);

            // <p /> is not wrapper by Compile, but React wrap the text
            expect(compiled.querySelector('span').innerHTML).toContain('My text');
        });
    });

    describe('With context', () => {
        it('Should be able to use context with jsx', () => {
            const entry = {id: 42};
            let compiled = TestUtils.renderIntoDocument(<Compile entry={entry}>I'm entry {entry.id}</Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.querySelector('span').innerHTML).toEqual('I\'m entry 42');
        });

        it('Should be able to use context with a string', () => {
            const entry = {id: 42};
            let compiled = TestUtils.renderIntoDocument(<Compile entry={entry}>{"I\'m entry {entry.id}"}</Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.childNodes[0].innerHTML).toEqual('I\'m entry ');
            expect(compiled.childNodes[1].innerHTML).toEqual('42');
        });
    });

    describe('With external component', () => {
        it('Should be able to use Link component from string', () => {
            let compiled = getCompiledLinkFromString('<Link to={"create"} params={{entity: "posts"}} />');
            compiled = React.findDOMNode(compiled);

            TestUtils.Simulate.click(compiled);

            expect(compiled.attributes['data-click-to'].value).toEqual('create');
            const params = JSON.parse(compiled.attributes['data-params'].value);
            expect(params.entity).toEqual('posts');
        });

        it('Should be able to use another component from string', () => {
            let compiled = getCompiledLinkFromString('<MaCreateButton entityName={"tags"} />');
            compiled = React.findDOMNode(compiled);

            TestUtils.Simulate.click(compiled);

            expect(compiled.attributes['data-click-to'].value).toEqual('create');
            const params = JSON.parse(compiled.attributes['data-params'].value);
            expect(params.entity).toEqual('tags');
        });

        it('Should be able to use another component from jsx', () => {
            let compiled = getCompiledLink('create', {entity: 'posts'});
            compiled = React.findDOMNode(compiled);

            TestUtils.Simulate.click(compiled);

            expect(compiled.attributes['data-click-to'].value).toEqual('create');
            const params = JSON.parse(compiled.attributes['data-params'].value);
            expect(params.entity).toEqual('posts');
        });
    });

    describe('Compile sub elements', () => {
        it('should compile any children', () => {
            const column = '<a onClick={this.props.detailAction}><StringColumn value={this.props.value} /></a>';
            let clicked = false;
            const detailAction = () => {
                clicked = true;
            };

            let compiled = TestUtils.renderIntoDocument(<Compile detailAction={detailAction} value={123}>{column}</Compile>);
            compiled = React.findDOMNode(compiled);

            TestUtils.Simulate.click(compiled);

            expect(compiled.querySelector('span').innerHTML).toEqual('123');
            expect(clicked).toBeTruthy();
        });

        it('should compile element returned from a function', () => {
            var column = function() {
                return <StringColumn value={this.props.value} />;
            };

            let compiled = TestUtils.renderIntoDocument(<Compile value={'bike'}>{column}</Compile>);
            compiled = React.findDOMNode(compiled);

            expect(compiled.innerHTML).toEqual('bike');
        })
    });
});
