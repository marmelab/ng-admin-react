module.exports = {
    getState: () => {
        return {
            data: {
                get: (name) => {
                    if (name === 'totalItems') return 11;
                    if (name === 'entries') return [];
                }
            }
        };
    },
    addChangeListener: jest.genMockFunction(),
    removeAllListeners: jest.genMockFunction()
};
