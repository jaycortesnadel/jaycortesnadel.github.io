/* Carrd Site JS | carrd.co | License: MIT */

(function() {

	// Main.
		var	on = addEventListener,
			off = removeEventListener,
			$ = function(q) { return document.querySelector(q) },
			$$ = function(q) { return document.querySelectorAll(q) },
			$body = document.body,
			$inner = $('.inner'),
			client = (function() {
		
				var o = {
						browser: 'other',
						browserVersion: 0,
						os: 'other',
						osVersion: 0,
						mobile: false,
						canUse: null,
						flags: {
							lsdUnits: false,
						},
					},
					ua = navigator.userAgent,
					a, i;
		
				// browser, browserVersion.
					a = [
						[
							'firefox',
							/Firefox\/([0-9\.]+)/
						],
						[
							'edge',
							/Edge\/([0-9\.]+)/
						],
						[
							'safari',
							/Version\/([0-9\.]+).+Safari/
						],
						[
							'chrome',
							/Chrome\/([0-9\.]+)/
						],
						[
							'chrome',
							/CriOS\/([0-9\.]+)/
						],
						[
							'ie',
							/Trident\/.+rv:([0-9]+)/
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.browser = a[i][0];
							o.browserVersion = parseFloat(RegExp.$1);
		
							break;
		
						}
		
					}
		
				// os, osVersion.
					a = [
						[
							'ios',
							/([0-9_]+) like Mac OS X/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'ios',
							/CPU like Mac OS X/,
							function(v) { return 0 }
						],
						[
							'ios',
							/iPad; CPU/,
							function(v) { return 0 }
						],
						[
							'android',
							/Android ([0-9\.]+)/,
							null
						],
						[
							'mac',
							/Macintosh.+Mac OS X ([0-9_]+)/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'windows',
							/Windows NT ([0-9\.]+)/,
							null
						],
						[
							'undefined',
							/Undefined/,
							null
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.os = a[i][0];
							o.osVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
		
							break;
		
						}
		
					}
		
					// Hack: Detect iPads running iPadOS.
						if (o.os == 'mac'
						&&	('ontouchstart' in window)
						&&	(
		
							// 12.9"
								(screen.width == 1024 && screen.height == 1366)
							// 10.2"
								||	(screen.width == 834 && screen.height == 1112)
							// 9.7"
								||	(screen.width == 810 && screen.height == 1080)
							// Legacy
								||	(screen.width == 768 && screen.height == 1024)
		
						))
							o.os = 'ios';
		
				// mobile.
					o.mobile = (o.os == 'android' || o.os == 'ios');
		
				// canUse.
					var _canUse = document.createElement('div');
		
					o.canUse = function(property, value) {
		
						var style;
		
						// Get style.
							style = _canUse.style;
		
						// Property doesn't exist? Can't use it.
							if (!(property in style))
								return false;
		
						// Value provided?
							if (typeof value !== 'undefined') {
		
								// Assign value.
									style[property] = value;
		
								// Value is empty? Can't use it.
									if (style[property] == '')
										return false;
		
							}
		
						return true;
		
					};
		
				// flags.
					o.flags.lsdUnits = o.canUse('width', '100dvw');
		
				return o;
		
			}()),
			trigger = function(t) {
				dispatchEvent(new Event(t));
			},
			cssRules = function(selectorText) {
		
				var ss = document.styleSheets,
					a = [],
					f = function(s) {
		
						var r = s.cssRules,
							i;
		
						for (i=0; i < r.length; i++) {
		
							if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)
								(f)(r[i]);
							else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText)
								a.push(r[i]);
		
						}
		
					},
					x, i;
		
				for (i=0; i < ss.length; i++)
					f(ss[i]);
		
				return a;
		
			},
			thisHash = function() {
		
				var h = location.hash ? location.hash.substring(1) : null,
					a;
		
				// Null? Bail.
					if (!h)
						return null;
		
				// Query string? Move before hash.
					if (h.match(/\?/)) {
		
						// Split from hash.
							a = h.split('?');
							h = a[0];
		
						// Update hash.
							history.replaceState(undefined, undefined, '#' + h);
		
						// Update search.
							window.location.search = a[1];
		
					}
		
				// Prefix with "x" if not a letter.
					if (h.length > 0
					&&	!h.match(/^[a-zA-Z]/))
						h = 'x' + h;
		
				// Convert to lowercase.
					if (typeof h == 'string')
						h = h.toLowerCase();
		
				return h;
		
			},
			scrollToElement = function(e, style, duration) {
		
				var y, cy, dy,
					start, easing, offset, f;
		
				// Element.
		
					// No element? Assume top of page.
						if (!e)
							y = 0;
		
					// Otherwise ...
						else {
		
							offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
		
							switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
		
								case 'default':
								default:
		
									y = e.offsetTop + offset;
		
									break;
		
								case 'center':
		
									if (e.offsetHeight < window.innerHeight)
										y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2) + offset;
									else
										y = e.offsetTop - offset;
		
									break;
		
								case 'previous':
		
									if (e.previousElementSibling)
										y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset;
									else
										y = e.offsetTop + offset;
		
									break;
		
							}
		
						}
		
				// Style.
					if (!style)
						style = 'smooth';
		
				// Duration.
					if (!duration)
						duration = 750;
		
				// Instant? Just scroll.
					if (style == 'instant') {
		
						window.scrollTo(0, y);
						return;
		
					}
		
				// Get start, current Y.
					start = Date.now();
					cy = window.scrollY;
					dy = y - cy;
		
				// Set easing.
					switch (style) {
		
						case 'linear':
							easing = function (t) { return t };
							break;
		
						case 'smooth':
							easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
							break;
		
					}
		
				// Scroll.
					f = function() {
		
						var t = Date.now() - start;
		
						// Hit duration? Scroll to y and finish.
							if (t >= duration)
								window.scroll(0, y);
		
						// Otherwise ...
							else {
		
								// Scroll.
									window.scroll(0, cy + (dy * easing(t / duration)));
		
								// Repeat.
									requestAnimationFrame(f);
		
							}
		
					};
		
					f();
		
			},
			scrollToTop = function() {
		
				// Scroll to top.
					scrollToElement(null);
		
			},
			loadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of unloaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Load.
								a[i].contentWindow.location.replace(a[i].dataset.src);
		
							// Save initial src.
								a[i].dataset.initialSrc = a[i].dataset.src;
		
							// Mark as loaded.
								a[i].dataset.src = '';
		
						}
		
				// Video.
		
					// Get list of videos (autoplay).
						a = parent.querySelectorAll('video[autoplay]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Play if paused.
								if (a[i].paused)
									a[i].play();
		
						}
		
				// Autofocus.
		
					// Get first element with data-autofocus attribute.
						e = parent.querySelector('[data-autofocus="1"]');
		
					// Determine type.
						x = e ? e.tagName : null;
		
						switch (x) {
		
							case 'FORM':
		
								// Get first input.
									e = e.querySelector('.field input, .field select, .field textarea');
		
								// Found? Focus.
									if (e)
										e.focus();
		
								break;
		
							default:
								break;
		
						}
		
			},
			unloadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of loaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src=""]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Don't unload? Skip.
								if (a[i].dataset.srcUnload === '0')
									continue;
		
							// Mark as unloaded.
		
								// IFRAME was previously loaded by loadElements()? Use initialSrc.
									if ('initialSrc' in a[i].dataset)
										a[i].dataset.src = a[i].dataset.initialSrc;
		
								// Otherwise, just use src.
									else
										a[i].dataset.src = a[i].src;
		
							// Unload.
								a[i].contentWindow.location.replace('about:blank');
		
						}
		
				// Video.
		
					// Get list of videos.
						a = parent.querySelectorAll('video');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Pause if playing.
								if (!a[i].paused)
									a[i].pause();
		
						}
		
				// Autofocus.
		
					// Get focused element.
						e = $(':focus');
		
					// Found? Blur.
						if (e)
							e.blur();
		
		
			};
		
			// Expose scrollToElement.
				window._scrollToTop = scrollToTop;
	
	// "On Load" animation.
		// Create load handler.
			var loadHandler = function() {
				setTimeout(function() {
		
					// Unmark as loading.
						$body.classList.remove('is-loading');
		
					// Mark as playing.
						$body.classList.add('is-playing');
		
					// Wait for animation complete.
						setTimeout(function() {
		
							// Unmark as playing.
								$body.classList.remove('is-playing');
		
							// Mark as ready.
								$body.classList.add('is-ready');
		
						}, 1000);
		
				}, 100);
			};
		
		// Load event.
			on('load', loadHandler);
	
	// Sections.
		(function() {
		
			var initialSection, initialScrollPoint, initialId,
				header, footer, name, hideHeader, hideFooter, disableAutoScroll,
				h, e, ee, k,
				locked = false,
				scrollPointParent = function(target) {
		
					while (target) {
		
						if (target.parentElement
						&&	target.parentElement.tagName == 'SECTION')
							break;
		
						target = target.parentElement;
		
					}
		
					return target;
		
				},
				scrollPointSpeed = function(scrollPoint) {
		
					let x = parseInt(scrollPoint.dataset.scrollSpeed);
		
					switch (x) {
		
						case 5:
							return 250;
		
						case 4:
							return 500;
		
						case 3:
							return 750;
		
						case 2:
							return 1000;
		
						case 1:
							return 1250;
		
						default:
							break;
		
					}
		
					return 750;
		
				},
				doNextScrollPoint = function(event) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find next scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doPreviousScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find previous scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doFirstScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find first scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doLastScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find last scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doNextSection = function() {
		
					var section;
		
					section = $('#main > .inner > section.active').nextElementSibling;
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + section.id.replace(/-section$/, '');
		
				},
				doPreviousSection = function() {
		
					var section;
		
					section = $('#main > .inner > section.active').previousElementSibling;
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + (section.matches(':first-child') ? '' : section.id.replace(/-section$/, ''));
		
				},
				doFirstSection = function() {
		
					var section;
		
					section = $('#main > .inner > section:first-of-type');
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + section.id.replace(/-section$/, '');
		
				},
				doLastSection = function() {
		
					var section;
		
					section = $('#main > .inner > section:last-of-type');
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + section.id.replace(/-section$/, '');
		
				},
				resetSectionChangeElements = function(section) {
		
					var ee, e, x;
		
					// Get elements with data-reset-on-section-change attribute.
						ee = section.querySelectorAll('[data-reset-on-section-change="1"]');
		
					// Step through elements.
						for (e of ee) {
		
							// Determine type.
								x = e ? e.tagName : null;
		
								switch (x) {
		
									case 'FORM':
		
										// Reset.
											e.reset();
		
										break;
		
									default:
										break;
		
								}
		
						}
		
				},
				activateSection = function(section, scrollPoint) {
		
					var sectionHeight, currentSection, currentSectionHeight,
						name, hideHeader, hideFooter, disableAutoScroll,
						ee, k;
		
					// Section already active?
						if (!section.classList.contains('inactive')) {
		
							// Get options.
								name = (section ? section.id.replace(/-section$/, '') : null);
								disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
							// Scroll to scroll point (if applicable).
								if (scrollPoint)
									scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
							// Otherwise, just scroll to top (if not disabled for this section).
								else if (!disableAutoScroll)
									scrollToElement(null);
		
							// Bail.
								return false;
		
						}
		
					// Otherwise, activate it.
						else {
		
							// Lock.
								locked = true;
		
							// Clear index URL hash.
								if (location.hash == '#home')
									history.replaceState(null, null, '#');
		
						// Get options.
							name = (section ? section.id.replace(/-section$/, '') : null);
							hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
							hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
							disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
						// Deactivate current section.
		
							// Hide header and/or footer (if necessary).
		
								// Header.
									if (header && hideHeader) {
		
										header.classList.add('hidden');
		
										setTimeout(function() {
											header.style.display = 'none';
										}, 187.5);
		
									}
		
								// Footer.
									if (footer && hideFooter) {
		
										footer.classList.add('hidden');
		
										setTimeout(function() {
											footer.style.display = 'none';
										}, 187.5);
		
									}
		
							// Deactivate.
								currentSection = $('#main > .inner > section:not(.inactive)');
		
								if (currentSection) {
		
									// Get current height.
										currentSectionHeight = currentSection.offsetHeight;
		
									// Deactivate.
										currentSection.classList.add('inactive');
		
									// Unload elements.
										unloadElements(currentSection);
		
									// Reset section change elements.
										resetSectionChangeElements(currentSection);
		
										// Hide.
											setTimeout(function() {
												currentSection.style.display = 'none';
												currentSection.classList.remove('active');
											}, 187.5);
		
									}
		
							// Activate target section.
								setTimeout(function() {
		
									// Show header and/or footer (if necessary).
		
										// Header.
											if (header && !hideHeader) {
		
												header.style.display = '';
		
												setTimeout(function() {
													header.classList.remove('hidden');
												}, 0);
		
											}
		
										// Footer.
											if (footer && !hideFooter) {
		
												footer.style.display = '';
		
												setTimeout(function() {
													footer.classList.remove('hidden');
												}, 0);
		
											}
		
									// Activate.
		
										// Show.
											section.style.display = '';
		
										// Trigger 'resize' event.
											trigger('resize');
		
										// Scroll to top (if not disabled for this section).
											if (!disableAutoScroll)
												scrollToElement(null, 'instant');
		
										// Get target height.
											sectionHeight = section.offsetHeight;
		
										// Set target heights.
											if (sectionHeight > currentSectionHeight) {
		
												section.style.maxHeight = currentSectionHeight + 'px';
												section.style.minHeight = '0';
		
											}
											else {
		
												section.style.maxHeight = '';
												section.style.minHeight = currentSectionHeight + 'px';
		
											}
		
										// Delay.
											setTimeout(function() {
		
												// Activate.
													section.classList.remove('inactive');
													section.classList.add('active');
		
												// Temporarily restore target heights.
													section.style.minHeight = sectionHeight + 'px';
													section.style.maxHeight = sectionHeight + 'px';
		
												// Delay.
													setTimeout(function() {
		
														// Turn off transitions.
															section.style.transition = 'none';
		
														// Clear target heights.
															section.style.minHeight = '';
															section.style.maxHeight = '';
		
														// Load elements.
															loadElements(section);
		
													 	// Scroll to scroll point (if applicable).
													 		if (scrollPoint)
																scrollToElement(scrollPoint, 'instant');
		
														// Delay.
															setTimeout(function() {
		
																// Turn on transitions.
																	section.style.transition = '';
		
																// Unlock.
																	locked = false;
		
															}, 75);
		
													}, 375 + 187.5);
		
											}, 75);
		
								}, 187.5);
		
						}
		
				},
				sections = {};
		
			// Expose doNextScrollPoint, doPreviousScrollPoint, doFirstScrollPoint, doLastScrollPoint.
				window._nextScrollPoint = doNextScrollPoint;
				window._previousScrollPoint = doPreviousScrollPoint;
				window._firstScrollPoint = doFirstScrollPoint;
				window._lastScrollPoint = doLastScrollPoint;
		
			// Expose doNextSection, doPreviousSection, doFirstSection, doLastSection.
				window._nextSection = doNextSection;
				window._previousSection = doPreviousSection;
				window._firstSection = doFirstSection;
				window._lastSection = doLastSection;
		
			// Override exposed scrollToTop.
				window._scrollToTop = function() {
		
					var section, id;
		
					// Scroll to top.
						scrollToElement(null);
		
					// Section active?
						if (!!(section = $('section.active'))) {
		
							// Get name.
								id = section.id.replace(/-section$/, '');
		
								// Index section? Clear.
									if (id == 'home')
										id = '';
		
							// Reset hash to section name (via new state).
								history.pushState(null, null, '#' + id);
		
						}
		
				};
		
			// Initialize.
		
				// Set scroll restoration to manual.
					if ('scrollRestoration' in history)
						history.scrollRestoration = 'manual';
		
				// Header, footer.
					header = $('#header');
					footer = $('#footer');
		
				// Show initial section.
		
					// Determine target.
						h = thisHash();
		
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								h = null;
		
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
		
								initialScrollPoint = e;
								initialSection = initialScrollPoint.parentElement;
								initialId = initialSection.id;
		
							}
		
						// Section.
							else if (e = $('#' + (h ? h : 'home') + '-section')) {
		
								initialScrollPoint = null;
								initialSection = e;
								initialId = initialSection.id;
		
							}
		
						// Missing initial section?
							if (!initialSection) {
		
								// Default to index.
									initialScrollPoint = null;
									initialSection = $('#' + 'home' + '-section');
									initialId = initialSection.id;
		
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
		
							}
		
					// Get options.
						name = (h ? h : 'home');
						hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
						hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
						disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
					// Deactivate all sections (except initial).
		
						// Initially hide header and/or footer (if necessary).
		
							// Header.
								if (header && hideHeader) {
		
									header.classList.add('hidden');
									header.style.display = 'none';
		
								}
		
							// Footer.
								if (footer && hideFooter) {
		
									footer.classList.add('hidden');
									footer.style.display = 'none';
		
								}
		
						// Deactivate.
							ee = $$('#main > .inner > section:not([id="' + initialId + '"])');
		
							for (k = 0; k < ee.length; k++) {
		
								ee[k].className = 'inactive';
								ee[k].style.display = 'none';
		
							}
		
					// Activate initial section.
						initialSection.classList.add('active');
		
					// Load elements.
						loadElements(initialSection);
		
						if (header)
							loadElements(header);
		
						if (footer)
							loadElements(footer);
		
					// Scroll to top (if not disabled for this section).
						if (!disableAutoScroll)
							scrollToElement(null, 'instant');
		
				// Load event.
					on('load', function() {
		
						// Scroll to initial scroll point (if applicable).
					 		if (initialScrollPoint)
								scrollToElement(initialScrollPoint, 'instant');
		
					});
		
			// Hashchange event.
				on('hashchange', function(event) {
		
					var section, scrollPoint,
						h, e;
		
					// Lock.
						if (locked)
							return false;
		
					// Determine target.
						h = thisHash();
		
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								return false;
		
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
		
								scrollPoint = e;
								section = scrollPoint.parentElement;
		
							}
		
						// Section.
							else if (e = $('#' + (h ? h : 'home') + '-section')) {
		
								scrollPoint = null;
								section = e;
		
							}
		
						// Anything else.
							else {
		
								// Default to index.
									scrollPoint = null;
									section = $('#' + 'home' + '-section');
		
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
		
							}
		
					// No section? Bail.
						if (!section)
							return false;
		
					// Activate section.
						activateSection(section, scrollPoint);
		
					return false;
		
				});
		
				// Hack: Allow hashchange to trigger on click even if the target's href matches the current hash.
					on('click', function(event) {
		
						var t = event.target,
							tagName = t.tagName.toUpperCase(),
							scrollPoint, section;
		
						// Find real target.
							switch (tagName) {
		
								case 'IMG':
								case 'SVG':
								case 'USE':
								case 'U':
								case 'STRONG':
								case 'EM':
								case 'CODE':
								case 'S':
								case 'MARK':
								case 'SPAN':
		
									// Find ancestor anchor tag.
										while ( !!(t = t.parentElement) )
											if (t.tagName == 'A')
												break;
		
									// Not found? Bail.
										if (!t)
											return;
		
									break;
		
								default:
									break;
		
							}
		
						// Target is an anchor *and* its href is a hash?
							if (t.tagName == 'A'
							&&	t.getAttribute('href') !== null
							&&	t.getAttribute('href').substr(0, 1) == '#') {
		
								// Hash matches an invisible scroll point?
									if (!!(scrollPoint = $('[data-scroll-id="' + t.hash.substr(1) + '"][data-scroll-invisible="1"]'))) {
		
										// Prevent default.
											event.preventDefault();
		
										// Get section.
											section = scrollPoint.parentElement;
		
										// Section is inactive?
											if (section.classList.contains('inactive')) {
		
												// Reset hash to section name (via new state).
													history.pushState(null, null, '#' + section.id.replace(/-section$/, ''));
		
												// Activate section.
													activateSection(section, scrollPoint);
		
											}
		
										// Otherwise ...
											else {
		
												// Scroll to scroll point.
													scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
											}
		
									}
		
								// Hash matches the current hash?
									else if (t.hash == window.location.hash) {
		
										// Prevent default.
											event.preventDefault();
		
										// Replace state with '#'.
											history.replaceState(undefined, undefined, '#');
		
										// Replace location with target hash.
											location.replace(t.hash);
		
									}
		
							}
		
					});
		
		})();
	
	// Browser hacks.
		// Init.
			var style, sheet, rule;
		
			// Create <style> element.
				style = document.createElement('style');
				style.appendChild(document.createTextNode(''));
				document.head.appendChild(style);
		
			// Get sheet.
				sheet = style.sheet;
		
		// Mobile.
			if (client.mobile) {
		
				// Prevent overscrolling on Safari/other mobile browsers.
				// 'vh' units don't factor in the heights of various browser UI elements so our page ends up being
				// a lot taller than it needs to be (resulting in overscroll and issues with vertical centering).
					(function() {
		
						// Lsd units available?
							if (client.flags.lsdUnits) {
		
								document.documentElement.style.setProperty('--viewport-height', '100svh');
								document.documentElement.style.setProperty('--background-height', '100lvh');
		
							}
		
						// Otherwise, use innerHeight hack.
							else {
		
								var f = function() {
									document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
									document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
								};
		
								on('load', f);
								on('orientationchange', function() {
		
									// Update after brief delay.
										setTimeout(function() {
											(f)();
										}, 100);
		
								});
		
							}
		
					})();
		
			}
		
		// Android.
			if (client.os == 'android') {
		
				// Prevent background "jump" when address bar shrinks.
				// Specifically, this fix forces the background pseudoelement to a fixed height based on the physical
				// screen size instead of relying on "vh" (which is subject to change when the scrollbar shrinks/grows).
					(function() {
		
						// Insert and get rule.
							sheet.insertRule('body::after { }', 0);
							rule = sheet.cssRules[0];
		
						// Event.
							var f = function() {
								rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
							};
		
							on('load', f);
							on('orientationchange', f);
							on('touchmove', f);
		
					})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
		
		// iOS.
			else if (client.os == 'ios') {
		
				// <=11: Prevent white bar below background when address bar shrinks.
				// For some reason, simply forcing GPU acceleration on the background pseudoelement fixes this.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body::after { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = '-webkit-transform: scale(1.0)';
		
						})();
		
				// <=11: Prevent white bar below background when form inputs are focused.
				// Fixed-position elements seem to lose their fixed-ness when this happens, which is a problem
				// because our backgrounds fall into this category.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body.ios-focus-fix::before { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = 'height: calc(100% + 60px)';
		
							// Add event listeners.
								on('focus', function(event) {
									$body.classList.add('ios-focus-fix');
								}, true);
		
								on('blur', function(event) {
									$body.classList.remove('ios-focus-fix');
								}, true);
		
						})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
	
	// Slideshow backgrounds.
		/**
		 * Slideshow background.
		 * @param {string} id ID.
		 * @param {object} settings Settings.
		 */
		function slideshowBackground(id, settings) {
		
			var _this = this;
		
			// Settings.
				if (!('images' in settings)
				||	!('target' in settings))
					return;
		
				this.id = id;
				this.wait = ('wait' in settings ? settings.wait : 0);
				this.defer = ('defer' in settings ? settings.defer : false);
				this.navigation = ('navigation' in settings ? settings.navigation : false);
				this.order = ('order' in settings ? settings.order : 'default');
				this.preserveImageAspectRatio = ('preserveImageAspectRatio' in settings ? settings.preserveImageAspectRatio : false);
				this.transition = ('transition' in settings ? settings.transition : { style: 'crossfade', speed: 1000, delay: 6000, resume: 12000 });
				this.images = settings.images;
		
			// Properties.
				this.preload = true;
				this.locked = false;
				this.$target = $(settings.target);
				this.$wrapper = ('wrapper' in settings ? $(settings.wrapper) : null);
				this.pos = 0;
				this.lastPos = 0;
				this.$slides = [];
				this.img = document.createElement('img');
				this.preloadTimeout = null;
				this.resumeTimeout = null;
				this.transitionInterval = null;
		
			// Using preserveImageAspectRatio and transition style is crossfade? Force to regular fade.
				if (this.preserveImageAspectRatio
				&&	this.transition.style == 'crossfade')
					this.transition.style = 'fade';
		
			// Adjust transition delay (if in use).
				if (this.transition.delay !== false)
					switch (this.transition.style) {
		
						case 'crossfade':
							this.transition.delay = Math.max(this.transition.delay, this.transition.speed * 2);
							break;
		
		
						case 'fade':
							this.transition.delay = Math.max(this.transition.delay, this.transition.speed * 3);
							break;
		
						case 'instant':
						default:
							break;
		
					}
		
			// Force navigation to false if using random order or a wrapper wasn't provided.
				if (!this.$wrapper
				||	this.order == 'random')
					this.navigation = false;
		
			// Defer?
				if (this.defer) {
		
					// Add to scroll events.
						scrollEvents.add({
							element: this.$target,
							enter: function() {
								_this.preinit();
							}
						});
		
				}
		
			// Otherwise ...
				else {
		
					// Preinit immediately.
						this.preinit();
		
				}
		
		};
		
			/**
			 * Gets the speed class name for a given speed.
			 * @param {int} speed Speed.
			 * @return {string} Speed class name.
			 */
			slideshowBackground.prototype.speedClassName = function(speed) {
		
				switch (speed) {
		
					case 1:
						return 'slow';
		
					default:
					case 2:
						return 'normal';
		
					case 3:
						return 'fast';
		
				}
		
			};
		
			/**
			 * Pre-initializes the slideshow background.
			 */
			slideshowBackground.prototype.preinit = function() {
		
				var _this = this;
		
				// Preload?
					if (this.preload) {
		
						// Mark as loading (after delay).
							this.preloadTimeout = setTimeout(function() {
								_this.$target.classList.add('is-loading');
							}, this.transition.speed);
		
						// Init after a delay (to prevent load events from holding up main load event).
							setTimeout(function() {
								_this.init();
							}, 0);
		
					}
		
				// Otherwise ...
					else {
		
						// Init immediately.
							this.init();
		
					}
		
			};
		
			/**
			 * Initializes the slideshow background.
			 */
			slideshowBackground.prototype.init = function() {
		
				var	_this = this,
					loaded = 0,
					hasLinks = false,
					dragStart = null,
					dragEnd = null,
					$slide, intervalId, i;
		
				// Apply classes.
					this.$target.classList.add('slideshow-background');
					this.$target.classList.add(this.transition.style);
		
				// Create navigation (if enabled).
					if (this.navigation) {
		
						// Next arrow (if allowed).
							this.$next = document.createElement('div');
								this.$next.classList.add('nav', 'next');
								this.$next.addEventListener('click', function(event) {
		
									// Stop transitioning.
										_this.stopTransitioning();
		
									// Show next slide.
										_this.next();
		
								});
								this.$wrapper.appendChild(this.$next);
		
						// Previous arrow (if allowed).
							this.$previous = document.createElement('div');
								this.$previous.classList.add('nav', 'previous');
								this.$previous.addEventListener('click', function(event) {
		
									// Stop transitioning.
										_this.stopTransitioning();
		
									// Show previous slide.
										_this.previous();
		
								});
								this.$wrapper.appendChild(this.$previous);
		
						// Swiping.
							this.$wrapper.addEventListener('touchstart', function(event) {
		
								// More than two touches? Bail.
									if (event.touches.length > 1)
										return;
		
								// Record drag start.
									dragStart = {
										x: event.touches[0].clientX,
										y: event.touches[0].clientY
									};
		
							});
		
							this.$wrapper.addEventListener('touchmove', function(event) {
		
								var dx, dy;
		
								// No drag start, or more than two touches? Bail.
									if (!dragStart
									||	event.touches.length > 1)
										return;
		
								// Record drag end.
									dragEnd = {
										x: event.touches[0].clientX,
										y: event.touches[0].clientY
									};
		
								// Determine deltas.
									dx = dragStart.x - dragEnd.x;
									dy = dragStart.y - dragEnd.y;
		
								// Doesn't exceed threshold? Bail.
									if (Math.abs(dx) < 50)
										return;
		
								// Prevent default.
									event.preventDefault();
		
								// Positive value? Move to next.
									if (dx > 0) {
		
										// Stop transitioning.
											_this.stopTransitioning();
		
										// Show next slide.
											_this.next();
		
									}
		
								// Negative value? Move to previous.
									else if (dx < 0) {
		
										// Stop transitioning.
											_this.stopTransitioning();
		
										// Show previous slide.
											_this.previous();
		
									}
		
							});
		
							this.$wrapper.addEventListener('touchend', function(event) {
		
								// Clear drag start, end.
									dragStart = null;
									dragEnd = null;
		
							});
		
					}
		
				// Create slides.
					for (i=0; i < this.images.length; i++) {
		
						// Preload?
							if (this.preload) {
		
								// Create img.
									this.$img = document.createElement('img');
										this.$img.src = this.images[i].src;
										this.$img.addEventListener('load', function(event) {
		
											// Increment loaded count.
												loaded++;
		
										});
		
							}
		
						// Create slide.
							$slide = document.createElement('div');
								$slide.style.backgroundImage = 'url(\'' + this.images[i].src + '\')';
								$slide.style.backgroundPosition = this.images[i].position;
								$slide.style.backgroundRepeat = 'no-repeat';
								$slide.style.backgroundSize = (this.preserveImageAspectRatio ? 'contain' : 'cover');
								$slide.setAttribute('role', 'img');
								$slide.setAttribute('aria-label', this.images[i].caption);
								this.$target.appendChild($slide);
		
							// Apply motion classes (if applicable).
								if (this.images[i].motion != 'none') {
		
									$slide.classList.add(this.images[i].motion);
									$slide.classList.add(this.speedClassName(this.images[i].speed));
		
								}
		
							// Link URL provided?
								if ('linkUrl' in this.images[i]) {
		
									// Set cursor style to pointer.
										$slide.style.cursor = 'pointer';
		
									// Set linkUrl property on slide.
										$slide._linkUrl = this.images[i].linkUrl;
		
									// Mark hasLinks as true.
										hasLinks = true;
		
								}
		
						// Add to array.
							this.$slides.push($slide);
		
					}
		
				// Has links? Add click event listener to target.
					if (hasLinks)
						this.$target.addEventListener('click', function(event) {
		
							var slide;
		
							// Target doesn't have linkUrl property? Bail.
								if (!('_linkUrl' in event.target))
									return;
		
							// Get slide.
								slide = event.target;
		
							// Onclick provided?
								if ('onclick' in slide._linkUrl) {
		
									// Run handler.
										(slide._linkUrl.onclick)(event);
		
									return;
		
								}
		
							// Href provided?
								if ('href' in slide._linkUrl) {
		
									// URL is a hash URL?
										if (slide._linkUrl.href.charAt(0) == '#') {
		
											// Go to hash URL.
												window.location.href = slide._linkUrl.href;
		
											return;
		
										}
		
									// Target provided and it's "_blank"? Open URL in new tab.
										if ('target' in slide._linkUrl
										&&	slide._linkUrl.target == '_blank')
											window.open(slide._linkUrl.href);
		
									// Otherwise, just go to URL.
										else
											window.location.href = slide._linkUrl.href;
		
								}
		
						});
		
				// Determine starting position.
					switch (this.order) {
		
						case 'random':
		
							// Randomly pick starting position.
								this.pos = (Math.ceil(Math.random() * this.$slides.length) - 1);
		
							break;
		
						case 'reverse':
		
							// Start at end.
								this.pos = this.$slides.length - 1;
		
							break;
		
						case 'default':
						default:
		
							// Start at beginning.
								this.pos = 0;
		
							break;
		
					}
		
					// Update last position.
						this.lastPos = this.pos;
		
				// Preload?
					if (this.preload)
						intervalId = setInterval(function() {
		
							// All images loaded?
								if (loaded >= _this.images.length) {
		
									// Stop checking.
										clearInterval(intervalId);
		
									// Clear loading.
										clearTimeout(_this.preloadTimeout);
										_this.$target.classList.remove('is-loading');
		
									// Start.
										_this.start();
		
								}
		
						}, 250);
		
				// Otherwise ...
					else {
		
						// Start.
							this.start();
		
					}
		
			};
		
			/**
			 * Moves to an adjacent slide.
			 * @param {int} direction Direction (1 = forwards, -1 = backwards).
			 */
			slideshowBackground.prototype.move = function(direction) {
		
				var pos, order;
		
				// Determine effective order based on chosen direction.
					switch (direction) {
		
						// Forwards: use order as-is.
							case 1:
								order = this.order;
								break;
		
						// Backwards: inverse order.
							case -1:
								switch (this.order) {
		
									case 'random':
										order = 'random';
										break;
		
									case 'reverse':
										order = 'default';
										break;
		
									case 'default':
									default:
										order = 'reverse';
										break;
		
								}
		
								break;
		
						// Anything else: bail.
							default:
								return;
		
					}
		
				// Determine new position based on effective order.
					switch (order) {
		
						case 'random':
		
							// Randomly pick position.
								for (;;) {
		
									pos = (Math.ceil(Math.random() * this.$slides.length) - 1);
		
									// Didn't pick current position? Stop.
										if (pos != this.pos)
											break;
		
								}
		
							break;
		
						case 'reverse':
		
							// Decrement position.
								pos = this.pos - 1;
		
							// Wrap to end if necessary.
								if (pos < 0)
									pos = this.$slides.length - 1;
		
							break;
		
						case 'default':
						default:
		
							// Increment position.
								pos = this.pos + 1;
		
							// Wrap to beginning if necessary.
								if (pos >= this.$slides.length)
									pos = 0;
		
							break;
		
					}
		
				// Show pos.
					this.show(pos);
		
			};
		
			/**
			 * Moves to next slide.
			 */
			slideshowBackground.prototype.next = function() {
		
				// Move forwards.
					this.move(1);
		
			};
		
			/**
			 * Moves to previous slide.
			 */
			slideshowBackground.prototype.previous = function() {
		
				// Move backwards.
					this.move(-1);
		
			};
		
			/**
			 * Shows a slide.
			 * @param {int} pos Position.
			 */
			slideshowBackground.prototype.show = function(pos) {
		
				var _this = this;
		
				// Locked? Bail.
					if (this.locked)
						return;
		
				// Capture current position.
					this.lastPos = this.pos;
		
				// Switch to new position.
					this.pos = pos;
		
				// Perform transition.
					switch (this.transition.style) {
		
						case 'instant':
		
							// Swap top slides.
								this.$slides[this.lastPos].classList.remove('top');
								this.$slides[this.pos].classList.add('top');
		
							// Show current slide.
								this.$slides[this.pos].classList.add('visible');
		
							// Start playing current slide.
								this.$slides[this.pos].classList.add('is-playing');
		
							// Hide last slide.
								this.$slides[this.lastPos].classList.remove('visible');
								this.$slides[this.lastPos].classList.remove('initial');
		
							// Stop playing last slide.
								this.$slides[this.lastPos].classList.remove('is-playing');
		
							break;
		
						case 'crossfade':
		
							// Lock.
								this.locked = true;
		
							// Swap top slides.
								this.$slides[this.lastPos].classList.remove('top');
								this.$slides[this.pos].classList.add('top');
		
							// Show current slide.
								this.$slides[this.pos].classList.add('visible');
		
							// Start playing current slide.
								this.$slides[this.pos].classList.add('is-playing');
		
							// Wait for fade-in to finish.
								setTimeout(function() {
		
									// Hide last slide.
										_this.$slides[_this.lastPos].classList.remove('visible');
										_this.$slides[_this.lastPos].classList.remove('initial');
		
									// Stop playing last slide.
										_this.$slides[_this.lastPos].classList.remove('is-playing');
		
									// Unlock.
										_this.locked = false;
		
								}, this.transition.speed);
		
							break;
		
						case 'fade':
		
							// Lock.
								this.locked = true;
		
							// Hide last slide.
								this.$slides[this.lastPos].classList.remove('visible');
		
							// Wait for fade-out to finish.
								setTimeout(function() {
		
									// Stop playing last slide.
										_this.$slides[_this.lastPos].classList.remove('is-playing');
		
									// Swap top slides.
										_this.$slides[_this.lastPos].classList.remove('top');
										_this.$slides[_this.pos].classList.add('top');
		
									// Start playing current slide.
										_this.$slides[_this.pos].classList.add('is-playing');
		
									// Show current slide.
										_this.$slides[_this.pos].classList.add('visible');
		
									// Unlock.
										_this.locked = false;
		
								}, this.transition.speed);
		
							break;
		
						default:
							break;
		
					}
		
			};
		
			/**
			 * Starts the slideshow.
			 */
			slideshowBackground.prototype.start = function() {
		
				var _this = this;
		
				// Prepare initial slide.
					this.$slides[_this.pos].classList.add('visible');
					this.$slides[_this.pos].classList.add('top');
					this.$slides[_this.pos].classList.add('initial');
					this.$slides[_this.pos].classList.add('is-playing');
		
				// Single slide? Bail.
					if (this.$slides.length == 1)
						return;
		
				// Wait (if needed).
					setTimeout(function() {
		
						// Start transitioning.
							_this.startTransitioning();
		
					}, this.wait);
		
			};
		
			/**
			 * Starts transitioning.
			 */
			slideshowBackground.prototype.startTransitioning = function() {
		
				var _this = this;
		
				// Delay not in use? Bail.
					if (this.transition.delay === false)
						return;
		
				// Start transition interval.
					this.transitionInterval = setInterval(function() {
		
						// Move to next slide.
							_this.next();
		
					}, this.transition.delay);
		
			};
		
			/**
			 * Stops transitioning.
			 */
			slideshowBackground.prototype.stopTransitioning = function() {
		
				var _this = this;
		
				// Clear transition interval.
					clearInterval(this.transitionInterval);
		
				// Resume in use?
					if (this.transition.resume !== false) {
		
						// Clear resume timeout (if one already exists).
							clearTimeout(this.resumeTimeout);
		
						// Set resume timeout.
							this.resumeTimeout = setTimeout(function() {
		
								// Start transitioning.
									_this.startTransitioning();
		
							}, this.transition.resume);
		
					}
		
			};
	
	// Initialize background.
		(function() {
		
			var $bg = document.createElement('div');
				$bg.id = 'bg';
				$body.insertBefore($bg, $body.firstChild);
		
			new slideshowBackground('bg', {
				target: '#bg',
				wait: 1000,
				order: 'default',
				transition: {
					style: 'crossfade',
					speed: 1000,
					delay: 6000,
				},
				images: [
					{
						src: 'assets/images/bg-4237fd3f.jpg',
						position: 'center',
						motion: 'none',
						speed: 2,
						caption: 'Untitled',
					},
					{
						src: 'assets/images/bg-b8cefa93.jpg',
						position: 'center',
						motion: 'none',
						speed: 2,
						caption: 'Untitled',
					},
					{
						src: 'assets/images/bg-2a35b9fa.jpg',
						position: 'center',
						motion: 'none',
						speed: 2,
						caption: 'Untitled',
					},
					{
						src: 'assets/images/bg-632c0704.jpg',
						position: 'center',
						motion: 'none',
						speed: 2,
						caption: 'Untitled',
					},
					{
						src: 'assets/images/bg-8c04a69c.jpg',
						position: 'center',
						motion: 'none',
						speed: 2,
						caption: 'Untitled',
					},
				]
			});
		
		})();

})();