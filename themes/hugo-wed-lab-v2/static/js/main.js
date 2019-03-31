// Run this when JQuery is ready
jQuery(document).ready(function ($) {

	// Instantiate Mobile Menu Plugin
	//var myMobileMenuA = new MobileMenuA({
	//	menuContainerClassName: ""
	//  });


	myMobileMenu.init({
		menuContainerClassName: "wl-menu-container"
	});

	myPublicationsSearch.init({
		publicationListContainerClassName: "wl-publication-list-class-container",
		filter: [ "type" ]
	});

});
