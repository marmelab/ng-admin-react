"use strict";

exports.__esModule = true;

var _helpersNameMethod = require("../../helpers/name-method");

var metadata = {
  group: "builtin-basic"
};

exports.metadata = metadata;
var visitor = {
  "ArrowFunctionExpression|FunctionExpression": {
    exit: _helpersNameMethod.bare
  }
};
exports.visitor = visitor;