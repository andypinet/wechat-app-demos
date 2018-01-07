var polyfills = {
  "Object.values": function() {
    Object.values = Object.values ? Object.values : function (obj) {
      var allowedTypes = ["[object String]", "[object Object]", "[object Array]", "[object Function]"];
      var objType = Object.prototype.toString.call(obj);

      if (obj === null || typeof obj === "undefined") {
        throw new TypeError("Cannot convert undefined or null to object");
      } else if (!~allowedTypes.indexOf(objType)) {
        return [];
      } else {
        // if ES6 is supported
        if (Object.keys) {
          return Object.keys(obj).map(function (key) {
            return obj[key];
          });
        }

        var result = [];
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            result.push(obj[prop]);
          }
        }

        return result;
      }
    };
  },
  "Array.prototype.includes": function() {
    if (!Array.prototype.includes) {
      Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {

          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }

          // 1. Let O be ? ToObject(this value).
          var o = Object(this);

          // 2. Let len be ? ToLength(? Get(O, "length")).
          var len = o.length >>> 0;

          // 3. If len is 0, return false.
          if (len === 0) {
            return false;
          }

          // 4. Let n be ? ToInteger(fromIndex).
          //    (If fromIndex is undefined, this step produces the value 0.)
          var n = fromIndex | 0;

          // 5. If n ≥ 0, then
          //  a. Let k be n.
          // 6. Else n < 0,
          //  a. Let k be len + n.
          //  b. If k < 0, let k be 0.
          var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

          function sameValueZero(x, y) {
            return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
          }

          // 7. Repeat, while k < len
          while (k < len) {
            // a. Let elementK be the result of ? Get(O, ! ToString(k)).
            // b. If SameValueZero(searchElement, elementK) is true, return true.
            if (sameValueZero(o[k], searchElement)) {
              return true;
            }
            // c. Increase k by 1. 
            k++;
          }

          // 8. Return false
          return false;
        }
      });
    }
  },
  "String.prototype.padStart": function() {
    if (!String.prototype.padStart) {
      String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
          return String(this);
        }
        else {
          targetLength = targetLength - this.length;
          if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
          }
          return padString.slice(0, targetLength) + String(this);
        }
      };
    }
  }
}

module.exports = {
  init: function(resolutions) {
    resolutions.forEach(function (key) {
      if (key && typeof key === "string") {
        if (polyfills[key]) {
          polyfills[key]();
        }
      }
    });
  },
  initAll: function() {
    this.init(Object.keys(polyfills));
  },
  getKeys: function() {
    return Object.keys(polyfills);
  }
};