'use strict';

// WARNING: this is experimental!

var path = require('path');
var sync = require('synchronize');

// Using 'lib/webpack.web.js'
var webpackPackageJson = require('webpack/package.json');
var webpack = require('webpack/' + webpackPackageJson.web);

var MemoryFileSystem = require('memory-fs');

var EnhancedResolve = require('enhanced-resolve');
var SyncNodeJsInputFileSystem = EnhancedResolve.SyncNodeJsInputFileSystem;

// Store FS among preprocess calls
var memoryFs = new MemoryFileSystem();
var syncFs = new SyncNodeJsInputFileSystem();

module.exports = {
  process: function (src, filename) {
    var options = require(path.resolve(__dirname, 'webpack.config.js'));

    options.entry = filename;
    options.target = 'node';
    options.output = options.output || {};
    options.output.path = '/';
    options.output.libraryTarget = 'commonjs2';
    options.output.filename = "[name]";

    options.outputFileSystem = memoryFs;
    options.inputFileSystem = syncFs;

    var compiler = webpack(options);
    var contents;

    sync.fiber(function() {
        var result = sync.await(compiler.run(sync.defer()));

        contents = compiler.outputFileSystem.readFileSync('/main');
    });

    return contents;
  }
};
