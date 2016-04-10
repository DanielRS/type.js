(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
(function($) {

	//
	// Utility functions
	//

	// Checks if the given object is a function. Taken from underscorejs source code
	function isFunction(obj) {
		return !!(obj && obj.constructor && obj.call && obj.apply);
	}

	// Checks if the given object is an array.
	function isArray(obj) {
		return toString(obj) === "[object Array]";
	}

	// Returns the same array except from the first element
	function tail(array) {
		return array.slice(1);
	}

	// Returns the first element of the array
	function head(array) {
		return array[0];
	}

	// Drops the given number of characters from the end of the string
	function dropTail(string, n) {
		return string.substr(0, string.length - n);
	}

	// Takes a value and a noise value, returns the origin value noised over the specified noise range
	// E.g. noise(x, 2) = x - 2 <= y <= x + 2
	function noise(x, delta) {
		return Math.round(Math.random() * delta * 2 - delta) + x;
	}

	// Returns a new string, 1 edit distance from current and closer to target
	function typeTo(current, target) {
		if (current !== target) {
			var subTarget = target.substr(0, current.length);
			if (current !== subTarget) return dropTail(current, 1);
			else return current + target.charAt(current.length);
		}
		return current;
	}

	//
	// Typying.js function
	//

	$.fn.typing = function(options) {

		// SETTINGS
		var settings = {
			sentences: ['Hello', 'Try your own sentences!', 'Don\'t be lazy'],
			caretChar: '_',
			caretClass: 'typingjs__caret',
			ignoreContent: false,
			typeDelay: 50,
			sentenceDelay: 750,
			humanize: true,
			onType: undefined,
			onBackspace: undefined,
			onFinish: undefined,
			onSentenceFinish: undefined
		};
		$.extend(settings, options);

		return this.each(function() {

			// Sets up element
			var this_ = $(this);
			var text = '';
			if (!settings.ignoreContent) {
				text = this_.text();
				if (this_.children('.typingjs__content').length > 0)
					text = this_.children('.typingjs__content').text();
			}

			var $content = $('<span>', { class: 'typingjs__content', text: text});
			var $caret = $('<span>', { class: settings.caretClass, text: settings.caretChar });

			this_.empty();
			this_.append($content);
			this_.append($caret);

			// Variable for sentences state
			var sentencesLeft = settings.sentences;

			function typeSentence(currentStr, targetStr) {
				if (currentStr !== targetStr) {
					var newStr = typeTo(currentStr, targetStr);
					// Step callback
					if (newStr.length > currentStr.length && isFunction(settings.onType)) {
						settings.onType.call(this_);
					} else if (newStr.length < currentStr.length && isFunction(settings.onBackspace)) {
						settings.onBackspace.call(this_)
					}
					// Update content
					$content.text(newStr);
					// Next step
					var humanTimeout = settings.typeDelay;
					if (settings.humanize) humanTimeout = noise(settings.typeDelay, settings.typeDelay / 2);
					setTimeout(typeSentence, humanTimeout, newStr, targetStr);
				} else {
					if (isFunction(settings.onSentenceFinish))
						settings.onSentenceFinish.call(this_);
					typeArray();
				}
			}

			function typeArray() {
				var targetStr = head(sentencesLeft);
				sentencesLeft = tail(sentencesLeft);
				if (targetStr !== undefined) {
					setTimeout(typeSentence, settings.sentenceDelay, $content.text(), targetStr);
				}
				else if (isFunction(settings.onFinish)) {
					settings.onFinish.call(this_);
				}
			}
			typeArray();

		}); // each
	}; // function typing
})(jQuery);


//# sourceMappingURL=typing.js.map