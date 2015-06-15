describe('Dashboard', function () {
    'use strict';

    beforeEach(function () {
        // Refresh Fakerest data
        browser.get(browser.baseUrl).then(function () {
            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.panel-heading'));
            }, 10000); // wait 10s
        });
    });

    it('should display a navigation menu linking to all entities', function () {
        browser.driver.wait(function () {
            return browser.driver.isElementPresent(by.css('.nav li:nth-child(4)'));
        }, 10000); // wait 10s

        $$('.nav li').then(function (items) {
            expect(items.length).toBe(5);
            expect(items[0].getText()).toBe('Posts');
            expect(items[1].getText()).toMatch(/✉\s?Comments/);
            expect(items[2].getText()).toBe('Tags');
        });
    });

    it('should display a panel for each entity with a list of recent items', function () {
        browser.driver.wait(function () {
            return browser.driver.isElementPresent(by.css('.panel:nth-child(2)'));
        }, 10000); // wait 10s

        $$('.panel').then(function (panels) {
            expect(panels.length).toBe(3);

            expect(panels[0].all(by.css('.panel-heading')).first().getText()).toBe('Recent posts');
            expect(panels[1].all(by.css('.panel-heading')).first().getText()).toBe('Recent tags');
            expect(panels[2].all(by.css('.panel-heading')).first().getText()).toBe('Last comments');
        });
    });

    it('should contains a detail link in the posts panel', function () {
        browser.driver.wait(function () {
            return browser.driver.isElementPresent(by.css('.panel:nth-child(1)'));
        }, 10000); // wait 10s

        $$('.panel:nth-child(1) tbody tr:nth-child(1) a').then(function (links) {
            links[0].click().then(function() {
                // Check browser URL
                expect(browser.getCurrentUrl()).toContain('/posts/edit/12');
            });
        });
    });
});
