import restful from 'restful.js';

class ApiRequester {
    static getAll(entityName, perPage) {
        return ApiRequester._request(entityName, perPage)
            .then(function(records) {
                return records.map(r => r.data());
            });
    }

    static _request(entityName, perPage) {
        return restful('localhost:3000')
            .all(entityName)
            .getAll();
    }
}

export default ApiRequester;
