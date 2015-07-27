/**
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

}(jQuery));