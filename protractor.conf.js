exports.config = {
    specs: ['e2e/*.js'],
    capabilities: {
        browserName: 'chrome'
    },
    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 360000
    },
    baseUrl: 'http://localhost:8080',
    framework: 'jasmine',

    onPrepare: function() {
        browser.ignoreSynchronization = true;
    }
};
