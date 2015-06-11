if (document.currentScript) {
    var src = document.currentScript.src;
} else {
    var scripts = document.getElementsByTagName('script');
    var src = scripts[scripts.length - 1].getAttribute('src');
}
__webpack_public_path__ = src.substr(0, src.lastIndexOf('/') + 1);

module.exports = require('./ReactAdmin');
