import {head, tail, isFunction, noise, makePrefixTyper, makeTyper} from "./util";

const DEFAULT_SETTINGS = {
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

const Typing = {
	new: function(selector, options) {
		const elements = document.querySelectorAll(selector);
		this.newWithElements(elements, options);
	},

	newWithElements: function(elements, options) {
		// Settings.
		const settings = {};
		for (var attr in DEFAULT_SETTINGS) { settings[attr] = DEFAULT_SETTINGS[attr]; }
		for (var attr in options) { settings[attr] = options[attr]; }

		for (var i = 0; i < elements.length; i++) {
			const el = elements[i];

			// Creates initial elements.
			const initialText = settings.ignoreContent ? '' : el.textContent;

			const content = document.createElement('span');
			content.className = 'typingjs__content';
			content.textContent = initialText;

			var caret = document.createElement('caret');
			caret.className = settings.caretClass;
			caret.textContent = settings.caretChar;

			el.innerHTML = '';
			el.appendChild(content);
			el.appendChild(caret);

			// Starts progress here.
			var sentencesLeft = settings.sentences;

			function typeSentence(typer) {
				// Reads next iteration of the typing animation.
				const {current, isType, isBackspace, isDone} = typer();

				content.textContent = current;

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
					var typer = makePrefixTyper(content.textContent, targetStr);
					if (settings.ignorePrefix) {
						typer = makeTyper(content.textContent, targetStr, curr => curr.length == 0);
					}
					setTimeout(typeSentence, settings.sentenceDelay, typer);
				}
				else if (isFunction(settings.onFinish)) {
					settings.onFinish.call(this_);
				}
			}

			typeArray();
		};
	}
};

if (typeof jQuery != 'undefined') {
	(function($) {
		$.fn.typing = function(options) {
			Typing.newWithElements(this.get());
		};
	})(jQuery);
}

window.Typing = Typing;
export default Typing;
