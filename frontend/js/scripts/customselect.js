$(function() {
	var $customSelect = $('.select'),
			$form = $customSelect.parents('form'),
			$input = $form.find('input[type=hidden]'),
			$title = $customSelect.find('span'),
			value;

	$form.on('submit', function() {
		value = ($title.text() === 'Choose Category') ? '' : $title.text();
		$input.val(value);
	});		
});