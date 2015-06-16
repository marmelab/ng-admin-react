function register(name, value) {
    if (global.hasOwnProperty(name)) {
        return;
    }

    Object.defineProperty(global, name, {get: () => value});
}

export default register;
