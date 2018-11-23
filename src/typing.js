import {merge, head, tail, isFunction, noise, makePrefixTyper, makeTyper} from "./util";

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
		this.withElements(elements, options);
	},

	withElements: function(elements, options) {
		// Settings.
		const settings = merge(DEFAULT_SETTINGS, options);

		Array.prototype.map.call(elements, el => {
			// Creates initial elements.
			const initialText = settings.ignoreContent ? '' : el.textContent;

			const content = document.createElement('span');
			content.className = 'typingjs__content';
			content.textContent = initialText;

			const caret = document.createElement('caret');
			caret.className = settings.caretClass;
			caret.textContent = settings.caretChar;

			el.innerHTML = '';
			el.appendChild(content);
			el.appendChild(caret);

			// Starts progress here.
			var sentencesLeft = settings.sentences.slice();

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
		});
	}
};

if (typeof jQuery != 'undefined') {
	(function($) {
		$.fn.typing = function(options) {
			Typing.withElements(this.get(), options);
		};
	})(jQuery);
}

window.Typing = Typing;
export default Typing;

