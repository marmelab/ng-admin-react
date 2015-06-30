jest.autoMockOff();

describe('RestWrapper', function() {
    var RestWrapper = require('../RestWrapper');

    describe('getList', function() {
        it('should return data in expected format', function() {
            var restful = {
                allUrl: function() {
                    return {
                        getAll: function() {
                            return {
                                then: function(cb) {
                                    return cb(function() {
                                        return {
                                            data: { totalCount: 10 },
                                            headers: function () {}
                                        };
                                    });
                                }
                            };
                        }
                    };
                }
            };

            var restWrapper = new RestWrapper(restful);
            expect(Object.keys(restWrapper.getList())).toEqual(['data', 'totalCount', 'headers']);
        });
    });
});
