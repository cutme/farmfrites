/*jshint expr:true */

function debouncer(func, timeout) {
	var timeoutID;
	timeout = timeout || 200;
	return function() {
		var scope = this,
			args = arguments;
		clearTimeout(timeoutID);
		timeoutID = setTimeout(function() {
			func.apply(scope, Array.prototype.slice.call(args));
		}, timeout);
	};
}
jQuery(function($) {
	function exist(o) {
		d = ($(o).length > 0) ? true : false;
		return d;
	}

	function window_smaller_than(n) {
		var d = ($(window).width() < n) ? true : false;
		return d;
	}
	var L = {
		slogans: function() {
			var o = $('.c-slogans'), i = $('.c-slogans__item'), _t;
			
			i.on('click', function() {
				_t = $(this);
				i.removeClass('is-active');
				_t.addClass('is-active');
			});
		},
		init: function() {
			exist('.js-slogans') && L.slogans();
		}
	};
	$(document).ready(function() {
		L.init();
	});
});