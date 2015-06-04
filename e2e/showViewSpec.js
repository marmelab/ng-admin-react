/*global describe,it,expect,$$,element,browser,by*/
describe('ShowView', function () {
    'use strict';

    var hasToLoad = true;

    beforeEach(function () {
        if (hasToLoad) {
            browser.get(browser.baseUrl + '#/posts/show/1');
            hasToLoad = false;
        }
    });

    // @TODO : decomment after choice field implementation
    xdescribe('ChoiceField', function () {
        it('should render as a label when choices is an array', function () {
            $$('.ng-admin-field-category').then(function (fields) {
                expect(fields[0].getText()).toBe('Tech');
            });
        });
        it('should render as a label when choices is a function', function () {
            $$('.ng-admin-field-subcategory').then(function (fields) {
                expect(fields[0].getText()).toBe('Computers');
            });
        });
    });

    describe('ReferencedListField', function () {
        it('should render as a datagrid', function () {
            browser.driver.sleep(100); // wait 100ms

            $$('.datagrid th').then(function (headers) {
                expect(headers.length).toBe(2);

                expect(headers[0].getAttribute('class')).toContain('column-id');
                expect(headers[1].getAttribute('class')).toContain('column-body');
            });
        });
    });

});
