module.exports = {
    getState: function () {
        return {
            data: {
                get: function (name) {
                    if (name === 'pending') return false;
                    if (name === 'totalItems') return 11;
                    if (name === 'entries') return [];
                }
            }
        };
    },
    addChangeListener: jest.genMockFunction(),
    removeChangeListener: jest.genMockFunction()
};
