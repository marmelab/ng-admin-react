function register(name, value) {
    global.__defineGetter__(name, () => value);
}

export default register;
