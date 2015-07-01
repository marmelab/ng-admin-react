"use strict";

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _types = require("../../../types");

var t = _interopRequireWildcard(_types);

var metadata = {
  group: "builtin-trailing"
};

exports.metadata = metadata;
var visitor = {
  Flow: function Flow() {
    this.dangerouslyRemove();
  },

  ClassProperty: function ClassProperty(node) {
    node.typeAnnotation = null;
    if (!node.value) this.dangerouslyRemove();
  },

  Class: function Class(node) {
    node["implements"] = null;
  },

  Function: function Function(node) {
    for (var i = 0; i < node.params.length; i++) {
      var param = node.params[i];
      param.optional = false;
    }
  },

  TypeCastExpression: function TypeCastExpression(node) {
    do {
      node = node.expression;
    } while (t.isTypeCastExpression(node));
    return node;
  },

  ImportDeclaration: function ImportDeclaration(node) {
    if (node.isType) this.dangerouslyRemove();
  },

  ExportDeclaration: function ExportDeclaration() {
    if (this.get("declaration").isTypeAlias()) this.dangerouslyRemove();
  }
};
exports.visitor = visitor;