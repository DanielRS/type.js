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