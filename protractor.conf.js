exports.config = {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,
    maxSessions: 1,
    multiCapabilities: [
        {
            browserName: 'chrome',
            build: process.env.TRAVIS_BUILD_NUMBER ? process.env.TRAVIS_BUILD_NUMBER : null,
            'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER ? process.env.TRAVIS_JOB_NUMBER : null,
            name: 'react-admin'
        }
    ],
    specs: ['e2e/*.js'],
    baseUrl: 'http://' + (process.env.CI ? 'reactadmin' : 'localhost') + ':8081/index.html',
    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 360000
    },
    framework: 'jasmine',
    onPrepare: function () {
        browser.ignoreSynchronization = true;
    }
};
