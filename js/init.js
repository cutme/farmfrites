head.js('https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js', function() {

		function exist(o) {
			d = ($(o).length > 0) ? true : false;
			return d;
		}
		
		exist('select') && head.js('js/jquery.nice-select.min.js', function() {
			$('select').niceSelect();
		});
		
		function owl_load() {
			head.load('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.1.5/assets/owl.carousel.min.css');
			head.js('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.1.5/owl.carousel.min.js');
		}
		
		exist('.owl-carousel') && owl_load();	
	})
	.js('https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js')
	.js('js/main.js');

if (head.browser.ie && parseFloat(head.browser.version) < 9) {
    head.js('https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js')
    	.js('https://cdnjs.cloudflare.com/ajax/libs/selectivizr/1.0.2/selectivizr-min.js')
    	.js('https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js');
}
