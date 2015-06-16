var utils = require('./utils');

describe('EditionView', function () {
    'use strict';

    beforeEach(function() {
        browser.get(browser.baseUrl + '#/posts/edit/12').then(function () {
            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.react-admin-field-title input'));
            }, 10000); // wait 10s
        });
    });

    describe('Edition', function() {
        it('should render an edit page with form fields', function () {
            expect($('.react-admin-field-title input').getAttribute('value')).toBe('Qui tempore rerum et voluptates');
        });

        it('should update values on form submit', function () {
            $('#edit-view .react-admin-field-title input').sendKeys(' and what ?').then(function () {
                $('#edit-view button[type="submit"]').click().then(function () {
                    // Wait for notification to be displayed
                    utils.waitElementWithText('.humane-flatty-success');

                    // Check that a notification has been displayed
                    expect($('.humane-flatty-success').getText()).toBe('Changes successfully saved.');

                    expect($('.page-header h1').getText()).toContain('and what ?');
                });
            });
        });
    });

    xdescribe('ChoiceField', function() {

        it('should render as a dropdown when choices is an array', function () {
            $$('.ng-admin-field-category select option').then(function (options) {
                expect(options[1].getText()).toBe('Tech');
                expect(options[1].getAttribute('selected')).toBe('true');
                expect(options[2].getText()).toBe('Lifestyle');
            });
        });

        it('should render as a dropdown when choices is a function', function () {
            $$('.ng-admin-field-subcategory select option').then(function (options) {
                expect(options[1].getText()).toBe('Computers');
                expect(options[1].getAttribute('selected')).toBe('true');
                expect(options[2].getText()).toBe('Gadgets');
            });
        });

    });

});
