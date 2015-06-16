describe('ShowView', function () {
    'use strict';

    beforeEach(function () {
        // Refresh Fakerest data
        browser.get(browser.baseUrl).then(function () {
            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.panel-heading'));
            }, 10000); // wait 10s
        });
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
            browser.get(browser.baseUrl + '#/posts/show/1').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.datagrid th'));
                }, 10000); // wait 10s
            });

            $$('.datagrid th').then(function (headers) {
                expect(headers.length).toBe(2);

                expect(headers[0].getAttribute('class')).toContain('column-id');
                expect(headers[1].getAttribute('class')).toContain('column-body');
            });
        });
    });

});
