---
---

(function() {

	// Show progress bar at all times
	Turbolinks.setProgressBarDelay(0);

	// Trigger animations on click
	$(".trigger").on("click", function(event) {
		// Stop default behavior
		event.preventDefault();
		// Get trigger, target elements and animation attribute value
		var $this = $(this);
		var $element = $($this.attr("href") || $this.data("target"));
		var show = $element.hasClass("hidden");
		var animation = show ? $element.data("animationIn") : $element.data("animationOut");

		// Show and hide modes
		if (show) {
			// Change class on trigger element
			$this.addClass("trigger--open");
			// Animate in classes for target element
			$element
				.removeClass("hidden")
				.addClass("animated " + animation);
		} else {
			// Change class on trigger
			$this.removeClass("trigger--open");
			// Animate out classes
			$element.addClass("animated " + animation);
		}

		// Delay then reset target element classes
		setTimeout(function() {
			$element.removeClass("animated " + animation);
			if (!show) {
				$element.addClass("hidden");
			}
		}, 500);
	});

	// Animate content out of view
	$("a").on("click", function(event) {
		// Stop default behavior
		event.preventDefault();
		// Get content $element and animation attribute value
		var $element = $("#site-content");
		var animation = $element.data("animationOut");
		var url = event.currentTarget.href;

		// Check that target url is not current browser url
		if (url === window.location.href) {
			return false;
		}

		// Check for animation
		if (animation) {
			// Animate content out of view
			$element.addClass("animated animated--fast " + animation);
			// Delay then manually trigger Turbolinks visit to allow animation to complete
			setTimeout(function() {
				Turbolinks.visit(event.currentTarget.href);
			}, 150);
		} else {
			Turbolinks.visit(event.currentTarget.href);
		}

		// Check if navbar is open close it
		if (!$("#site-navbar").hasClass("hidden")) {
			$("#site-navbar-trigger").trigger("click");
		}
	});

	// Animate content into view
	$(document).on("turbolinks:load", function(event) {
		// Get content element and animation attribute value
		var $element = $("#site-content");
		var animation = $element.data("animationIn");
		var url = event.currentTarget.URL.slice(window.location.origin.length);
		
		navigationCurrent = navigation.indexOf(url);
		navigationPrev = (navigationCurrent - 1);
		navigationNext = (navigationCurrent + 1);

		// Animate content into view
		if (animation) {
			$element.addClass("animated " + animation);
		}
	});

	// Create array from Jekyll site navigation
	var navigation = '{%- for item in site.menu -%}{%- if item.url -%}||{{ item.url | relative_url }}{%- endif -%}{%- endfor -%}'
		.substring(2)
		.split("||");
	var navigationCurrent = -1;
	var navigationPrev = -1;
	var navigationNext = navigation.length;

	// Keyboard navigation
	$(document).keydown(function(event) {
		switch(event.keyCode) {
			case 40:
				// console.log("arrow down");
				if (navigationNext !== navigation.length) {
					Turbolinks.visit(navigation[navigationNext]);
				}
				return false;
			case 38:
				// console.log("arrow up");
				if (navigationPrev !== -1) {
					Turbolinks.visit(navigation[navigationPrev]);
				}
				return false;
			case 37:
				// console.log("arrow left");
				if ($("#site-navbar").hasClass("hidden")) {
					$("#site-navbar-trigger").trigger("click");
				}
				return false;
			case 39:
				// console.log("arrow right");
				if (!$("#site-navbar").hasClass("hidden")) {
					$("#site-navbar-trigger").trigger("click");
				}
				return false;
			case 27:
				// console.log("escape");
				if (!$("#site-navbar").hasClass("hidden")) {
					$("#site-navbar-trigger").trigger("click");
				}
				return false;
			case 32:
				// console.log("space");
				$("#slide-trigger").trigger("click");
				return false;
		}
	});
})();
