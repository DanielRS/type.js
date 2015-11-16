// Calls 'before' when elemId is not yet out-of viewport from the top
// otherwise calls 'after'
(function($) {
	var created = 0;
	var index = {}; // holds id -> scope pairs

	$.fn.scrollCall = function(before, after, options) {
		var $doc = $(document);

		// SETTINGS
		var settings = {
			continuous: false,
			checkpointAfter: false
		}
		$.extend(settings, options);

		// Creates a checkpoint before each selected element
		this.each(function() {
			var checkpointId = '#scrollcall-checkpoint-' + created;
			var $checkpoint = $('<div>', {
				id : checkpointId.substr(1),
				class : 'scrollcall-checkpoint'
			});
			if (!settings.checkpointAfter)
				$(this).before($checkpoint);
			else
				$(this).after($checkpoint);

			index[checkpointId] = $(this);
			created++;
		});

		// Calls before/after events for each checkpoint
		$doc.scroll(function() {
			$.each(index, function(checkpointId, scope) {
				if ($doc.scrollTop() < $(checkpointId).offset().top) {
					if (!$(checkpointId).data('before-done') || settings.continuous) before.call(scope);
					$(checkpointId).data('before-done', true);
					$(checkpointId).data('after-done', false);
				} else {
					if (!$(checkpointId).data('after-done') || settings.continuous) after.call(scope);
					$(checkpointId).data('before-done', false);
					$(checkpointId).data('after-done', true);
				}
			});
		});
		$(window).resize(function() {
			$doc.trigger('scroll');
		});
		$doc.trigger('scroll');
	};
})(jQuery);

(function($) {

	$.fn.dummy = function(options) {

		function guid() {
			function S4() {
				return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			}
			return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
		}

		var settings = {
			suffix: "--dummy",
			updateRate: 0,
			updateOnResize: false,
			after: false
		};
		$.extend(settings, options);

		return this.each(function() {

			var this_ = $(this);
			var id = this_.attr('id');
			var dummyId = this_.data('dummy');

			// Create dummy
			if (dummyId === undefined) {
				dummyId = id ? id : guid();
				dummyId = '#' + dummyId + settings.suffix;

				$dummy = $('<div>', { id: dummyId.substr(1) });
				$dummy.height(this_.outerHeight());
				if (settings.after) this_.after($dummy);
				else this_.before($dummy);

				this_.data('dummy', dummyId);

				// Set events

				function updateDummy() { $(dummyId).height(this_.outerHeight()); };

				if (settings.updateRate > 0) {
					function update() {
						updateDummy();
						setTimeout(update, settings.updateRate);
					}
					update();
				}
				else if (settings.updateOnResize) {
					$(window).resize(updateDummy);
				}
			} // if
		});
	}
})(jQuery);

// Adds typewriter effect animation to selected elements
(function($) {
	$.fn.type = function(targetStr, options) {

		// Checks if object given is a function. Taken from underscorejs source code
		function isFunction(obj) {
			return !!(obj && obj.constructor && obj.call && obj.apply);
		}

		// Drops the given number of characters from the end of the string
		function dropTail (string, n) {
			return string.substr(0, string.length - n);
		}

		// Returns a new string, 1 edit distance from current and closer to target
		function typeTo(current, target) {
			if (current !== target) {
				var subTarget = target.substr(0, current.length);
				if (current !== subTarget) {
					return dropTail(current, 1);
				} else {
					return current + target.charAt(current.length);
				}
			}
			return current;
		}

		// SETTINGS
		var settings = {
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

			function typeStep(current, target) {
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
					setTimeout(typeStep, settings.typeDelay, newStr, targetStr);
				} else if (isFunction(settings.onFinish)) {
					// Finished callback
					settings.onFinish.call(this_);
				}
			}

			setTimeout(typeStep, settings.typeDelay, $content.text(), targetStr);

		}); // each
	}; // function type
})(jQuery);

$(document).ready(function() {

	var $doc = $(document);
	var $body = $('html, body');
	var $goPageTop = $('#go-page-top');
	var fontSize = parseInt($('body').css('font-size'));

	// Main nav click scroll
	$('#main-nav > ul > li > a').each(function() {
		var id = $(this).attr('href');
		$(this).on('click', function(e) {
			history.replaceState(null, '', id);
			var offset = $(id).offset().top - 2*fontSize - $('#main-nav ul').height();
			e.preventDefault();
			$body.stop();
			$body.animate({scrollTop: offset});
		});
	});
	if (window.location.hash) {
		$('#main-nav > ul > li > a[href="' + window.location.hash + '"]').trigger('click');
	}
	// Main nav toggle
	$('#main-nav').addClass('main-nav--hidden');
	$('#main-nav__toggle').click(function() {
		$('#main-nav').toggleClass('main-nav--hidden');
	});

	// Scroll events
	$('#main-nav-wrapper').scrollCall(
		function() {
			// Nav bar
			this.removeClass('main-nav-wrapper--fixed');
			this.css('height', 'auto');
			// Go top
			$goPageTop.addClass('go-page-top--hide');
			// Remove dummy
			var $dummy = $($('#main-nav-wrapper').data('dummy'));
			$dummy.remove();
			this.removeData('dummy');
		},
		function() {
			// Add dummy
			this.dummy({ updateOnResize: true });
			// Nav bar
			this.addClass('main-nav-wrapper--fixed');
			this.css('height', $('#main-nav').height());
			// Go top
			$goPageTop.removeClass('go-page-top--hide');
		}
	);
	// When #go-page-top is clicked go back top
	$goPageTop.click(function(e) {
		e.preventDefault();
		history.replaceState(null, '', window.location.origin);
		$body.animate({ scrollTop: 0});
	});

	// Message notification
	var $message = $('#message');
	$message.addClass('message--fixed');
	$message.delay(4000).fadeOut();

	// Tagline typing
	var taglineMessages = _.map($('ul#tagline__messages > li'), function(obj) { return $(obj).text() });
	function typeArray($elem, array) {
		var text = _.first(array);
		if (text !== undefined) {
			$elem.type(text, {
				onFinish: function() {
					setTimeout(function() { typeArray($elem, _.tail(array)); }, 750);
				}
			});
		}
	}
	typeArray($('#tagline'), taglineMessages);
});