;(function($) {
	'use strict';

	var Dropdown = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Dropdown.DEFAULTS, options);
	};

	Dropdown.DEFAULTS = {
		duration: 400
	};

	Dropdown.prototype.toggle = function() {
		var $this = this.$element;
		$this.hasClass('dropdown-open') ? this.close() : this.open();
	};

	Dropdown.prototype.open = function() {
		var $this = this.$element,
				target = $this.find('.dropdown-menu'),
				self = this;
		target.fadeIn(this.options.duration, function() {
			$this.addClass('dropdown-open');
			if($this.hasClass('select')) {
				$this.on('click.select', 'li', function(e) {
					self.select(e);
				});
			}
			$(document).on('click.dropdown', function() {
				self.close();
			});
		});		
	};

	Dropdown.prototype.close = function() {
		var $this = this.$element,
				target = $this.find('.dropdown-menu');
		target.fadeOut(this.options.duration, function() {
			$this.removeClass('dropdown-open');
			if($this.hasClass('select')) {
				$(self).off('.select');
			}
			$(document).off('.dropdown');
		});
	};

	Dropdown.prototype.select = function(e) {
		var title = this.$element.find('span');
		var text = $(e.target).text();
		title.text(text);		
	};
	
	$(window).on('load', function() {
		$('.dropdown').each(function() {
			var dropdown = new Dropdown(this);
			$(this).on('click', '[data-toggle="dropdown"]', function() {
				dropdown.toggle();
				return false;
			});
		});
	});

})(jQuery);;$(function() { // show & hide form for reply
	
	(function() {
		$('[data-toggle=reply]').click(function() {
			$(this).siblings('form').toggle(400);
			return false;
		});
	})();

(function() {
	$('li.active', 'nav').click(false);
})();
	
});;$(function() {
	var $customSelect = $('.select'),
			$form = $customSelect.parents('form'),
			$input = $form.find('input[type=hidden]'),
			$title = $customSelect.find('span'),
			value;

	$form.on('submit', function() {
		value = ($title.text() === 'Choose Category') ? '' : $title.text();
		$input.val(value);
	});		
});;/**
* Makes modals
**/

;(function($){

	var Modal = function(element, options) {
		this.$element = element;
		this.options = $.extend({}, Modal.DEFAULTS, options);
		this.$overlay = $(this.options.overlay);
		this.$overlay.on('click', $.proxy(this.hide, this));
		$(this.options.dismiss).on('click', $.proxy(this.hide, this));
	};

	Modal.DEFAULTS = {
		overlay: '#overlay',
		dismiss: '[data-dismiss="modal"]',
		transitionDuration: 150
	};

	Modal.prototype.show = function($target) {
		var self = this,
				$overlay = this.$overlay,
				shown = $('.modal-open'),
				duration = this.options.transitionDuration;

		if(shown.length) this.hide();		

		self.adjustOverlay($overlay);
		$overlay.fadeIn(duration, function() {
			$target.slideDown(duration).addClass('modal-open');
		});

		$(document).on('keydown.modals', function(e) {
			if(e.which === 27) self.hide(); //esc key
		});

		$(window).on('resize.modals', function() {
			self.adjustOverlay($overlay);
		});
	};

	Modal.prototype.hide = function() {
		var $this = $('.modal-open'),
				$overlay = this.$overlay,
				self = this,
				duration = this.options.transitionDuration;;

		$this.removeClass('modal-open').slideUp(duration);
		$overlay.fadeOut(duration);		
		
		$(document).off('keydown.modals');
		$(window).off('resize.modals');
	};

	Modal.prototype.adjustOverlay = function(elem) {
		elem.css({
			'width': $(window).width(),
			'height': $(document).height()
		});
	};

	$(window).on('load', function() {
		$('.modal').each(function() {
			var modal = new Modal(this);
			$(this).data('modal', modal); // saving link on modal object with method data() to call methods of modal object afterwards
		});
	
		$(document).on('click', '[data-toggle="modal"]', function(e){
			var id = $(this).attr('data-target'),
					$target = $(id),
					modal = $target.data('modal'); //retrieve modal object saved earlier
					
				modal.show($target);
				return false;
		})
	})

}(jQuery));;
;(function($){

	'use strict';

	var Tooltip = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Tooltip.DEFAULTS, options);
	};

	Tooltip.DEFAULTS = {
		offsetFromElem: 10
	};

	Tooltip.prototype.makeTooltipElem = function() {
		this.tooltipElem = $('<span>').addClass('tooltip')
                             .html(this.options.html)
                             .appendTo('body');
	};

	Tooltip.prototype.show = function() {
		this.makeTooltipElem();
		var $elem = this.$element,
				self = this;
		
    this.positionTooltip($elem);

    $(window).on('scroll.tooltip', function(){
    	self.positionTooltip($elem);
    });
	};

	Tooltip.prototype.destroy = function() {
		this.tooltipElem.remove();
		$(window).off('scroll.tooltip');
	};

	Tooltip.prototype.positionTooltip = function(elem) {
		var coords = elem.offset(),
		offsetFromElem = this.options.offsetFromElem,
		$tooltipElem = this.tooltipElem, 
    left = coords.left + elem.outerWidth() + offsetFromElem,
    top = coords.top;

    $tooltipElem.css({
      top: top,
      left: left
    })   
	};

	var validator = {

		data: {},

		types: {},
		
		onKeyDown: function() {
			var $this = $(this),
					tooltip = $this.data('tooltip'),
					$button = $this.closest('form').find('[type="submit"]');
			if(tooltip) {
				tooltip.destroy();
				$(this).removeData('tooltip').removeClass('has-error');
				$button.removeAttr('disabled').removeClass('disabled');
			}
		},
		
		validate: function(form) {
			var $form = $(form),
					inputs = $('input, textarea', $form),
					value,
					self = this,
					valid = true,
					$button = $('[type="submit"]', $form);
					
			inputs.each(function() {
				var $this = $(this),
						name = $this.attr('name'), 
						validation = $this.attr('data-validate'),
						checker,
						result,
						value = $this.val(),
						type,
						tooltip = $this.data('tooltip');

				if(!validation) return;		
				type = (validation.indexOf(' ') !== -1) ? validation.split(' ') : validation;
				
				if($.isArray(type)) {
					var types = type, len = types.length, i;

					for(i = 0; i < len; i++) {
						type = 'is' + types[i];
						checker = self.types[type];
						if(!checker) return;
						result = checker.validate(value);
						if(!result) {
							if(!tooltip) {
								tooltip = new Tooltip($this, {html: checker.instructions + name});
								tooltip.show();
								$this.addClass('has-error').data('tooltip', tooltip);
								$button.attr('disabled', 'disabled').addClass('disabled');
								valid = false;
								break;
							}
						}
					}
				} else {
					type = 'is' + type;
					checker = self.types[type];
					if(!checker) return;
					result = checker.validate(value);
					if(!result) {
						if(!tooltip) {
							tooltip = new Tooltip($this, {html: checker.instructions + name});
							tooltip.show();
							$this.addClass('has-error').data('tooltip', tooltip);
						}
						$button.attr('disabled', 'disabled').addClass('disabled');
						valid = false;
					}
				}
			});		
			return valid;
		}
	};

	validator.types.isrequired = {
		validate: function(value) {
			return value !== '';
		},
		instructions: 'Enter '
	};

	validator.types.isequal = {
		validate: function(value) {
			return value === $('#new_password').val();
		},
		instructions: 'Password not match to '
	};

	$(function() {
		
		$('form:not(#contact)').each(function() {
			$(this).on('submit', function() {
				if(!validator.validate(this)) return false;
			}).on('keydown', 'input, textarea', validator.onKeyDown);
		});

		$('#contact').on('keydown', 'input, textarea', validator.onKeyDown)
				.submit(function(e) {

					if(!validator.validate(this)) return false;

					e.preventDefault();

					var $this = $(this),
							url = $this.attr('action');

					$.post(url, $this.serialize(), function(res) {
						if(res === 'ok') {
							var trigger = $('<span data-toggle="modal" data-target="#success">').appendTo('body');
							trigger.click();
							trigger.remove();
							$this.find('input, textarea').val('');
						}
					});
				});
	});

}(jQuery));;$(function() {

	(function () {
			$('span.likes').on('click', 'a', function(e) {
				e.preventDefault();
				var $this = $(this),
						url = $this.attr('href');
	
				$.post(url, function(post) {
					var likes = +post.likes;
					var trigger = $('<span data-toggle="modal" data-target="#success">').appendTo('body');
					trigger.click();
					trigger.remove();
					$this.next('span').text(++likes + ' Likes')
				}, 'json');
			});
		})();

		(function () {
			var div = $('.load-posts');

			div.on('click', 'a', function(e) {
				e.preventDefault();
				var skip = $('.preview').length,
						url = $(this).attr('href') + '/' + skip,
						$this = $(this);

				$.get(url, function(res) {
					var previewLength = $(res).filter('.preview').length;
					$(res).insertBefore(div);
					if(previewLength < 4) $this.remove();
				}, 'html')
			});	
		})();

	(function() {
		var div = $('.load-comments');

		div.on('click', 'a', function(e) {
			e.preventDefault();
			var skip = $('.comment-item').length,
					url = $(this).attr('href') + '/' + skip,
					$this = $(this);

			$.get(url, function(res) {
				var commentLength = $(res).filter('.comment-item').length;
				$(res).insertBefore(div);
				if(commentLength < 2) $this.remove();
			}, 'html')
		});
	})();

	
});