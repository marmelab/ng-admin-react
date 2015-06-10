var originalWarn = console.warn;
console.warn = function (message) {
    if (message.indexOf('Don\'t set .props') !== -1) {
        return;
    }

    originalWarn(message);
};
