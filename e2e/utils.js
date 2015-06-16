function waitElementWithText(locator) {
    var found = false;

    browser.driver.wait(function () {
        browser.driver.isElementPresent(by.css(locator)).then(function (present) {
            if (!present) {
                return;
            }

            $(locator).getText().then(function (txt) {
                found = txt.length > 0;
            });
        });

        return found;
    }, 10000);
}

module.exports.waitElementWithText = waitElementWithText;
