/*global describe,it,expect,$$,element,browser,by*/

var testMethod = process.env.TRAVIS ? xdescribe : describe;


testMethod('DeleteView', function () {
    'use strict';

    beforeEach(function () {
        browser.get(browser.baseUrl + '#/posts/list');

        browser.driver.wait(function () {
            return browser.driver.isElementPresent(by.css('table tbody tr'));
        }, 10000); // wait 10000ms
    });

    describe('Deletion link', function () {
        it('should allow to delete of an entity', function () {
            // Retrieve first delete button
            $('table tr:nth-child(1) a.btn-delete').click().then(function() {
                // Check browser URL
                expect(browser.getCurrentUrl()).toContain('/posts/delete/12');

                // Check title
                $$('.view-wrapper h1').then(function (h1Element) {
                    expect(h1Element[0].getText()).toBe('Delete post "Qui tempore rerum et voluptates"');
                });

                // Delete it
                $('.btn-danger').click().then(function () {
                    // Wait for list to load
                    browser.driver.wait(function () {
                        return browser.driver.isElementPresent(by.css('table tbody tr'));
                    }, 10000); // wait 10000ms

                    // Check that post 11 has been deleted
                    $$('table tr td:nth-child(1)').then(function (lastId) {
                        expect(lastId[0].getText()).toNotBe(11);
                    });
                });
            });
        });

        it('should allow to cancel the deletion', function () {
            // Retrieve first delete button
            $('table tr:nth-child(1) a.btn-delete').click().then(function () {
                // Check browser URL
                expect(browser.getCurrentUrl()).toContain('/posts/delete/12');

                // Check title
                $$('.view-wrapper h1').then(function (h1Element) {
                    expect(h1Element[0].getText()).toBe('Delete post "Qui tempore rerum et voluptates"');
                });

                // Cancel it
                $('#delete-view .btn-default').click().then(function () {
                    // Wait for list to load
                    expect(browser.getCurrentUrl()).toContain('/posts/edit/12');
                });
            });
        });
    });
});
