/*global describe,it,expect,$$,element,browser,by*/

var testMethod = process.env.TRAVIS ? xdescribe : describe;


testMethod('ListView', function () {
    'use strict';

    beforeEach(function () {
        browser.get(browser.baseUrl + '#/posts/list');

        browser.driver.wait(function () {
            return browser.driver.isElementPresent(by.css('table'));
        }, 10000); // wait 10000ms
    });

    describe('Edition link', function () {
        it('should allow edition of an entity', function () {
            // Retrieve first edit button
            $('table tr:nth-child(1) a.btn-edit').click();

            // Check browser URL
            expect(browser.getCurrentUrl()).toContain('/posts/edit/');
        });
    });

    describe('Show link', function () {
        it('should allow display of an entity', function () {
            // Retrieve first edit button
            $('table tr:nth-child(1) a.btn-show').click();

            // Check browser URL
            expect(browser.getCurrentUrl()).toContain('/posts/show/');
        });
    });

    describe('list-btn', function () {
        var listUrl;

        // @TODO : activate these test after implementation of filters
        beforeEach(function () {
            listUrl = encodeURI(browser.baseUrl + '/#/comments/list?search={"post_id":"9"}&page=1');
            browser.get(listUrl);
        });


        xit('should restore the list with filter when used from edit', function () {
            browser.executeScript('window.scrollTo(810, 481)').then(function () {
                $$('a.btn-edit').then(function (elements) {
                    expect(elements[0].getText()).toBe(' Edit');
                    elements[0].click();
                    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/comments/edit/2');

                    $$('a.btn-list').then(function (elements) {
                        elements[0].click();
                        expect(browser.getCurrentUrl()).toBe(listUrl);
                    });
                });
            });
        });

        xit('should restore the list with filter when used from delete', function () {
            browser.get(listUrl);
            browser.executeScript('window.scrollTo(810, 481)').then(function () {

                $$('a.btn-delete').then(function (elements) {
                    expect(elements[0].getText()).toBe(' Delete');
                    elements[0].click();
                    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/comments/delete/2');
                    $$('.btn-default').then(function (elements) {
                        elements[0].click();
                        expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/comments/edit/2');

                        $$('a.btn-list').then(function (elements) {
                            elements[0].click();
                            expect(browser.getCurrentUrl()).toBe(listUrl);
                        });
                    });
                });
            });
        });
    });
});
