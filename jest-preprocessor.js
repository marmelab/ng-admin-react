var babel = require('babel-core');

module.exports = {
  process: function (src, filename) {
    if ((filename.indexOf('node_modules') === -1 || filename.indexOf('admin-config')) && babel.canCompile(filename)) {
      return babel.transform(src, { filename: filename, stage: 1, retainLines: true, compact: false }).code;
    }

    return src;
  }
};
