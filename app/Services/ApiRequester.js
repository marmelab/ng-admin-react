import restful from 'restful.js';

class ApiRequester {
    static getAll(view, page, fillSimpleReference, filters, sortField, sortDir) {
        return ApiRequester._request(view, page, filters, sortField, sortDir)
            .then(function(records) {
                return records.map(r => r.data());
            });
    }

    static _request(listView, page, filters, sortField, sortDir) {
        var params = {
            _page: (typeof (page) === 'undefined') ? 1 : parseInt(page),
            _perPage: listView.perPage()
        };

        if (sortField && sortField.split('.')[0] === listView.name()) {
            params._sortField = sortField.split('.')[1];
            params._sortDir = sortDir;
        } else if (listView.sortField()) {
            params._sortField = listView.sortField();
            params._sortDir = listView.sortDir();
        }

        // @TODO: move it to request interceptor
        params = {
            _start: 0,
            _end: params._perPage,
            _sort: params._sortField,
            _order: params._sortDir
        };

        //if (filters && Object.keys(filters).length !== 0) {
        //    var filterFields = listView.filters(),
        //        filterName;
        //    params._filters = {};
        //    for (filterName in filters) {
        //        if (filterFields.hasOwnProperty(filterName) && filterFields[filterName].hasMaps()) {
        //            angular.extend(params._filters, filterFields[filterName].getMappedValue(filters[filterName]));
        //        } else {
        //            params._filters[filterName] = filters[filterName];
        //        }
        //    }
        //}

        return restful('localhost:3000')
            .all(listView.entity.name())
            //.addRequestInterceptor(function(data, headers, method, url) {
            //    // Doesn't work (restful.js issue?)
            //    console.log('Requested: ', data);
            //    return data;
            //})
            .getAll(params);
    };
}

export default ApiRequester;
