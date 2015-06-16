describe('Pagination', function () {
    'use strict';

    beforeEach(function () {
        // Refresh Fakerest data
        browser.get(browser.baseUrl).then(function () {
            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.panel-heading'));
            }, 10000); // wait 10s

            browser.get(browser.baseUrl + '#/comments/list').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('nav'));
                }, 10000); // wait 10s

                browser.executeScript('window.scrollTo(0, document.body.scrollHeight);');
            });
        });
    });

    describe('informations', function() {
        it('should display a pagination nav with content range', function () {
            $$('.pagination-bar .total').then(function (totalElements) {
                expect(totalElements[0].getText()).toBe('1 - 10 on 11');
            });
        });

        it('should display a pagination nav with pagination buttons', function () {
            $$('.pagination-bar .pagination li').then(function (liElements) {
                expect(liElements[0].getText()).toBe('');
                expect(liElements[1].getText()).toBe('1');
                expect(liElements[1].getAttribute('class')).toContain('active');
                expect(liElements[2].getText()).toBe('2');
                expect(liElements[3].getText()).toBe('Next »');
            });
        });
    });

    describe('page change', function () {
        it('should allow page navigation', function () {
            $$('.pagination-bar li:nth-child(3) a').click().then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.pagination-bar .pagination li'));
                }, 5000); // wait 5s

                expect($('.pagination-bar .total').getText()).toBe('11 - 11 on 11');

                $$('.pagination-bar .pagination li').then(function (liElements) {
                    expect(liElements[0].getText()).toBe('« Prev');
                    expect(liElements[2].getAttribute('class')).toContain('active');
                    expect(liElements[3].getText()).toBe('');
                });
            });
        });
    });

});
