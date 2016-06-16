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
		googleMap: function() {
			$.getScript('https://www.google.com/jsapi', function()
			{
				google.load('maps', '3', { other_params: 'sensor=false', callback: function() {
			
				function initialize() {
					var $container    = $( '#map' )
					var center        = new google.maps.LatLng( $container.attr( 'data-lat' ), $container.attr( 'data-lng' ) );
				
					map = new google.maps.Map(document.getElementById("map"), center);
					map.setOptions({ zoom: 16, center: center, scrollwheel: false, disableDefaultUI: true, streetViewControl: true, draggable: false });
					
					new google.maps.Marker({ position: center, map: map, zIndex: 999 });
				
					var updateCenter = function(){ $.data( map, 'center', map.getCenter() ); };
						google.maps.event.addListener( map, 'dragend', updateCenter );
						google.maps.event.addListener( map, 'zoom_changed', updateCenter );
						google.maps.event.addListenerOnce( map, 'idle', function(){ $container.addClass( 'is-loaded' ); });
						
						google.maps.event.addDomListener(window, 'resize', function() {
						map.setCenter(center);
					});
				}
				
				initialize();
				
				}});
			});
		},
		slogans: function() {
			var o = $('.c-slogans'), i = $('.c-slogans__item'), _t;
			
			function ball(o) {
				i.removeClass('is-active'),
				o.addClass('is-active');
			}

			i.on('click', function() {
				_t = $(this);
				n = window_smaller_than(768), n === false && ball(_t);
			});
		},
		init: function() {
			exist('.js-slogans') && L.slogans();
			exist('.js-map') && L.googleMap();			
		}
	};
	
	var S = {
		home: function() {
			var owl = $('.owl-carousel'),
				status;
				
			function startOwl() {
				owl.owlCarousel({
					autoplay:true,
				    autoplayTimeout: 3000,
					dots: false,
					loop: true,
					items: 1,
					smartSpeed: 450
				});						
			}

			function init() {
				if (window_smaller_than(768)) {
					if (status === false) {
						setTimeout(function() {
							startOwl();
						}, 10);
						status = true;
					}
				} else {
					if (status === true) {
						owl.trigger('destroy.owl.carousel');
						status = false;
					}
				}
			}			

			$(window).resize(debouncer(function(e) {
				init();
			}));

			if (window_smaller_than(768)) {
				status = true;
				startOwl();
			} else {
				status = false;
			}
		},
		init: function() {
			exist('.js-home') && S.home();
			
		}
	}
	
	$(document).ready(function() {
		L.init();
		S.init();
	});
});