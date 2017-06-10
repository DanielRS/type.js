import {head, tail, isFunction, noise, makePrefixTyper, makeTyper} from "./util";

(function($) {
	$.fn.typing = function(options) {

		// SETTINGS
		var settings = {
			sentences: ['Hello', 'Try your own sentences!', 'Don\'t be lazy'],
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

			function typeSentence(typer) {
				// Reads next iteration of the typing animation.
				const {current, isType, isBackspace, isDone} = typer();

				$content.text(current);

				if (isDone) {
					if (isFunction(settings.onSentenceFinish))
						settings.onSentenceFinish.call(this_);
					typeArray();
				} else {
					// Callbacks.
					if (isType && isFunction(settings.onType))
						settings.onType.call(this_);
					if (isBackspace && isFunction(settings.onBackspace))
						settings.onBackspace.call(this_);

					// Next step
					var humanTimeout = settings.typeDelay;
					if (settings.humanize)
						humanTimeout = noise(settings.typeDelay, settings.typeDelay);
					setTimeout(typeSentence, humanTimeout, typer);
				}
			}

			function typeArray() {
				var targetStr = head(sentencesLeft);
				sentencesLeft = tail(sentencesLeft);
				if (targetStr !== undefined) {
					var typer = makePrefixTyper($content.text(), targetStr);
					if (settings.ignorePrefix) {
						typer = makeTyper($content.text(), targetStr, curr => curr.length == 0);
					}
					setTimeout(typeSentence, settings.sentenceDelay, typer);
				}
				else if (isFunction(settings.onFinish)) {
					settings.onFinish.call(this_);
				}
			}
			typeArray();

		}); // each
	}; // function typing
})(jQuery);
