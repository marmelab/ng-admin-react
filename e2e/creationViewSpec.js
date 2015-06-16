var utils = require('./utils');

describe('CreationView', function () {
    'use strict';

    beforeEach(function () {
        // Refresh Fakerest data
        browser.get(browser.baseUrl).then(function () {
            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.panel-heading'));
            }, 10000); // wait 10s
        });
    });

    beforeEach(function() {
        browser.get(browser.baseUrl + '#/posts/create').then(function () {
            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.react-admin-field-title input'));
            }, 10000); // wait 10s
        });
    });

    describe('Creation', function() {
        it('should render a creation page with form fields', function () {
            expect($('.react-admin-field-title input').getAttribute('value')).toBe('');
        });

        it('should update values on form submit and redirect to edit page', function () {
            $('#create-view .react-admin-field-title input').sendKeys('My new post').then(function () {
                $('#create-view button[type="submit"]').click().then(function () {
                    // Wait for notification to be displayed
                    utils.waitElementWithText('.humane-flatty-success');

                    // Check that a notification has been displayed
                    expect($('.humane-flatty-success').getText()).toBe('Element successfully created.');

                    expect(browser.getCurrentUrl()).toContain('/posts/edit/');
                    browser.driver.wait(function () {
                        return browser.driver.isElementPresent(by.css('.page-header h1'));
                    }, 10000); // wait 10s

                    expect($('.page-header h1').getText()).toContain('Edit post');
                    expect($('.page-header h1').getText()).toContain('My new post');
                });
            });
        });
    });

});
