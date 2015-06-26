describe('Filters', function () {
    'use strict';

    beforeEach(function () {
        // Refresh Fakerest data
        browser.get(browser.baseUrl).then(function () {
            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.panel-heading'));
            }, 10000); // wait 10s
        });
    });

    describe('Pinned filter', function () {

        beforeEach(function () {
            browser.get(browser.baseUrl + '#/comments/list').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('table tr:nth-child(1) td:nth-child(2)'));
                }, 10000); // wait 10s
            });

            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.filter-value  input'));
            }, 5000); // wait 5s
        });

        it('should display a pinned filter', function () {
            expect($('.filter-value input').getAttribute('name')).toBe('author');
        });

        it('should filter by author', function () {
            $('.filter-value input').sendKeys('Manu').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('table tr:nth-child(1) td:nth-child(2)'));
                }, 10000); // wait 10s

                $$('.pagination-bar .total').then(function (totalElements) {
                    expect(totalElements[0].getText()).toBe('1 - 1 on 1');

                    $$('table tbody tr').then(function(elements) {
                        expect($('table tbody tr td:nth-child(4)').getText()).toBe('Manu');
                        expect(elements.length).toBe(1);
                    });
                });
            });
        });
    });

    describe('Reference filter', function () {

        beforeEach(function () {
            browser.get(browser.baseUrl + '#/comments/list').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('table tr:nth-child(1) td:nth-child(2)'));
                }, 10000); // wait 10s
            });

            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.filter-value input'));
            }, 5000); // wait 5s
        });

        it('should display a non pinned filter', function () {
            $('.dropdown-toggle').click().then(function () {
                $('.dropdown-menu li:nth-child(3)').click().then(function () {
                    expect($('.filter-post_id label').getText()).toBe('Post');

                    // Filter should be removed from dropdown
                    $('.dropdown-toggle').click().then(function () {
                        $$('.dropdown-menu li').then(function (filters) {
                            expect(filters.length).toBe(2);
                        });
                    });
                });
            });
        });

        it('should filter with a select', function () {
            $('.dropdown-toggle').click().then(function () {
                $('.dropdown-menu li:nth-child(3)').click().then(function () {
                    $('.filter-post_id .is-searchable').click().then(function () {
                        $('.Select-menu-outer .Select-option:nth-child(1)').click().then(function () {
                            browser.driver.wait(function () {
                                return browser.driver.isElementPresent(by.css('table tbody tr:nth-child(1)'));
                            }, 5000); // wait 5s

                            expect($('.pagination-bar .total').getText()).toBe('1 - 2 on 2');

                            $$('table tbody tr').then(function(elements) {
                                expect($('table tbody tr td:nth-child(3)').getText()).toBe('Accusantium qui nihil voluptatum quia voluptas max...');
                                expect(elements.length).toBe(2);
                            });
                        });
                    });
                });
            });
        });

        it('should remove a filter', function () {
            $('.dropdown-toggle').click().then(function () {
                $('.dropdown-menu li:nth-child(3)').click().then(function () {
                    $('.filter-post_id a.remove').click().then(function () {

                        // Filter should be added to the dropdown
                        $('.dropdown-toggle').click().then(function () {
                            $$('.dropdown-menu li').then(function (filters) {
                                expect(filters.length).toBe(3);
                            });
                        });
                    });
                });
            });
        });
    });
});
