(function($) {

	//
	// Utility functions
	//

	// Checks if the given object is a function. Taken from underscorejs source code.
	function isFunction(obj) {
		return !!(obj && obj.constructor && obj.call && obj.apply);
	}

	// Checks if the given object is an array.
	function isArray(obj) {
		return toString(obj) === "[object Array]";
	}

	// Returns the same array skipping the first element.
	function tail(array) {
		return array.slice(1);
	}

	// Returns the first element of the array.
	function head(array) {
		return array[0];
	}

	// Drops the given number of characters from the end of the string
	function dropTail(string, n) {
		return string.substr(0, string.length - n);
	}

	// Returns the original value with the given noise applied.
	// E.g. noise(x, 2) = x - 2 <= y <= x + 2
	function noise(x, delta) {
		return Math.round(Math.random() * delta * 2 - delta) + x;
	}

	// Creates a function that takes a string, target and predicate.
	// The created function then takes a character from the given
	// string each time it is called until the predicate returns true.
	// After that, it starts adding the characters from the target
	// string until the current string has the same length as target.
	function makeTypeTo(current, target, predicate) {
		var predicateIsTrue = false;
		var current = current;
		var target = target;

		return function() {
			predicateIsTrue = predicateIsTrue || predicate(current, target);

			if (predicateIsTrue && current.length >= target.length) {
				return {current: current, isBackspace: false, isType: false, isDone: true};
			}

			var prevLength = current.length;
			if (predicateIsTrue) {
				current = current + target.charAt(current.length);
			} else {
				current = dropTail(current, 1);
			}

			return {
				current: current,
				isBackspace: current.length < prevLength,
				isType: current.length > prevLength,
				isDone: false
			};
		};
	}

	// Checks if the given prefix is prefix of target.
	function isPrefix(prefix, target) {
		return target.substr(0, prefix.length) == prefix;
	}

	// Checks if the given string has length zero.
	function isEmpty(string) {
		return string.length == 0;
	}

	//
	// Typying.js extension function.
	//

	$.fn.typing = function(options) {

		// SETTINGS
		var settings = {
			sentences: ['Hello', 'Try your own sentences!', 'Don\'t be lazy'],
			caretChar: '_',
			caretClass: 'typingjs__caret',

			ignoreContent: false,
			ignoreSentence: false,
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

			function typeSentence(typeTo) {
				// Reads next iteration of the typing animation.
				var next = typeTo();
				var current = next.current;
				var isBackspace = next.isBackspace;
				var isType = next.isType;
				var isDone = next.isDone;

				$content.text(current);

				if (isDone) {
					if (isFuncion(settings.onSentenceFinish))
						settings.onSentenceFinish.call(this_);
					typeArray();
				} else {
					// Callbacks.
					if (isType && isFunction(settings.onType))
						settings.onType.call(this_);
					if (isBackspace && isFuncion(settings.onBackspace))
						settings.onBackspace.call(this_);

					// Next step
					var humanTimeout = settings.typeDelay;
					if (settings.humanize)
						humanTimeout = noise(settings.typeDelay, settings.typeDelay);
					setTimeout(typeSentence, humanTimeout, typeTo);
				}
			}

			function typeArray() {
				var targetStr = head(sentencesLeft);
				sentencesLeft = tail(sentencesLeft);
				if (targetStr !== undefined) {
					const typeTo = makeTypeTo(
						$content.text(),
						targetStr,
						settings.ignoreSentence ? isEmpty : isPrefix
					);
					setTimeout(typeSentence, settings.sentenceDelay, typeTo);
				}
				else if (isFunction(settings.onFinish)) {
					settings.onFinish.call(this_);
				}
			}
			typeArray();

		}); // each
	}; // function typing
})(jQuery);
