$(function() {

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