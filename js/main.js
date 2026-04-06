const swiper = new Swiper('.swiper', {
	slidesPerView: 1,

	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},

	breakpoints: {
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
		1480: {
			slidesPerView: 4,
		},
	},
});
