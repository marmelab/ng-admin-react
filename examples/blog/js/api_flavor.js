
export function requestInterceptor(params) {
    if (params._page) {
        var start = (params._page - 1) * params._perPage;
        var end = params._page * params._perPage - 1;
        params.range = "[" + start + "," + end + "]";
        delete params._page;
        delete params._perPage;
    }
    if (params._sortField) {
        params.sort = '["' + params._sortField + '","' + params._sortDir + '"]';
        delete params._sortField;
        delete params._sortDir;
    }
    if (params._filters) {
        params.filter = params._filters;
        delete params._filters;
    }

    return {
        params: params
    };
}

export function responseInterceptor(data, headers) {
    if (headers['content-range']) {
        headers['X-Total-Count'] = headers['content-range'].split('/').pop();
    }

    return {
        headers: headers
    };
}

// add the interceptors ...
export function init(restful) {
  restful.addFullRequestInterceptor(requestInterceptor);
  restful.addFullResponseInterceptor(responseInterceptor);
};
