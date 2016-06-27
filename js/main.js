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

function getScreenHeight() {
	sh = document.documentElement.clientHeight;
	return sh;
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
		imgCanvas: function() {
			var el = $('.imgcanvas');
			function init() {
				el.each(function() {
					$('img', this).attr('style', '');
					var h = $(this).height();				
					if (h > getScreenHeight() - 72) {
						$('img', this).css('max-height', getScreenHeight());
					}
				});
			}
			$(window).resize(debouncer(function(e) {
				init();
			}));
			init();
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
			//exist('.js-slogans') && L.slogans();
			exist('.js-map') && L.googleMap();
			exist('.js-popup-modal') && L.modalPopup();
			exist('.imgcanvas') && L.imgCanvas();
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
					$('.c-nav-panel--right, .js-nav').removeClass('is-active');
					$('body').removeClass('with-shadow');
					$('.c-nav-page__arrow').removeClass('is-centered');
					$('.icon-hamburger').fadeToggle();
					goToTarget(id);
				} else {
					window.location.href = $(this).attr('href');
				}
			});
			
			t.on('click', function() {
				$(this).toggleClass('is-active');
				$('.o-page, .c-topbar__content').toggleClass('is-moved');
				$('.c-nav-panel--right').toggleClass('is-active');
				$('body').toggleClass('with-shadow fixed');
				$('.c-nav-page__arrow').toggleClass('is-centered');
				$('.icon-hamburger').fadeToggle();
				$('.c-nav-panel--left').removeClass('is-active');
				$('.o-page').removeClass('is-compressed is-moved--right');
				$('.c-nav-page__arrow').removeClass('is-centered--right');
			});

			function check_on_panel_menu(obj) {
				if (isScrolledIntoView(obj) === true) {
					var section_id = $(obj).attr('id'), li_index;
					
					// zmien aktywny link
					$('.c-nav-panel').each(function() {
						var _p = $(this);
						$('li', this).each(function() {
							var menu_id = $(this).attr('data-id');
							if (menu_id === section_id) {
								_p.find('.sub-menu .is-active').removeClass('is-active');
								$(this).addClass('is-active');							
							}
						});
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
				var html = '<div class="c-nav-dots__content"><a class="icon-hamburger js-fastnav"></a><ul>';
				$('.js-section').each(function() {
					var data_id = $(this).attr('id');
					html += '<li data-id="'+data_id+'"></li>';
				});
				html += '</ul></div>';
				$('.js-dots').append(html);
			}

			createDots();

			var el = $('.js-dots li'), id
				fastnav_show = $('.js-fastnav'),
				fastnav_close = $('.js-fastnav-close');

			el.on('click', function(e) {
				e.preventDefault();
				var id = '#' + $(this).attr('data-id');
				if ($(id).length > 0) {
					$('.o-page, .c-topbar__content').removeClass('is-moved');
					$('.c-nav-panel--right, .js-nav').removeClass('is-active');
					$('body').removeClass('with-shadow fixed');
					$('.c-nav-page__arrow').removeClass('is-centered');
					$('.icon-hamburger').fadeIn();
					goToTarget(id);
				}
			});
			
			fastnav_show.on('click', function(e) {
				$('.c-nav-panel--left').toggleClass('is-active');
				$('.o-page').addClass('is-compressed is-moved--right');
				$('.c-nav-page__arrow').addClass('is-centered--right');
				$('.o-wrap').addClass('is-padding');
				//p.addClass('');
			});

			fastnav_close.on('click', function(e) {
				$('.c-nav-panel--left').toggleClass('is-active');
				$('.o-page').removeClass('is-compressed is-moved--right');
				$('.c-nav-page__arrow').removeClass('is-centered--right');
				$('.o-wrap').removeClass('is-padding');
			});			
		},
		pageNav: function() {
			var el = $('.js-pagenav'),
				n = $('.c-nav-page__arrow--down', el),
				p = $('.c-nav-page__arrow--up', el),
				b = $('body'),
				t = $('.c-topbar'),
				w = $(window);
				//is-compressed is-moved--right

			var shadow_bottom = 'with-shadow--bottom',
				shadow_top = 'c-topbar--shadow';
			
			function getPageHeight() {
				ph = $('.o-page').outerHeight();
				return ph;
			}
			
			function getScrollPosition() {
				sp = w.scrollTop();
				return sp;
			}
			
			function nav_bottom(r) {				
				if (r === false) {
					n.fadeOut();
					b.removeClass(shadow_bottom);
				} else {
					n.fadeIn();
					b.addClass(shadow_bottom);
				}
			}

			function nav_top(r) {
				if (r === false) {
					t.removeClass(shadow_top);
					p.fadeOut();
				} else {
					t.addClass(shadow_top);
					p.fadeIn();
				}
			}
			
			function pos_calc(a) {
			
				if (a == 'down') {

					// czy caly ekran
					if ( (ph - sp - sh) > sh ) {
						d = sp + sh - 72;
					} else {
						d = sp + ( ph - sp - sh );
						nav_bottom();
					}
				} else {
				
					// czy caly ekran
					if ( sp >= sh ) {
						d = sp - sh;
					} else {
						d = 0;
						p.fadeOut();
						t.removeClass(shadow_top);
					}				
				}				
				return d;
			}

			function init() {
				if (( (ph - sp) > 0 ) && (sp != ph - sh) ) {
					nav_bottom();
				}
				
				if (( !t.hasClass(shadow_top)) && (sp != 0) ) {
					nav_top();
				}
				
				// Scroll Event
				w.scroll(debouncer, function() {
					ph = getPageHeight();
					sh = getScreenHeight();
					sp = getScrollPosition();

					if ( sp != 0) {
						nav_top();
					} else {
						nav_top(false);
					}
					
					if ( sp + sh == ph ) {
						nav_bottom(false);
					} else {
						nav_bottom();
					}
				});
			}
			
			var ph = getPageHeight(),
				sh = getScreenHeight(),
				sp = getScrollPosition(),
				d;
			
			// strzalka dolna
			n.on('click', function(e) {
				e.preventDefault();
				b.animate({
					scrollTop: pos_calc('down')
				}, {
					duration: 1000,
					easing: 'easeOutCubic'
				});
			});
			
			// strzalka gorna
			p.on('click', function(e) {
				e.preventDefault();					
				b.animate({
					scrollTop: pos_calc('up')
				}, {
					duration: 1000,
					easing: 'easeOutCubic'
				});	
			});
			
			init();
		},
		init: function() {
			exist('.js-dots') && N.navDots();
			exist('.js-pagenav') && N.pageNav();
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
					dots: true,
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