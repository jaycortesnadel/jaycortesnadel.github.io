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
			escapeHtml = function(s) {
		
				// Blank, null, or undefined? Return blank string.
					if (s === ''
					||	s === null
					||	s === undefined)
						return '';
		
				// Escape HTML characters.
					var a = {
						'&': '&amp;',
						'<': '&lt;',
						'>': '&gt;',
						'"': '&quot;',
						"'": '&#39;',
					};
		
					s = s.replace(/[&<>"']/g, function(x) {
						return a[x];
					});
		
				return s;
		
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
		
				// Deferred script tags.
		
					// Get list of deferred script tags.
						a = parent.querySelectorAll('deferred-script');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Create replacement script tag.
								x = document.createElement('script');
		
							// Set deferred data attribute (so we can unload this element later).
								x.setAttribute('data-deferred', '');
		
							// Set "src" attribute (if present).
								if (a[i].getAttribute('src'))
									x.setAttribute('src', a[i].getAttribute('src'));
		
							// Set text content (if present).
								if (a[i].textContent)
									x.textContent = a[i].textContent;
		
							// Replace.
								a[i].replaceWith(x);
		
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
		
				// Deferred script tags.
				// NOTE: Disabled for now. May want to bring this back later.
				/*
		
					// Get list of (previously deferred) script tags.
						a = parent.querySelectorAll('script[data-deferred]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Create replacement deferred-script tag.
								x = document.createElement('deferred-script');
		
							// Set "src" attribute (if present).
								if (a[i].getAttribute('src'))
									x.setAttribute('src', a[i].getAttribute('src'));
		
							// Set text content (if present).
								if (a[i].textContent)
									x.textContent = a[i].textContent;
		
							// Replace.
								a[i].replaceWith(x);
		
						}
		
				*/
		
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
		
						}, 1250);
		
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
										}, 250);
		
									}
		
								// Footer.
									if (footer && hideFooter) {
		
										footer.classList.add('hidden');
		
										setTimeout(function() {
											footer.style.display = 'none';
										}, 250);
		
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
											}, 250);
		
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
		
													}, 500 + 250);
		
											}, 75);
		
								}, 250);
		
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
	
	// Gallery.
		/**
		* Lightbox gallery.
		*/
		function lightboxGallery() {
		
		var _this = this;
		
		/**
		 * ID.
		 * @var {string}
		 */
		this.id = 'gallery';
		
		/**
		 * Wrapper.
		 * @var {DOMElement}
		 */
		this.$wrapper = $('#' + this.id);
		
		/**
		 * Modal.
		 * @var {DOMElement}
		 */
		this.$modal = null;
		
		/**
		 * Modal caption.
		 * @var {DOMElement}
		 */
		this.$modalCaption = null;
		
		/**
		 * Modal image.
		 * @var {DOMElement}
		 */
		this.$modalImage = null;
		
		/**
		 * Modal next.
		 * @var {DOMElement}
		 */
		this.$modalNext = null;
		
		/**
		 * Modal previous.
		 * @var {DOMElement}
		 */
		this.$modalPrevious = null;
		
		/**
		 * Links.
		 * @var {nodeList}
		 */
		this.$links = null;
		
		/**
		 * Lock state.
		 * @var {bool}
		 */
		this.locked = false;
		
		/**
		 * Captions state.
		 * @var {bool}
		 */
		this.captions = null;
		
		/**
		 * Current index.
		 * @var {integer}
		 */
		this.current = null;
		
		/**
		 * Transition delay (must match CSS).
		 * @var {integer}
		 */
		this.delay = 375;
		
		/**
		 * Navigation state.
		 * @var {bool}
		 */
		this.navigation = null;
		
		/**
		 * Mobile state.
		 * @var {bool}
		 */
		this.mobile = null;
		
		/**
		 * Protect state.
		 * @var {bool}
		 */
		this.protect = null;
		
		/**
		 * Zoom interval ID.
		 * @var {integer}
		 */
		this.zoomIntervalId = null;
		
		// Init modal.
			this.initModal();
		
		};
		
		/**
		 * Initialize.
		 * @param {object} config Config.
		 */
		lightboxGallery.prototype.init = function(config) {
		
			var _this = this,
				$links = $$('#' + config.id + ' .thumbnail'),
				navigation = config.navigation,
				captions = config.captions,
				mobile = config.mobile,
				mobileNavigation = config.mobileNavigation,
				scheme = config.scheme,
				protect = ('protect' in config ? config.protect : false),
				i, j;
		
			// Determine if navigation needs to be disabled (despite what our config says).
				j = 0;
		
				// Step through items.
					for (i = 0; i < $links.length; i++) {
		
						// Not ignored? Increment count.
							if ($links[i].dataset.lightboxIgnore != '1')
								j++;
		
					}
		
				// Less than two allowed items? Disable navigation.
					if (j < 2)
						navigation = false;
		
			// Bind click events.
				for (i=0; i < $links.length; i++) {
		
					// Ignored? Skip.
						if ($links[i].dataset.lightboxIgnore == '1')
							continue;
		
					// Bind click event.
						(function(index) {
							$links[index].addEventListener('click', function(event) {
		
								// Prevent default.
									event.stopPropagation();
									event.preventDefault();
		
								// Show.
									_this.show(index, {
										$links: $links,
										navigation: navigation,
										captions: captions,
										mobile: mobile,
										mobileNavigation: mobileNavigation,
										scheme: scheme,
										protect: protect,
									});
		
							});
						})(i);
		
				}
		
		};
		
		/**
		 * Init modal.
		 */
		lightboxGallery.prototype.initModal = function() {
		
			var	_this = this,
				dragStart = null,
				dragEnd = null,
				$modal,
				$modalInner,
				$modalImage,
				$modalNext,
				$modalPrevious;
		
			// Build element.
				$modal = document.createElement('div');
					$modal.id = this.id + '-modal';
					$modal.tabIndex = -1;
					$modal.className = 'gallery-modal';
					$modal.innerHTML = '<div class="inner"><img src="" /></div><div class="caption"></div><div class="nav previous"></div><div class="nav next"></div><div class="close"></div>';
					$body.appendChild($modal);
		
				// Inner.
					$modalInner = $modal.querySelector('.inner');
		
				// Image.
					$modalImage = $modal.querySelector('img');
		
					// Load event.
						$modalImage.addEventListener('load', function() {
		
							// Set maximum dimensions of image element to match image's natural width/height.
								$modalImage.style.setProperty('--natural-width', $modalImage.naturalWidth + 'px');
								$modalImage.style.setProperty('--natural-height', $modalImage.naturalHeight + 'px');
		
							// Mark as done.
								$modal.classList.add('done');
		
							// Delay (wait for visible transition, if not switching).
								setTimeout(function() {
		
									// No longer visible? Bail.
										if (!$modal.classList.contains('visible'))
											return;
		
									// Set loaded.
										$modal.classList.add('loaded');
		
									// Clear switching after delay.
										setTimeout(function() {
											$modal.classList.remove('switching', 'from-left', 'from-right', 'done');
										}, _this.delay);
		
								}, ($modal.classList.contains('switching') ? 0 : _this.delay));
		
						});
		
					// Contextmenu event.
						$modalImage.addEventListener('contextmenu', function() {
		
							// Protected? Prevent default.
								if (_this.protect)
									event.preventDefault();
		
						}, true);
		
					// Dragstart event.
						$modalImage.addEventListener('dragstart', function() {
		
							// Protected? Prevent default.
								if (_this.protect)
									event.preventDefault();
		
						}, true);
		
				// Caption.
					$modalCaption = $modal.querySelector('.caption');
		
				// Navigation.
					$modalNext = $modal.querySelector('.next');
					$modalPrevious = $modal.querySelector('.previous');
		
			// Browser-specific workarounds.
				switch (client.browser) {
		
					case 'safari':
					case 'firefox':
		
						// Eliminate drop shadow on "inner" due to sizing issues.
							$modalInner.style.boxShadow = 'none';
		
						break;
		
					default:
						break;
		
				}
		
			// Methods.
				$modal.show = function(index, offset, direction) {
		
					var item,
						i, j, found;
		
					// Locked? Bail.
						if (_this.locked)
							return;
		
					// No index provided? Use current.
						if (typeof index != 'number')
							index = _this.current;
		
					// Offset provided? Find first allowed offset item.
						if (typeof offset == 'number') {
		
							found = false;
							j = 0;
		
							// Step through items using offset (up to item count).
								for (j = 0; j < _this.$links.length; j++) {
		
									// Increment index by offset.
										index += offset;
		
									// Less than zero? Jump to end.
										if (index < 0)
											index = _this.$links.length - 1;
		
									// Greater than length? Jump to beginning.
										else if (index >= _this.$links.length)
											index = 0;
		
									// Already there? Bail.
										if (index == _this.current)
											break;
		
									// Get item.
										item = _this.$links.item(index);
		
										if (!item)
											break;
		
									// Not ignored? Found!
										if (item.dataset.lightboxIgnore != '1') {
		
											found = true;
											break;
		
										}
		
								}
		
							// Couldn't find an allowed item? Bail.
								if (!found)
									return;
		
						}
		
					// Otherwise, see if requested item is allowed.
						else {
		
							// Check index.
		
								// Less than zero? Jump to end.
									if (index < 0)
										index = _this.$links.length - 1;
		
								// Greater than length? Jump to beginning.
									else if (index >= _this.$links.length)
										index = 0;
		
								// Already there? Bail.
									if (index == _this.current)
										return;
		
							// Get item.
								item = _this.$links.item(index);
		
								if (!item)
									return;
		
							// Ignored? Bail.
								if (item.dataset.lightboxIgnore == '1')
									return;
		
						}
		
					// Mobile? Set zoom handler interval.
						if (client.mobile)
							_this.zoomIntervalId = setInterval(function() {
								_this.zoomHandler();
							}, 250);
		
					// Lock.
						_this.locked = true;
		
					// Current?
						if (_this.current !== null) {
		
							// Clear loaded.
								$modal.classList.remove('loaded');
		
							// Set switching.
								$modal.classList.add('switching');
		
							// Apply direction modifier (if applicable).
								switch (direction) {
		
									case -1:
										$modal.classList.add('from-left');
										break;
		
									case 1:
										$modal.classList.add('from-right');
										break;
		
									default:
										break;
		
								}
		
							// Delay (wait for switching transition).
								setTimeout(function() {
		
									// Set current, src.
										_this.current = index;
										$modalImage.src = item.href;
		
									// Set caption (if applicable).
										if (_this.captions)
											$modalCaption.innerHTML = item.querySelector('[data-caption]').dataset.caption;
		
									// Delay.
										setTimeout(function() {
		
											// Focus.
												$modal.focus();
		
											// Unlock.
												_this.locked = false;
		
										}, _this.delay);
		
								}, _this.delay);
		
						}
		
					// Otherwise ...
						else {
		
							// Set current, src.
								_this.current = index;
								$modalImage.src = item.href;
		
							// Set caption (if applicable).
								if (_this.captions)
									$modalCaption.innerHTML = item.querySelector('[data-caption]').dataset.caption;
		
							// Set visible.
								$modal.classList.add('visible');
		
							// Delay.
								setTimeout(function() {
		
									// Focus.
										$modal.focus();
		
									// Unlock.
										_this.locked = false;
		
								}, _this.delay);
		
						}
		
				};
		
				$modal.hide = function() {
		
					// Locked? Bail.
						if (_this.locked)
							return;
		
					// Already hidden? Bail.
						if (!$modal.classList.contains('visible'))
							return;
		
					// Lock.
						_this.locked = true;
		
					// Clear visible, loaded, switching.
						$modal.classList.remove('visible');
						$modal.classList.remove('loaded');
						$modal.classList.remove('switching', 'from-left', 'from-right', 'done');
		
					// Clear zoom handler interval.
						clearInterval(_this.zoomIntervalId);
		
					// Delay (wait for visible transition).
						setTimeout(function() {
		
							// Clear src.
								$modalImage.src = '';
		
							// Unlock.
								_this.locked = false;
		
							// Focus.
								$body.focus();
		
							// Clear current.
								_this.current = null;
		
						}, _this.delay);
		
				};
		
				$modal.next = function(direction) {
					$modal.show(null, 1, direction);
				};
		
				$modal.previous = function(direction) {
					$modal.show(null, -1, direction);
				};
		
				$modal.first = function() {
					$modal.show(0);
				};
		
				$modal.last = function() {
					$modal.show(_this.$links.length - 1);
				};
		
			// Events.
				$modalInner.addEventListener('touchstart', function(event) {
		
					// Navigation disabled? Bail.
						if (!_this.navigation)
							return;
		
					// More than two touches? Bail.
						if (event.touches.length > 1)
							return;
		
					// Record drag start.
						dragStart = {
							x: event.touches[0].clientX,
							y: event.touches[0].clientY
						};
		
				});
		
				$modalInner.addEventListener('touchmove', function(event) {
		
					var dx, dy;
		
					// Navigation disabled? Bail.
						if (!_this.navigation)
							return;
		
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
						if (dx > 0)
							$modal.next(-1);
		
					// Negative value? Move to previous.
						else if (dx < 0)
							$modal.previous(1);
		
				});
		
				$modalInner.addEventListener('touchend', function(event) {
		
					// Navigation disabled? Bail.
						if (!_this.navigation)
							return;
		
					// Clear drag start, end.
						dragStart = null;
						dragEnd = null;
		
				});
		
				$modal.addEventListener('click', function(event) {
		
					// Click target was an anchor or spoiler text tag? Bail.
						if (event.target
						&&	(event.target.tagName == 'A' || event.target.tagName == 'SPOILER-TEXT'))
							return;
		
					// Hide modal.
						$modal.hide();
		
				});
		
				$modal.addEventListener('keydown', function(event) {
		
					// Not visible? Bail.
						if (!$modal.classList.contains('visible'))
							return;
		
					switch (event.keyCode) {
		
						// Right arrow, Space.
							case 39:
							case 32:
		
								if (!_this.navigation)
									break;
		
								event.preventDefault();
								event.stopPropagation();
		
								$modal.next();
		
								break;
		
						// Left arrow.
							case 37:
		
								if (!_this.navigation)
									break;
		
								event.preventDefault();
								event.stopPropagation();
		
								$modal.previous();
		
								break;
		
						// Home.
							case 36:
		
								if (!_this.navigation)
									break;
		
								event.preventDefault();
								event.stopPropagation();
		
								$modal.first();
		
								break;
		
						// End.
							case 35:
		
								if (!_this.navigation)
									break;
		
								event.preventDefault();
								event.stopPropagation();
		
								$modal.last();
		
								break;
		
						// Escape.
							case 27:
		
								event.preventDefault();
								event.stopPropagation();
		
								$modal.hide();
		
								break;
		
					}
		
				});
		
				$modalNext.addEventListener('click', function(event) {
					$modal.next();
				});
		
				$modalPrevious.addEventListener('click', function(event) {
					$modal.previous();
				});
		
			// Set.
				this.$modal = $modal;
				this.$modalImage = $modalImage;
				this.$modalCaption = $modalCaption;
				this.$modalNext = $modalNext;
				this.$modalPrevious = $modalPrevious;
		
		};
		
		/**
		 * Show.
		 * @param {string} href Image href.
		 */
		lightboxGallery.prototype.show = function(href, config) {
		
			// Update config.
				this.$links = config.$links;
				this.navigation = config.navigation;
				this.captions = config.captions;
				this.mobile = config.mobile;
				this.mobileNavigation = config.mobileNavigation;
				this.scheme = config.scheme;
				this.protect = config.protect;
		
			// Scheme.
		
				// Remove any existing classes.
					this.$modal.classList.remove('light', 'dark');
		
				// Determine scheme.
					switch (this.scheme) {
		
						case 'light':
							this.$modal.classList.add('light');
							break;
		
						case 'dark':
							this.$modal.classList.add('dark');
							break;
		
						case 'auto':
		
							// Prefers light scheme? Apply light class.
								if (window.matchMedia('(prefers-color-scheme: light)').matches)
									this.$modal.classList.add('light');
		
							// Otherwise, default to dark.
								else
									this.$modal.classList.add('dark');
		
							break;
		
					}
		
			// Navigation.
				if (this.navigation) {
		
					this.$modalNext.style.display = '';
					this.$modalPrevious.style.display = '';
		
					// Mobile navigation.
						if (client.mobile
						&&	!this.mobileNavigation) {
		
							this.$modalNext.style.display = 'none';
							this.$modalPrevious.style.display = 'none';
		
						}
		
				}
				else {
		
					this.$modalNext.style.display = 'none';
					this.$modalPrevious.style.display = 'none';
		
				}
		
			// Captions.
				if (this.captions)
					this.$modalCaption.style.display = '';
				else
					this.$modalCaption.style.display = 'none';
		
			// Protect.
				if (this.protect) {
		
					this.$modalImage.style.WebkitTouchCallout = 'none';
					this.$modalImage.style.userSelect = 'none';
		
				}
				else {
		
					this.$modalImage.style.WebkitTouchCallout = '';
					this.$modalImage.style.userSelect = '';
		
				}
		
			// Mobile.
				if (client.mobile && !this.mobile)
					return;
		
			// Show modal.
				this.$modal.show(href);
		
		};
		
		/**
		 * Zoom handler.
		 */
		lightboxGallery.prototype.zoomHandler = function() {
		
			var threshold = window.matchMedia('(orientation: portrait)').matches ? 50 : 100;
		
			// Zoomed in? Set zooming.
				if (window.outerWidth > window.innerWidth + threshold)
					this.$modal.classList.add('zooming');
		
			// Otherwise, clear zooming.
				else
					this.$modal.classList.remove('zooming');
		
		};
		
		var _lightboxGallery = new lightboxGallery;
	
	// Gallery: gallery03.
		_lightboxGallery.init({
			id: 'gallery03',
			navigation: true,
			captions: false,
			mobile: true,
			mobileNavigation: true,
			scheme: 'dark',
		});

})();