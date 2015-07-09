/*global sinon,FakeRest,apiData*/

(function () {
    'use strict';

    // setup fake server
    var restServer = new FakeRest.Server('http://localhost:3000');
    var testEnv = window.location.pathname.indexOf('test.html') !== -1;
    restServer.init(apiData);
    restServer.toggleLogging(); // logging is off by default, enable it

    restServer.addRequestInterceptor(function(request) {
        var filters = request.params.filter;
        request.params.filter = function(item) {
            for (var key in filters) {
                if ('search' === key) {
                    for (var i in item) {
                        if ('object' === typeof item[i]) {
                            for (var j in item[i]) {
                                if (-1 !== ('' + item[i][j]).indexOf(filters[key])) {
                                    return true;
                                }
                            }

                            continue;
                        }
                        if (-1 !== ('' + item[i]).indexOf(filters[key])) {
                            return true;
                        }
                    }
                }
                if (item[key] != filters[key]) {
                    return false;
                }
            }
            return true;
        };
        return request;
    });

    // use sinon.js to monkey-patch XmlHttpRequest
    sinon.FakeXMLHttpRequest.useFilters = true;
    sinon.FakeXMLHttpRequest.addFilter(function (method, url) {
        // Do not catch webpack sync, config.js transformation but catch /upload in test env
        return url.indexOf('/socket.io/') !== -1 || url.indexOf('config.js') !== -1
            || (!testEnv && url.indexOf('/upload') !== -1);
    });

    var server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.autoRespondAfter = 0; // answer immediately

    server.respondWith(restServer.getHandler());

    if (testEnv) {
        server.respondWith(function (response) {
            if (response.url.indexOf('/upload') !== -1) {
                response.respond(JSON.stringify({apifilename: 'my-cat.jpg'}));
            }
        });
    }
}());
