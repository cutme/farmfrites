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

function goToTarget(target) {
	var v = $('html, body'),
		o = $(target).offset().top - 100;
	v.animate({
		scrollTop: o
	}, {
		duration: 500,
		easing: 'easeOutCubic'
	});
}

function isScrolledIntoView(el) {
	var w = $(window),
		docViewTop = w.scrollTop(),
		docViewBottom = docViewTop + w.height(),
		elemTop = el.offset().top;
	return docViewBottom >= elemTop + 200;
}
jQuery(function($) {
	function exist(o) {
		var d = ($(o).length > 0) ? true : false;
		return d;
	}

	function window_smaller_than(n) {
		var d = ($(window).width() < n) ? true : false;
		return d;
	}
	var L = {
		googleMap: function() {
			$.getScript('https://www.google.com/jsapi', function() {
				google.load('maps', '3', {
					other_params: 'sensor=false',
					callback: function() {
						function initialize() {
							var $container = $('#map');
							var center = new google.maps.LatLng($container.attr('data-lat'), $container.attr('data-lng'));
							map = new google.maps.Map(document.getElementById("map"), center);
							map.setOptions({
								zoom: 16,
								center: center,
								scrollwheel: false,
								disableDefaultUI: true,
								streetViewControl: true,
								draggable: false
							});
							new google.maps.Marker({
								position: center,
								map: map,
								zIndex: 999
							});
							var updateCenter = function() {
									$.data(map, 'center', map.getCenter());
								};
							google.maps.event.addListener(map, 'dragend', updateCenter);
							google.maps.event.addListener(map, 'zoom_changed', updateCenter);
							google.maps.event.addListenerOnce(map, 'idle', function() {
								$container.addClass('is-loaded');
							});
							google.maps.event.addDomListener(window, 'resize', function() {
								map.setCenter(center);
							});
						}
						initialize();
					}
				});
			});
		},
		modalPopup: function() {
			$('.js-popup-modal').magnificPopup({
				type: 'inline',

				fixedContentPos: false,
				fixedBgPos: true,
				
				overflowY: 'auto',
				
				closeBtnInside: true,
				preloader: false,
				
				midClick: true,
				removalDelay: 300,
				mainClass: 'my-mfp-zoom-in'
			});
			$(document).on('click', '.popup-modal-dismiss', function (e) {
				e.preventDefault();
				$.magnificPopup.close();
			});
		},
		slogans: function() {
			var o = $('.c-slogans'),
				i = $('.c-slogans__item'),
				_t;

			function ball(o) {
				i.removeClass('is-active'), o.addClass('is-active');
			}
			i.on('click', function() {
				_t = $(this);
				n = window_smaller_than(768), n === false && ball(_t);
			});
		},
		init: function() {
			exist('.js-slogans') && L.slogans();
			exist('.js-map') && L.googleMap();
			exist('.js-popup-modal') && L.modalPopup();
			
		}
	};
	var N = {
		nav: function() {
			var s = $('.js-section'),
				p = $('.o-page'),
				m = $('.c-nav-panel__menu'),
				l = $('.sub-menu a', m),
				pos, pos_menu, 
				top_height = $('.c-topbar').height(),
				t = $('.js-nav'),
				w = $(window);

			l.on('click', function(e) {
				e.preventDefault();
				var id = '#' + $(this).parent().attr('data-id');
				if ($(id).length > 0) {
					$('.o-page, .c-topbar__content').removeClass('is-moved');
					$('.c-nav-panel, .js-nav').removeClass('is-active');
					$('body').removeClass('with-shadow');
					goToTarget(id);
				} else {
					window.location.href = $(this).attr('href');
				}
			});
			
			t.on('click', function() {
				$(this).toggleClass('is-active');
				$('.o-page, .c-topbar__content').toggleClass('is-moved');
				$('.c-nav-panel').toggleClass('is-active');
				$('body').toggleClass('with-shadow fixed');
			});

			function check_on_panel_menu(obj) {
				if (isScrolledIntoView(obj) === true) {
					var section_id = $(obj).attr('id'), li_index;
					$('.c-nav-panel li').each(function() {
						var menu_id = $(this).attr('data-id');
						if (menu_id === section_id) {
							//li_index = $(this).index() - 1;
							$('.c-nav-panel .sub-menu .is-active').removeClass('is-active');
							$(this).addClass('is-active');							
						}
					});
					
					// zmien aktywna kropke, jesli sa
					if ( $('.js-dots').length>0 ) {
						$('.js-dots li').each(function() {
							var menu_id = $(this).attr('data-id');
							if (menu_id === section_id) {
								$('.js-dots .is-active').removeClass('is-active');
								$(this).addClass('is-active');
							}
						});
					}
				}
			}

			function scrollit() {
				w.scroll(debouncer, function() {
					pos = $(this).scrollTop(); // pozycja scrolla
					//Sprawdz, czy menu jest dluzsze niz ekran
					if (m.outerHeight() + top_height > w.height()) {
						// Sprawdz, czy juz mamy przewiniete cale menu
						if (m.outerHeight() - w.height() - pos + top_height > 0) {
							pos_menu = m.scrollTop() + top_height - pos; // pozycja menu
							m.css('top', pos_menu);
						} else {
							m.css('top', w.height() - m.outerHeight());
						}
					}
					// Zaznacz aktywne menu
					s.each(function() {
						var _t = $(this);
						check_on_panel_menu(_t);
					});
				});
			}

			if ($('html').hasClass('no-mobile')) {
				scrollit();
			}
			
			exist('.js-section') && check_on_panel_menu($('.js-section'));
		},
		navDots: function() {
		
			function createDots() {
				var html = '<ul>';
				$('.js-section').each(function() {
					var data_id = $(this).attr('id');
					html += '<li data-id="'+data_id+'"></li>';
				});
				html += '</ul>';
				$('.js-dots').append(html);
			}

			createDots();

			var el = $('.js-dots li'), id;
			
			el.on('click', function(e) {
				e.preventDefault();
				var id = '#' + $(this).attr('data-id');
				if ($(id).length > 0) {
					$('.o-page, .c-topbar__content').removeClass('is-moved');
					$('.c-nav-panel, .js-nav').removeClass('is-active');
					$('body').removeClass('with-shadow');
					goToTarget(id);
				}
			});
		},
		init: function() {
			exist('.js-dots') && N.navDots();
			N.nav();
		}
	};
	var S = {
		home: function() {
			var owl = $('.owl-carousel'),
				status;

			function startOwl() {
				owl.owlCarousel({
					autoplay: true,
					autoplayTimeout: 3000,
					dots: false,
					loop: true,
					items: 1,
					smartSpeed: 450
				});
			}

			function init() {
				if (window_smaller_than(481)) {
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
			if (window_smaller_than(481)) {
				status = true;
				startOwl();
			} else {
				status = false;
			}
		},
		init: function() {
			exist('.js-home') && S.home();
		}
	};
	$(document).ready(function() {
		L.init();
		N.init();
		S.init();
	});
});