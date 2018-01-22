"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var p = new _promise2.default(function (resolve, reject) {
  setTimeout(function () {
    resolve(1);
  }, 2000);
});

p.then(function (data) {
  console.log(data);
});
//# sourceMappingURL=../../map/study/promise/index.js.map
