describe('ListView', function () {
    'use strict';

    beforeEach(function () {
        // Refresh Fakerest data
        browser.get(browser.baseUrl).then(function () {
            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.panel-heading'));
            }, 10000); // wait 10s
        });
    });

    describe('Post list', function () {

        beforeEach(function () {
            browser.get(browser.baseUrl + '#/posts/list').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('table tr:nth-child(1) td:nth-child(2)'));
                }, 10000); // wait 10s
            });
        });

        describe('Edition link', function () {
            it('should allow edition of an entity', function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('table tr:nth-child(1) a.btn-edit'));
                }, 5000); // wait 5s

                // Retrieve first edit button
                $('table tr:nth-child(1) a.btn-edit').click().then(function () {
                    // Check browser URL
                    expect(browser.getCurrentUrl()).toContain('/posts/edit/');
                });
            });
        });

        describe('Show link', function () {
            it('should allow display of an entity', function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('table tr:nth-child(1) a.btn-show'));
                }, 5000); // wait 5s

                // Retrieve first edit button
                $('table tr:nth-child(1) a.btn-show').click().then(function () {
                    // Check browser URL
                    expect(browser.getCurrentUrl()).toContain('/posts/show/');
                });
            });
        });

        describe('ReferenceMany link', function () {
            it('should redirect to comment edition form', function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('table tr:nth-child(2) .reference-many-column a:nth-child(1)'));
                }, 5000); // wait 5s

                // Retrieve reference many link
                $('table tr:nth-child(2) .reference-many-column a:nth-child(1)').click().then(function () {
                    // Check browser URL
                    expect(browser.getCurrentUrl()).toContain('/tags/show/4');
                });
            });
        });

        // @TODO : activate these test after implementation of filters
        xdescribe('list-btn', function () {
            var listUrl;

            beforeEach(function () {
                listUrl = encodeURI(browser.baseUrl + '/#/comments/list?search={"post_id":"9"}&page=1');
                browser.get(listUrl);
            });

            xit('should restore the list with filter when used from edit', function () {
                browser.executeScript('window.scrollTo(810, 481)').then(function () {
                    $$('a.btn-edit').then(function (elements) {
                        expect(elements[0].getText()).toBe(' Edit');
                        elements[0].click().then(function () {
                            expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/comments/edit/2');

                            $$('a.btn-list').then(function (elements) {
                                elements[0].click().then(function () {
                                    expect(browser.getCurrentUrl()).toBe(listUrl);
                                });
                            });
                        });
                    });
                });
            });

            xit('should restore the list with filter when used from delete', function () {
                browser.get(listUrl);
                browser.executeScript('window.scrollTo(810, 481)').then(function () {

                    $$('a.btn-delete').then(function (elements) {
                        expect(elements[0].getText()).toBe(' Delete');
                        elements[0].click().then(function () {
                            expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/comments/delete/2');

                            $$('.btn-default').then(function (elements) {
                                elements[0].click().then(function () {
                                    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/comments/edit/2');

                                    $$('a.btn-list').then(function (elements) {
                                        elements[0].click().then(function () {
                                            expect(browser.getCurrentUrl()).toBe(listUrl);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe('Comment list', function () {

        beforeEach(function () {
            browser.get(browser.baseUrl + '#/comments/list').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('table tr:nth-child(1) td:nth-child(2)'));
                }, 10000); // wait 10s
            });
        });

        describe('Reference link', function () {
            it('should redirect to comment edition form', function () {
                // Retrieve first reference link
                $('table tr:nth-child(1) a.reference-column').click().then(function () {
                    // Check browser URL
                    expect(browser.getCurrentUrl()).toContain('/posts/edit/1');
                });
            });
        });

        describe('detail link', function() {
            it('should go to edit view', function() {
                // Click on first detail link
                $('table tr:nth-child(1) td:nth-child(2) a').click().then(function () {
                    // Check browser URL
                    expect(browser.getCurrentUrl()).toContain('/comments/edit/11');
                });
            });
        });
    });
});
