"use strict";

exports.__esModule = true;
var visitor = {
  Property: function Property(node) {
    if (node.method) {
      node.method = false;
    }

    if (node.shorthand) {
      node.shorthand = false;
    }
  }
};
exports.visitor = visitor;