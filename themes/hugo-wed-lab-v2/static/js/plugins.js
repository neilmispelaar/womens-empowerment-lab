// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function () {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

// Place any jQuery/helper plugins in here.


/*!
 * Revealing Module Pattern with User Options Boilerplate
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
var myPublicationsSearch = (function () {

	'use strict';

	// Create global element references
	var doc = null;
	var pubContainer = null;
	var pubList = null;
	var pubItems = null;
	var itemCount = null;

	// Public APIs Object
	var publicAPIs = {};

	// Define option defaults
	var defaults = {
		publicationListContainerClassName: ""
	};
	var options;

	var pubFilterList = [];
	var filterClass = "wl-fltr";
	var filterShowClass = "show";
	var filterIDPrefix = "f-"
	var warningMessage = "Publication List Filter Warning: ";
	var errorMessage = "Publication List Filter Error: ";

	//
	// Methods
	//

	/*!
	 * Merge two or more objects together.
	 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
	 * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param   {Object}   objects  The objects to merge together
	 * @returns {Object}            Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					// If property is an object, merge properties
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < arguments.length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * A private method
	 */
	var cacheDom = function () {

		// Cache the whole document
		doc = $(document);

		// Cache the publication wrapper div
		pubContainer = doc.find('.' + options.publicationListContainerClassName);

		// Cache the list of items
		pubList = pubContainer.find("ul");

		// Also cache the list of items
		pubItems = pubList.children();

	};


	/**
	 * A private method
	 */
	var buildFilterList = function () {

		itemCount = pubList.children().length;

		var itemsWithNoFilterType = 0;

		// Walk through the List and Build the Filter UI
		for (var i = 0; i < itemCount; i++) {

			// Check if the item has an element with class name for the filter
			if (pubItems.eq(i).find("." + options.filter[0]).length) {

				// Check if the text for the element is already in the filter array
				if ( pubFilterList.indexOf(pubItems.eq(i).find("." + options.filter[0]).text() == -1)) {
					// Found
					pubFilterList.push( pubItems.eq(i).find("." + options.filter[0]).text() );
				}

			}
			else {
				itemsWithNoFilterType++;
			}

		}

		// Console Log Warning for the Empty Filter Count
		if ( itemsWithNoFilterType ) {
			console.log(warningMessage + itemsWithNoFilterType + " - items found that do not specify a filter value");
		}

		// If filters were found then we build the Filter UI
		if ( !Array.isArray(pubFilterList) || !pubFilterList.length) {
			throw("No elements were found with any filters set");
		}


	};

	/**
	 * A private method
	 */
	var buildFilterButtonHTML = function (btnID, btnText) {

		var htmlString = "<label " +
							"class='btn btn-secondary' > " +
							"<input " +
							"type='radio' " +
							"name='filter' " +
							"id='" + btnID + "' " +
							"autocomplete='off' >" +
							btnText +
							"</label>";
		return (htmlString);
	};


	/**
	 * A private method
	 */
	var buildSearchUI = function () {

		var searchUI = ""

		// Start with the wrapper div
		searchUI = "<div class='btn-group btn-group-toggle' data-toggle='buttons'>";

		// Add the Show All Options
		searchUI += buildFilterButtonHTML(filterIDPrefix + "all", "Show All" );

		// Loop through all of the filter options, adding a button for each
		for (var i = 0; i < pubFilterList.length; i++) {
			searchUI += buildFilterButtonHTML(filterIDPrefix + i.toString() , pubFilterList[i] );
		}
		// Close the wrapper div
		searchUI += "</div>"

		pubContainer.prepend( searchUI );



		/*
			// Build an array of different types dynamically
			console.log(pubFilterList);

			// Walk through the List and Build the Filter UI

			pubList.children().find("." + options.filter[0]).css( "background-color", "red" );

			//pubList.children().css( "background-color", "red" );

			//console.log (pubList.children().find("." + options.filter[0]).text());

			pubList.children().filter("." + options.filter[0]).css( "background-color", "red" );

			//console.log (pubList.children().length);

			//console.log(pubItems.jquery);
			//pubFilterList

			//console.log(pubItems.children().text());
		*/

	};

	/**
	 * A private method
	 */
	var bindEvents = function () {

		// Bind each filter button to the filter function
		pubContainer.find("[id^=" + filterIDPrefix + "]").on('change', filter.bind(this));

		/*
		// If the open button is clicked show the menu
		menuOpenButton.on('click', show.bind(this));

		// If the close button is clicked hide the menu
		menuCloseButton.on('click', hide.bind(this));

		// If the first focusable item is tabed on
		menuContainerFirstFocusable.on('keydown', tabKeyMenuFirstChildHandler.bind(this));

		// If the last focusable item is tabed on
		menuContainerLastFocusable.on('keydown', tabKeyMenuLastChildHandler.bind(this));
		*/

	};

	/**
	 * A private method
	 */
	var filter = function (e) {

		// Show all handler
		if ( e.target.id === (filterIDPrefix + "all" ))
		{
			// Add the Filter Show Class to all of the children
			pubItems.addClass( filterShowClass );
		}
		else {

			// Another filter button was clicked (not the show all button)

			// Find out which button was clicked and grab the array index
			var filterArrayIndex = parseInt(e.target.id.substring(filterIDPrefix.length), 10);

			// Walk through the List and ...
			for (var i = 0; i < itemCount; i++) {

				// Check if the item has an element with class name for the filter
				if (pubItems.eq(i).find("." + options.filter[0]).length) {

					console.log("Comparing two items: " +
						pubItems.eq(i).find("." +
						options.filter[0]).text() + " | with this | " +
						pubFilterList[filterArrayIndex]);


					// Check if the text for the element matches the current selected item
					if ( pubItems.eq(i).find("." + options.filter[0]).text() === pubFilterList[filterArrayIndex] ) {

						// Match found so add the Filter Show Class
						pubItems.eq(i).addClass(filterShowClass);
					}
					else {
						// No match found so remove the Filter Show Class
						pubItems.eq(i).removeClass(filterShowClass);
					}

				}
				else {
					// No type has been specified so hide the element anyway

					// Remove the Filter Show Class
					pubItems.eq(i).removeClass(filterShowClass);
				}
			}
		}
	}


	/**
	 * Walk through all of the items and add a class
	 * to help with annimations
	 */
	var setInitialState = function () {

		pubList.children().addClass(filterClass);
		pubList.children().addClass(filterShowClass);
	}

	/**
	 * A private method
	 */
	var validateContentEntry = function () {

		// Check if the wrapper class name was set by the user
		if (options.publicationListContainerClassName === "" ) {
			throw("List Wrapper Class has not been set by the user.");
		}

		// Check if the wrapper class exists in the document
		if (!$('.' + options.publicationListContainerClassName).length) {
			throw("No List Wrapper Class was found.")
		}
	}

	/**
	 * A public method
	 */
	publicAPIs.doSomething = function () {
		//somePrivateMethod();
		// Code goes here...
	};

	/**
	 * Another public method
	 */
	publicAPIs.init = function (settings) {

		// Merge options into defaults
		options = extend(defaults, settings || {});

		try {

			// Check Entry Point
			validateContentEntry();

			// Cache the dom and other elements
			cacheDom();

			// Build the filter list
			buildFilterList();

			// Add Search UI
			buildSearchUI();

			// Add default item class
			setInitialState();

			// Bind the event handlers
			bindEvents();

			// Hit the show all button


		}
		catch(e) {
			// Send the error message to the console window
			console.log(errorMessage + e);
		}
		finally {
			//code that will run after a try/catch block regardless of the outcome
		}
	};


	//
	// Return the Public APIs
	//
	return publicAPIs;

})();






/*!
 * Revealing Module Pattern with User Options Boilerplate
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
var myMobileMenu = (function () {

	'use strict';

	// Create global element references
	var wrapper = null;
	var page = null;
	var menuContainer = null;
	var menuOpenButton = null;
	var menuCloseButton = null;

	var menuContainerFirstFocusable = null;
	var menuContainerLastFocusable = null;

	// Public APIs Object
	var publicAPIs = {};


	// Define option defaults
	var defaults = {
		menuContainerClassName: ""
	};

	var options;


	//
	// Methods
	//

	/*!
	 * Merge two or more objects together.
	 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
	 * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param   {Object}   objects  The objects to merge together
	 * @returns {Object}            Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					// If property is an object, merge properties
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < arguments.length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * A private method
	 */
	var somePrivateMethod = function () {
		// Code goes here...
		console.log("Hello");

		console.log ("Options:" + options.menuContainerClassName);
	};

	/**
	 * A private method
	 */
	var cacheAndBuildDom = function () {

		if (options.menuContainerClassName === "" ) {
			throw("Menu Container Class has not been set");
		}

		// Cache the whole document
		wrapper = $(document);

		// Cache the menu wrapper div
		menuContainer = wrapper.find('.' + options.menuContainerClassName);

		// Add the Menu Open Button
		menuContainer.parent().append(
			"<div class=\"menuOpenButtonContainer\"><button class=\"btn menuOpenButton\" type=\"button\"><span class=\"sr-only\">Menu</span> " +
			"<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-icon\" viewBox=\"0 0 20 20\"><path d=\"M 3.314 4.8 h 13.372 c 0.41 0 0.743 -0.333 0.743 -0.743 c 0 -0.41 -0.333 -0.743 -0.743 -0.743 H 3.314 c -0.41 0 -0.743 0.333 -0.743 0.743 C 2.571 4.467 2.904 4.8 3.314 4.8 Z M 16.686 15.2 H 3.314 c -0.41 0 -0.743 0.333 -0.743 0.743 s 0.333 0.743 0.743 0.743 h 13.372 c 0.41 0 0.743 -0.333 0.743 -0.743 S 17.096 15.2 16.686 15.2 Z M 16.686 9.257 H 3.314 c -0.41 0 -0.743 0.333 -0.743 0.743 s 0.333 0.743 0.743 0.743 h 13.372 c 0.41 0 0.743 -0.333 0.743 -0.743 S 17.096 9.257 16.686 9.257 Z\"></path></svg>" +
			"</button></div>");

		// Add the Menu Close Button
		menuContainer.append(
			"<button class=\"btn btn-red menuCloseButton\" type=\"button\">Close</button>" + "</div>")

		// Cache the buttons
		menuOpenButton = wrapper.find('.menuOpenButton');
		menuCloseButton = wrapper.find('.menuCloseButton');

		// Cache the first and last focusable items on the menu to control tabing behaviour
		menuContainerFirstFocusable = menuContainer.find( 'select, input, textarea, button, a' ).filter( ':visible' ).first();
		menuContainerLastFocusable = menuContainer.find( 'select, input, textarea, button, a' ).filter( ':visible' ).last();

	};

	/**
	 * A private method
	 */
	var bindEvents = function () {

		// If the open button is clicked show the menu
		menuOpenButton.on('click', show.bind(this));

		// If the close button is clicked hide the menu
		menuCloseButton.on('click', hide.bind(this));

		// If the first focusable item is tabed on
		menuContainerFirstFocusable.on('keydown', tabKeyMenuFirstChildHandler.bind(this));

		// If the last focusable item is tabed on
		menuContainerLastFocusable.on('keydown', tabKeyMenuLastChildHandler.bind(this));

	};

	/**
	 * A private method
	 */
	var show = function () {
		menuContainer.addClass('open');
		// TODO this.page.addClass('noScroll');

		// Set focus after a delay to allow for the annimation
		window.setTimeout(setFocusAfterOpen.bind(this), 300);

		console.log("Mobile Menu: Open");

	};

	/**
	 * A private method
	 */
	var hide = function () {
		menuContainer.removeClass('open');
		//this.page.removeClass('noScroll');
		menuOpenButton.focus();

		console.log("Mobile Menu: Close");

	};

	/**
	 * A private method
	 */
	var tabKeyMenuFirstChildHandler = function (e) {
		if ( ( e.keyCode === 9 && e.shiftKey ) && (menuContainer.hasClass('open') === true) ) {

			e.preventDefault();

			menuContainerLastFocusable.focus();
		}
	};

	/**
	 * A private method
	 */
	var tabKeyMenuLastChildHandler = function (e) {
		if ( ( e.keyCode === 9 && !e.shiftKey ) && (menuContainer.hasClass('open') === true) ) {

			e.preventDefault();

			menuContainerFirstFocusable.focus();

		}
	};

	/**
	 * A private method
	 */
	var setFocusAfterOpen = function () {
		menuCloseButton.focus();
	};

	/**
	 * A public method
	 */
	publicAPIs.doSomething = function () {
		somePrivateMethod();
		// Code goes here...
	};

	/**
	 * Another public method
	 */
	publicAPIs.init = function (settings) {

		// Merge options into defaults
		options = extend(defaults, settings || {});

		try {

			// Cache the dom and other elements
			cacheAndBuildDom();

			// Bind the event handlers
			bindEvents();


		}
		catch(e) {
			// Send the error message to the console window
			console.log("Mobile Menu Plugin: " + e);
		}
		finally {
			//code that will run after a try/catch block regardless of the outcome
		}
	};


	//
	// Return the Public APIs
	//
	return publicAPIs;

})();
