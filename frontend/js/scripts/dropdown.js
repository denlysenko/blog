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

})(jQuery);