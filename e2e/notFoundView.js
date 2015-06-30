describe('NotFoundView', function () {
    'use strict';

    describe('Not found on not existed route', function () {
        it('should display not found for unknow url', function () {
            browser.get(browser.baseUrl + '#/nawak').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                expect($('.page-header h1').getText()).toBe('Not Found');
                expect($('.dashboard-content div').getText()).toBe('The page you are looking for cannot be found. Take a break before trying again.');
            });
        });
    });

    describe('Not found on list', function () {
        it('should display not found for not configured entity', function () {
            browser.get(browser.baseUrl + '#/psts/list').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                expect($('.page-header h1').getText()).toBe('Not Found');
            });
        });

        it('should display not found for disabled view', function () {
            browser.get(browser.baseUrl + '#/comments/show/1').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                expect($('.page-header h1').getText()).toBe('Not Found');
            });
        });
    });

    describe('Not found on show', function () {
        it('should display not found for not configured entity', function () {
            browser.get(browser.baseUrl + '#/psts/show/12').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                expect($('.page-header h1').getText()).toBe('Not Found');
            });
        });

        it('should display not found for not existed resource', function () {
            browser.get(browser.baseUrl + '#/posts/show/9999').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                expect($('.page-header h1').getText()).toBe('Not Found');
            });
        });
    });

    describe('Not found on edit', function () {
        it('should display not found for unknow url', function () {
            browser.get(browser.baseUrl + '#/psts/edit/12').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                expect($('.page-header h1').getText()).toBe('Not Found');
            });
        });

        it('should display not found for not existed resource', function () {
            browser.get(browser.baseUrl + '#/posts/edit/9999').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                expect($('.page-header h1').getText()).toBe('Not Found');
            });
        });
    });

    describe('Not found on delete', function () {
        it('should display not found for unknow url', function () {
            browser.get(browser.baseUrl + '#/psts/delete/12').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                expect($('.page-header h1').getText()).toBe('Not Found');
            });
        });

        it('should display not found for not existed resource', function () {
            browser.get(browser.baseUrl + '#/posts/delete/9999').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.page-header h1'));
                }, 5000); // wait 5s

                expect($('.page-header h1').getText()).toBe('Not Found');
            });
        });
    });
});
