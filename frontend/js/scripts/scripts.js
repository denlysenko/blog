$(function() { // show & hide form for reply
	
	(function() {
		$('[data-toggle=reply]').click(function() {
			$(this).siblings('form').toggle(400);
			return false;
		});
	})();

(function() {
	$('li.active', 'nav').click(false);
})();
	
});