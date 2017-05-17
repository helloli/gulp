"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * async/await 测试
 */

var f = function f() {
    return new _promise2.default(function (resolve, reject) {
        setTimeout(function () {
            resolve(123);
        }, 2000);
    });
};

var testAsync = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var t;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return f();

                    case 2:
                        t = _context.sent;


                        console.log(t);

                    case 4:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function testAsync() {
        return _ref.apply(this, arguments);
    };
}();

testAsync();
//# sourceMappingURL=map/t.js.map
