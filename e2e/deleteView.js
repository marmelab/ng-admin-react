var utils = require('./utils');

describe('DeleteView', function () {
    'use strict';

    beforeEach(function () {
        // Refresh Fakerest data
        browser.get(browser.baseUrl).then(function () {
            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.panel-heading'));
            }, 10000); // wait 10s
        });
    });

    describe('Deletion link', function () {

        beforeEach(function () {
            browser.get(browser.baseUrl + '#/posts/list').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('table tr:nth-child(1) a.btn-delete'));
                }, 10000); // wait 10s
            });
        });

        it('should allow to delete of an entity', function () {
            // Retrieve first delete button
            $('table tr:nth-child(1) a.btn-delete').click().then(function() {
                // Check browser URL
                expect(browser.getCurrentUrl()).toContain('/posts/delete/12');

                // Wait for page to load
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                // Check title
                expect($('.page-header h1').getText()).toBe('Delete post "Qui tempore rerum et voluptates"');

                // Delete it
                $('.btn-danger').click().then(function () {
                    // Wait for notification to be displayed
                    utils.waitElementWithText('.humane-flatty-success');

                    // Check that a notification has been displayed
                    expect($('.humane-flatty-success').getText()).toBe('Element successfully deleted.');

                    browser.driver.wait(function () {
                        return browser.driver.isElementPresent(by.css('table tbody tr'));
                    }, 10000); // wait 10000ms

                    // Check that post 11 has been deleted
                    expect($('table tr td:nth-child(1)').getText()).toNotBe(11);
                });
            });
        });

        it('should allow to cancel the deletion', function () {
            // Retrieve first delete button
            $('table tr:nth-child(1) a.btn-delete').click().then(function () {
                // Check browser URL
                expect(browser.getCurrentUrl()).toContain('/posts/delete/12');

                // Wait for page to load
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                // Check title
                expect($('.page-header h1').getText()).toBe('Delete post "Qui tempore rerum et voluptates"');

                // Cancel it
                $('#delete-view .btn-default').click().then(function () {
                    // Wait for list to load
                    expect(browser.getCurrentUrl()).toContain('/posts/edit/12');
                });
            });
        });
    });
});
