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
		return array.slice(0);
	}

	// Returns the first element of the array
	function head(array) {
		return array[0];
	}

	// Drops the given number of characters from the end of the string
	function dropTail (string, n) {
		return string.substr(0, string.length - n);
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

	$.fn.type = function(options) {

		// SETTINGS
		var settings = {
			sentences: ['Hello', 'Try your own sentences!', 'Don\'t be lazy'],
			caretChar: '_',
			caretClass: 'typejs__caret',
			ignoreContent: false,
			typeDelay: 50,
			onType: null,
			onBackspace: null,
			onFinish: null
		};
		$.extend(settings, options);

		return this.each(function() {

			// Sets up element
			var this_ = $(this);
			var text = this_.text();
			if (this_.children('.typejs__content').length > 0)
				text = this_.children('.typejs__content').text();

			var $content = $('<span>', { class: 'typejs__content', text: text});
			var $caret = $('<span>', { class: settings.caretClass, text: settings.caretChar });

			this_.empty();
			this_.append($content);
			this_.append($caret);

			function typeSentence(current, target, sentences) {
				if (current !== target) {
					var newStr = typeTo(current, target);
					// Step callback
					if (newStr.length > current.length && isFunction(settings.onType)) {
						settings.onType.call(this_);
					} else if (newStr.length < current.length && isFunction(settings.onBackspace)) {
						settings.onBackspace.call(this_)
					}
					// Update content
					$content.text(newStr);
					// Next step
					setTimeout(typeSentence, settings.typeDelay, newStr, targetStr, sentences);
				} else {
					typeArray(tail(sentences));
				}
			}

			function typeArray(sentences) {
				var targetStr = head(sentences);
				if (text !== undefined) {
					setTimeout(typeSentence, settings.sentenceDelay, $content.text(), targetStr);
				}
				else {
					// onFinish callback
					settings.onFinish.call(this_);
				}
			}

			typeArray(settings.sentences);
		}); // each
	}; // function type
})(jQuery);
