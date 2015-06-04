jest.autoMockOff();
jest.dontMock('../Compile');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Compile = require('../Compile');

describe('Compile', () => {
    describe('changePropsScope', () => {
        it('Should replace simple react braces', () => {
            let compile = new Compile();
            let result = compile.changePropsScope('<p>{entry.id}</p>');

            expect(result).toEqual('<p>{this.entry.id}</p>');
        });

        it('Should not replace simple react braces when this is present', () => {
            let compile = new Compile();
            let result = compile.changePropsScope('<p>{this.entry.id}</p>');

            expect(result).toEqual('<p>{this.entry.id}</p>');
        });

        it('Should not replace single brace', () => {
            let compile = new Compile();
            let result = compile.changePropsScope('<p>test {</p>');

            expect(result).toEqual('<p>test {</p>');
        });

        it('Should not replace escaped braces', () => {
            let compile = new Compile();
            let result = compile.changePropsScope('<p>test \\{escaped\\}</p>');

            expect(result).toEqual('<p>test {escaped}</p>');
        });

        it('Should not replace multipe braces', () => {
            let compile = new Compile();
            let result = compile.changePropsScope('<p>test {entry.id} \\{not me\\} {me}</p>');

            expect(result).toEqual('<p>test {this.entry.id} {not me} {this.me}</p>');
        });
    });

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
});
