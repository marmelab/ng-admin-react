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

    describe('Creation', function () {
        it('should render a creation page with form fields', function () {
            expect($('.react-admin-field-title input').getAttribute('value')).toBe('');
        });

        it('should update values on form submit and redirect to edit page', function () {
            $('#create-view .react-admin-field-title input').sendKeys('My new post').then(function () {
                // Fill textarea
                $('#create-view .react-admin-field-teaser textarea').sendKeys('My teaser').then(function () {
                    // Fill wysiwyg
                    $('.wysiwyg-field').sendKeys('My long text').then(function () {
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

                            expect($('#teaser').getText()).toContain('My teaser');

                            expect($('.wysiwyg-field p').getText()).toContain('My long text');

                        });
                    });
                });
            });
        });
    });

    describe('SelectField', function() {

        beforeEach(function() {
            browser.get(browser.baseUrl + '#/comments/create').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.react-admin-field-post_id input'));
                }, 10000); // wait 10s
            });
        });

        it('should render as a dropdown with reference choices', function () {
            expect($('.react-admin-field-post_id input').getAttribute('value')).toBe('');
            expect($('.react-admin-field-post_id div.Select-placeholder').getText()).toBe('Select...');

            $('.react-admin-field-post_id span.Select-arrow').click().then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.react-admin-field-post_id div.Select-menu-outer'));
                }, 5000); // wait 5s

                $$('.react-admin-field-post_id .Select-option').then(function (options) {
                    expect(options.length).toBe(12);
                });
            });
        });

    });
});
