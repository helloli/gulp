"use strict";

var f = function f() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(123);
    }, 2000);
  });
};

var testAsync = async function testAsync() {
  var t = await f();
  console.log(t);
};

testAsync();
//# sourceMappingURL=map/t.js.map
