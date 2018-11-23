(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/util.js
// Merges two objects.
function merge() {
  var merged = {};

  for (var i = 0; i < arguments.length; i++) {
    var obj = arguments[i];

    for (var attr in obj) {
      merged[attr] = obj[attr];
    }
  }

  return merged;
} // Checks if the given object is a function. Taken from underscorejs source code.

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
} // Checks if the given object is an array.

function isArray(obj) {
  return toString(obj) === "[object Array]";
} // Returns the first element of the array.

function head(array) {
  return array[0];
} // Returns the same array skipping the first element.

function tail(array) {
  return array.slice(1);
} // Drops the first character of the string and returns the rest.

function strTail(str) {
  return str.substring(1, str.length);
} // Returns the first character of the string.

function strHead(str) {
  return str[0];
} // Return the last character of the string.

function strLast(str) {
  return str[str.length - 1];
} // Drops the given number of characters from the start of the string.

function strDrop(string, n) {
  return string.substr(n, string.length);
} // Drops the given number of characters from the end of the string

function strDropTail(string, n) {
  return string.substr(0, string.length - n);
} // Intersects the start of two strings.

function strIntersect(a, b) {
  var i;

  for (i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] != b[i]) break;
  }

  return a.substr(0, i);
} // Returns the original value with the given noise applied.
// E.g. noise(x, 2) = x - 2 <= y <= x + 2

function noise(x, delta) {
  return Math.round(Math.random() * delta * 2 - delta) + x;
} // Checks if the given prefix is prefix of target.

function isPrefix(prefix, target) {
  return target.substr(0, prefix.length) == prefix;
} // Checks if the given string has length zero.

function isEmpty(string) {
  return string.length == 0;
} // Creates a typer that deletes characters each time it
// is called until predicate is true. After that, it appends
// the characters of the given string one by one each time
// it is called.

function makeTyper(current, pending, predicate) {
  var forward = current.length == 0 || predicate(current, pending);
  var prevLength = current.length;
  return function () {
    var step = {
      current: current,
      pending: pending,
      isType: current.length > prevLength,
      isBackspace: current.length < prevLength,
      isDone: forward && pending.length <= 0
    };
    prevLength = current.length;

    if (forward && pending.length > 0) {
      current = current + head(pending);
      pending = tail(pending);
    } else if (!forward && current.length > 0) {
      current = strDropTail(current, 1);
    }

    forward = forward || current.length == 0 || predicate(current, pending);
    return step;
  };
} // Creates a typer that deletes characters until current is a prefix
// of target.

function makePrefixTyper(current, target) {
  var commonPrefix = strIntersect(current, target);
  var pending = target.substr(commonPrefix.length, target.length);
  return makeTyper(current, pending, function (curr) {
    return curr == commonPrefix;
  });
}
// CONCATENATED MODULE: ./src/typing.js

var DEFAULT_SETTINGS = {
  sentences: ['Hello typing.js'],
  caretChar: '_',
  caretClass: 'typingjs__caret',
  ignoreContent: false,
  ignorePrefix: false,
  typeDelay: 50,
  sentenceDelay: 750,
  humanize: true,
  onType: undefined,
  onBackspace: undefined,
  onFinish: undefined,
  onSentenceFinish: undefined
};
var Typing = {
  new: function _new(selector, options) {
    var elements = document.querySelectorAll(selector);
    this.withElements(elements, options);
  },
  withElements: function withElements(elements, options) {
    // Settings.
    var settings = merge(DEFAULT_SETTINGS, options);
    Array.prototype.map.call(elements, function (el) {
      // Creates initial elements.
      var initialText = settings.ignoreContent ? '' : el.textContent;
      var content = document.createElement('span');
      content.className = 'typingjs__content';
      content.textContent = initialText;
      var caret = document.createElement('caret');
      caret.className = settings.caretClass;
      caret.textContent = settings.caretChar;
      el.innerHTML = '';
      el.appendChild(content);
      el.appendChild(caret); // Starts progress here.

      var sentencesLeft = settings.sentences.slice();

      function typeSentence(typer) {
        // Reads next iteration of the typing animation.
        var _typer = typer(),
            current = _typer.current,
            isType = _typer.isType,
            isBackspace = _typer.isBackspace,
            isDone = _typer.isDone;

        content.textContent = current;

        if (isDone) {
          if (isFunction(settings.onSentenceFinish)) settings.onSentenceFinish.call(this_);
          typeArray();
        } else {
          // Callbacks.
          if (isType && isFunction(settings.onType)) settings.onType.call(this_);
          if (isBackspace && isFunction(settings.onBackspace)) settings.onBackspace.call(this_); // Next step

          var humanTimeout = settings.typeDelay;
          if (settings.humanize) humanTimeout = noise(settings.typeDelay, settings.typeDelay);
          setTimeout(typeSentence, humanTimeout, typer);
        }
      }

      function typeArray() {
        var targetStr = head(sentencesLeft);
        sentencesLeft = tail(sentencesLeft);

        if (targetStr !== undefined) {
          var typer = makePrefixTyper(content.textContent, targetStr);

          if (settings.ignorePrefix) {
            typer = makeTyper(content.textContent, targetStr, function (curr) {
              return curr.length == 0;
            });
          }

          setTimeout(typeSentence, settings.sentenceDelay, typer);
        } else if (isFunction(settings.onFinish)) {
          settings.onFinish.call(this_);
        }
      }

      typeArray();
    });
  }
};

if (typeof jQuery != 'undefined') {
  (function ($) {
    $.fn.typing = function (options) {
      Typing.withElements(this.get(), options);
    };
  })(jQuery);
}

window.Typing = Typing;
/* harmony default export */ var typing = __webpack_exports__["default"] = (Typing);

/***/ })
/******/ ]);
});
//# sourceMappingURL=typing.js.map