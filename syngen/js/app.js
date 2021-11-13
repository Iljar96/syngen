"use strict";

if (!Array.from) {
	Array.from = function () {
		var toStr = Object.prototype.toString;

		var isCallable = function isCallable(fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};

		var toInteger = function toInteger(value) {
			var number = Number(value);

			if (isNaN(number)) {
				return 0;
			}

			if (number === 0 || !isFinite(number)) {
				return number;
			}

			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};

		var maxSafeInteger = Math.pow(2, 53) - 1;

		var toLength = function toLength(value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		}; // The length property of the from method is 1.


		return function from(arrayLike
			/*, mapFn, thisArg */
		) {
			// 1. Let C be the this value.
			var C = this; // 2. Let items be ToObject(arrayLike).

			var items = Object(arrayLike); // 3. ReturnIfAbrupt(items).

			if (arrayLike == null) {
				throw new TypeError("Array.from requires an array-like object - not null or undefined");
			} // 4. If mapfn is undefined, then let mapping be false.


			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;

			if (typeof mapFn !== 'undefined') {
				// 5. else
				// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				} // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.


				if (arguments.length > 2) {
					T = arguments[2];
				}
			} // 10. Let lenValue be Get(items, "length").
			// 11. Let len be ToLength(lenValue).


			var len = toLength(items.length); // 13. If IsConstructor(C) is true, then
			// 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
			// 14. a. Else, Let A be ArrayCreate(len).

			var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Let k be 0.

			var k = 0; // 17. Repeat, while k < len… (also steps a - h)

			var kValue;

			while (k < len) {
				kValue = items[k];

				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}

				k += 1;
			} // 18. Let putStatus be Put(A, "length", len, true).


			A.length = len; // 20. Return A.

			return A;
		};
	}();
} // Function to make IE9+ support forEach:


if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
} // Works with Nodelists (i.e. HTMLcollections):


var demos = document.querySelectorAll('.demo');
demos.forEach(function (item) {
	item.style.color = 'red';
});

function email_test(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
} // Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle


"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	var _this2 = this;

	var _this = this; // массив объектов


	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_"; // массив DOM-элементов

	this.nodes = document.querySelectorAll("[data-da]"); // наполнение оbjects объктами

	for (var i = 0; i < this.nodes.length; i++) {
		var node = this.nodes[i];
		var data = node.dataset.da.trim();
		var dataArray = data.split(",");
		var оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects); // массив уникальных медиа-запросов

	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	}); // навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске

	var _loop = function _loop(_i) {
		var media = _this2.mediaQueries[_i];
		var mediaSplit = String.prototype.split.call(media, ',');
		var matchMedia = window.matchMedia(mediaSplit[0]);
		var mediaBreakpoint = mediaSplit[1]; // массив объектов с подходящим брейкпоинтом

		var оbjectsFilter = Array.prototype.filter.call(_this2.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});

		_this2.mediaHandler(matchMedia, оbjectsFilter);
	};

	for (var _i = 0; _i < this.mediaQueries.length; _i++) {
		_loop(_i);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (var i = 0; i < оbjects.length; i++) {
			var оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (var _i2 = 0; _i2 < оbjects.length; _i2++) {
			var _оbject = оbjects[_i2];

			if (_оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(_оbject.parent, _оbject.element, _оbject.index);
			}
		}
	}
}; // Функция перемещения


DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);

	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}

	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}

	destination.children[place].insertAdjacentElement('beforebegin', element);
}; // Функция возврата


DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);

	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}; // Функция получения индекса внутри родителя


DynamicAdapt.prototype.indexInParent = function (parent, element) {
	var array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
}; // Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max


DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

var da = new DynamicAdapt("max");
da.init();
var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var isMobile = {
	Android: function Android() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function BlackBerry() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function iOS() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function Opera() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function Windows() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function any() {
		return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
	}
};

function isIE() {
	ua = navigator.userAgent;
	var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
	return is_ie;
}

if (isIE()) {
	document.querySelector('html').classList.add('ie');
}

if (isMobile.any()) {
	document.querySelector('html').classList.add('_touch');
}

function ibg() {
	if (isIE()) {
		var _ibg = document.querySelectorAll("._ibg");

		for (var i = 0; i < _ibg.length; i++) {
			if (_ibg[i].querySelector('img') && _ibg[i].querySelector('img').getAttribute('src') != null) {
				_ibg[i].style.backgroundImage = 'url(' + _ibg[i].querySelector('img').getAttribute('src') + ')';
			}
		}
	}
}

ibg();
window.addEventListener("load", function () {
	if (document.querySelector('.wrapper')) {
		setTimeout(function () {
			document.querySelector('.wrapper').classList.add('_loaded');
		}, 0);
	}
});
var unlock = true; //=================
//ActionsOnHash

if (location.hash) {
	var hsh = location.hash.replace('#', '');

	if (document.querySelector('.popup_' + hsh)) {
		popup_open(hsh);
	} else if (document.querySelector('div.' + hsh)) {
		_goto(document.querySelector('.' + hsh), 1500, '');
	}
} //=================
//Menu


var iconMenu = document.querySelector(".menu-burger");

if (iconMenu != null) {
	var delay = 500;
	var menuBody = document.querySelector(".menu__body");
	iconMenu.addEventListener("click", function (e) {
		if (unlock) {
			body_lock(delay);
			iconMenu.classList.toggle("_active");
			menuBody.classList.toggle("_active");
		}
	});
}

;

function menu_close() {
	var iconMenu = document.querySelector(".menu-burger");
	var menuBody = document.querySelector(".menu__body");
	iconMenu.classList.remove("_active");
	menuBody.classList.remove("_active");
} //=================
//BodyLock


function body_lock(delay) {
	var body = document.querySelector("body");

	if (body.classList.contains('_lock')) {
		body_lock_remove(delay);
	} else {
		body_lock_add(delay);
	}
}

function body_lock_remove(delay) {
	var body = document.querySelector("body");

	if (unlock) {
		var lock_padding = document.querySelectorAll("._lp");
		setTimeout(function () {
			for (var index = 0; index < lock_padding.length; index++) {
				var el = lock_padding[index];
				el.style.paddingRight = '0px';
			}

			body.style.paddingRight = '0px';
			body.classList.remove("_lock");
		}, delay);
		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}

function body_lock_add(delay) {
	var body = document.querySelector("body");

	if (unlock) {
		var lock_padding = document.querySelectorAll("._lp");

		for (var index = 0; index < lock_padding.length; index++) {
			var el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}

		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		body.classList.add("_lock");
		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
} //=================
//=================
//Tabs


var tabs = document.querySelectorAll("._tabs");

var _loop2 = function _loop2(index) {
	var tab = tabs[index];
	var tabs_items = tab.querySelectorAll("._tabs-item");
	var tabs_blocks = tab.querySelectorAll("._tabs-block");

	var _loop9 = function _loop9(_index26) {
		var tabs_item = tabs_items[_index26];
		tabs_item.addEventListener("click", function (e) {
			for (var _index27 = 0; _index27 < tabs_items.length; _index27++) {
				var _tabs_item = tabs_items[_index27];

				_tabs_item.classList.remove('_active');

				tabs_blocks[_index27].classList.remove('_active');
			}

			tabs_item.classList.add('_active');

			tabs_blocks[_index26].classList.add('_active');

			e.preventDefault();
		});
	};

	for (var _index26 = 0; _index26 < tabs_items.length; _index26++) {
		_loop9(_index26);
	}
};

for (var index = 0; index < tabs.length; index++) {
	_loop2(index);
} //=================
// SPOLLERS


var spollersArray = document.querySelectorAll('[data-spollers]'),
	entSpollersArray = document.querySelectorAll('[data-ent-spollers]');

if (spollersArray.length > 0) {
	// Инициализация
	var initSpollers = function initSpollers(spollersArray) {
		var matchMedia = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		spollersArray.forEach(function (spollersBlock) {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;

			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}; // Работа с контентом


	var initSpollerBody = function initSpollerBody(spollersBlock) {
		var hideSpollerBody = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
		var spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');

		if (spollerTitles.length > 0) {
			spollerTitles.forEach(function (spollerTitle) {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');

					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	};

	var setSpollerAction = function setSpollerAction(e) {
		var el = e.target;

		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			var spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			var spollersBlock = spollerTitle.closest('[data-spollers]');
			var oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;

			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}

				spollerTitle.classList.toggle('_active');

				_slideToggle(spollerTitle.nextElementSibling, 500);
			}

			e.preventDefault();
		}
	};

	var hideSpollersBody = function hideSpollersBody(spollersBlock) {
		var spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');

		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');

			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	};

	// Получение обычных слойлеров
	var spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	}); // Инициализация обычных слойлеров

	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	} // Получение слойлеров с медиа запросами


	var spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	}); // Инициализация слойлеров с медиа запросами

	if (spollersMedia.length > 0) {
		var breakpointsArray = [];
		spollersMedia.forEach(function (item) {
			var params = item.dataset.spollers;
			var breakpoint = {};
			var paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		}); // Получаем уникальные брейкпоинты

		var mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		}); // Работаем с каждым брейкпоинтом

		mediaQueries.forEach(function (breakpoint) {
			var paramsArray = breakpoint.split(",");
			var mediaBreakpoint = paramsArray[1];
			var mediaType = paramsArray[2];
			var matchMedia = window.matchMedia(paramsArray[0]); // Объекты с нужными условиями

			var spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			}); // Событие

			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
} //=================
//Popups


var popup_link = document.querySelectorAll('._popup-link');
var popups = document.querySelectorAll('.popup');

var _loop3 = function _loop3(_index) {
	var el = popup_link[_index];
	el.addEventListener('click', function (e) {
		if (unlock) {
			var item = el.getAttribute('href').replace('#', '');
			var video = el.getAttribute('data-video');
			popup_open(item, video);
		}

		e.preventDefault();
	});
};

for (var _index = 0; _index < popup_link.length; _index++) {
	_loop3(_index);
}

for (var _index2 = 0; _index2 < popups.length; _index2++) {
	var popup = popups[_index2];
	popup.addEventListener("click", function (e) {
		if (!e.target.closest('.popup__body')) {
			popup_close(e.target.closest('.popup'));
		}
	});
}

document.querySelector('.header__wrapper').style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

function popup_open(item) {
	var video = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	var activePopup = document.querySelectorAll('.popup._active');

	if (activePopup.length > 0) {
		popup_close('', false);
	}

	var curent_popup = document.querySelector('.popup_' + item);

	if (curent_popup && unlock) {
		if (video != '' && video != null) {
			var popup_video = document.querySelector('.popup_video');
			popup_video.querySelector('.popup__video').innerHTML = '<iframe src="https://www.youtube.com/embed/' + video + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
		}

		if (!document.querySelector('.menu__body._active')) {
			body_lock_add(500);
		}

		curent_popup.classList.add('_active');
		history.pushState('', '', '#' + item);
	}
}

function popup_close(item) {
	var bodyUnlock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	if (unlock) {
		if (!item) {
			for (var _index3 = 0; _index3 < popups.length; _index3++) {
				var _popup = popups[_index3];

				var video = _popup.querySelector('.popup__video');

				if (video) {
					video.innerHTML = '';
				}

				_popup.classList.remove('_active');
			}
		} else {
			var _video = item.querySelector('.popup__video');

			if (_video) {
				_video.innerHTML = '';
			}

			item.classList.remove('_active');
		}

		if (!document.querySelector('.menu__body._active') && bodyUnlock) {
			body_lock_remove(500);
		}

		history.pushState('', '', window.location.href.split('#')[0]);
	}
}

var popup_close_icon = document.querySelectorAll('.popup__close,._popup-close');

if (popup_close_icon) {
	var _loop4 = function _loop4(_index4) {
		var el = popup_close_icon[_index4];
		el.addEventListener('click', function () {
			popup_close(el.closest('.popup'));
		});
	};

	for (var _index4 = 0; _index4 < popup_close_icon.length; _index4++) {
		_loop4(_index4);
	}
}

document.addEventListener('keydown', function (e) {
	if (e.code === 'Escape') {
		popup_close();
	}
}); //=================
//SlideToggle

var _slideUp = function _slideUp(target) {
	var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(function () {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
};

var _slideDown = function _slideDown(target) {
	var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');

		if (target.hidden) {
			target.hidden = false;
		}

		var height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(function () {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
};

var _slideToggle = function _slideToggle(target) {
	var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}; //========================================
//========================================
//RemoveClasses


function _removeClasses(el, class_name) {
	for (var i = 0; i < el.length; i++) {
		el[i].classList.remove(class_name);
	}
} //========================================
//IsHidden


function _is_hidden(el) {
	return el.offsetParent === null;
} //Полифилы


(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;

			while (node) {
				if (node.matches(css)) return node; else node = node.parentElement;
			}

			return null;
		};
	}
})();

(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;
	}
})();

window.onload = function () {
	document.querySelectorAll('._hidden').forEach(function (item) {
		return item.classList.remove('_hidden');
	}); //Placeholder

	var placeholderParents = document.querySelectorAll('._placeholder-parent');

	if (placeholderParents.length > 0) {
		placeholderParents.forEach(function (placeholderParent) {
			var input = placeholderParent.querySelector('.input');
			var placeholder = placeholderParent.querySelector('._placeholder');
			input.addEventListener('focus', function (e) {
				placeholder.classList.add('_hidden');
			});
			input.addEventListener('blur', function (e) {
				if (e.target && e.target.value.trim() === '') placeholder.classList.remove('_hidden');
			});
		});
	} //
	// document.querySelectorAll('.product-body__navitem').forEach(el => {
	// 	el.style.maxWidth = `${el.offsetWidth}px`;
	// })
	//Tabs nav line


	var navLine = document.querySelector('.product-body__line'),
		navItem = document.querySelectorAll('.product-body__navitem');

	if (navLine) {
		navLine.style.width = "".concat(navItem[0].offsetWidth, "px");
		navItem.forEach(function (el) {
			el.addEventListener('mouseenter', function (e) {
				setTimeout(function () {
					navLine.style.width = "".concat(e.target.offsetWidth, "px");
					navLine.style.left = "".concat(e.target.offsetLeft, "px");
				}, 10);
			});
			el.addEventListener('mouseleave', function () {
				var navItemActive = document.querySelector('.product-body__navitem._active');
				navLine.style.width = "".concat(navItemActive.offsetWidth, "px");
				navLine.style.left = "".concat(navItemActive.offsetLeft, "px");
			});
		});
	} //QUANTITY


	var quantityButtons = document.querySelectorAll('.quantity__button');

	if (quantityButtons.length > 0) {
		(function () {
			var getCartVariable = function getCartVariable(el) {
				var parentRow = el.closest('tr');
				singleProductPrice = +parentRow.querySelector('.product-price .amount').textContent.replace(/\D/g, '');
				val = +parentRow.querySelector('.quantity__input input').value;
				sumContainer = parentRow.querySelector('.product-subtotal .amount ._amount-digits');
				sum = singleProductPrice * val;
			};

			var changeCartSum = function changeCartSum() {
				sumContainer.innerHTML = sum;
			};

			var changeCartTotalSum = function changeCartTotalSum() {
				totalSum = 0;
				table.querySelectorAll('.product-subtotal .amount').forEach(function (el) {
					totalSum += +el.textContent.replace(/\D/g, '');
				});
				cartTotalSumContainer.innerHTML = totalSum;
			};

			var _loop5 = function _loop5(_index5) {
				var quantityButton = quantityButtons[_index5];
				quantityButton.addEventListener("click", function (e) {
					var value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);

					if (quantityButton.classList.contains('quantity__button_plus')) {
						value++;
					} else {
						value = value - 1;

						if (value < 1) {
							value = 1;
						}
					}

					quantityButton.closest('.quantity').querySelector('input').value = value;
				});
			};

			for (var _index5 = 0; _index5 < quantityButtons.length; _index5++) {
				_loop5(_index5);
			}

			var cartTotalSumContainer = document.querySelector('.cart-block__total .amount ._amount-digits');
			var table = document.querySelector('.cart-block table');
			var singleProductPrice,
				val,
				sumContainer,
				sum = 0,
				totalSum = 0;
			changeCartTotalSum();

			if (document.querySelector('.cart-block')) {
				var quantities = table.querySelectorAll('.quantity');

				for (var j = 0; j < quantities.length; j++) {
					var quantity = quantities[j];
					quantity.querySelector('.quantity__button_plus').addEventListener('click', function (e) {
						getCartVariable(e.target);
						changeCartSum();
						changeCartTotalSum();
					});
					quantity.querySelector('.quantity__button_minus').addEventListener('click', function (e) {
						getCartVariable(e.target);
						changeCartSum();
						changeCartTotalSum();
					});
					quantity.querySelector('.quantity__input input').addEventListener('change', function (e) {
						getCartVariable(e.target);
						changeCartSum();
						changeCartTotalSum();
					});
				}
			}
		})();
	}

	var sidebarBodyBlock = document.querySelector('.sidebar__body'),
		sidebarTopBtn = document.querySelector('.sidebar__mob-top'); // Вот тут функция оптимизации резайса (троттлинг)

	function throttleFn() {
		var throttle = function throttle(type, name, obj) {
			obj = obj || window;
			var running = false;

			var func = function func() {
				if (running) {
					return;
				}

				running = true;
				requestAnimationFrame(function () {
					obj.dispatchEvent(new CustomEvent(name));
					running = false;
				});
			};

			obj.addEventListener(type, func);
		};
		/* init - you can init any event */


		throttle("resize", "optimizedResize");
	} // Функция, чтобы было удобно вызвать


	throttleFn(); // Событие, сюда ваш код

	window.addEventListener("optimizedResize", function () {
		resizeWindow(); // вызов той самой функции
	});

	function resizeWindow() {
		if (sidebarTopBtn) {
			if (window.innerWidth < 992) {
				sidebarBodyBlock.hidden = true;
				sidebarTopBtn.addEventListener('click', function (e) {
					_slideToggle(sidebarBodyBlock, 500);
				});
			} else {
				sidebarBodyBlock.hidden = false;
			}
		}
	} // Вызов функции, чтобы она срабатывала при загрузке


	resizeWindow();
	document.addEventListener("click", documentActions); // Actions (делегирование события click)

	function documentActions(e) {
		var targetElement = e.target; //Show more button

		if (targetElement.classList.contains('popular__more')) {
			targetElement.classList.add('_hide');
		} //Sidebar mob-top button
		// if (targetElement.classList.contains('sidebar__mob-top')) {
		// 	targetElement.querySelector('.menu-burger').classList.toggle('_active');
		// }


		if (window.innerWidth > 767 && isMobile.any()) {
			if (targetElement.classList.contains('menu-item-has-children')) {
				e.preventDefault();
				targetElement.classList.toggle('_hover');

				if (document.querySelectorAll('.menu-item-has-children._hover').length > 1) {
					_removeClasses(document.querySelectorAll('.menu-item-has-children._hover'), "_hover");
				}
			}

			if (!targetElement.classList.contains('menu-item-has-children')) {
				_removeClasses(document.querySelectorAll('.menu-item-has-children._hover'), "_hover");
			}
		}
	} //Upload button


	var forms = document.querySelectorAll('form');
	var inputFile = document.querySelectorAll('.upload-file__input'); /////////// Кнопка «Прикрепить файл» /////////// 

	inputFile.forEach(function (el) {
		var textSelector = document.querySelector('.upload-file__text');
		var fileList; // Событие выбора файла(ов) 

		el.addEventListener('change', function (e) {
			// создаём массив файлов 
			fileList = [];

			for (var i = 0; i < el.files.length; i++) {
				fileList.push(el.files[i]);
			} // вызов функции для каждого файла 


			fileList.forEach(function (file) {
				uploadFile(file);
			});
		}); // Проверяем размер файлов и выводим название 

		var uploadFile = function uploadFile(file) {
			// файла <5 Мб 
			if (file.size > 1 * 1024 * 1024) {
				alert('Файл должен быть не более 1 МБ.');
				return;
			} // Показ загружаемых файлов 


			if (file && file.length > 1) {
				if (file.length <= 4) {
					textSelector.textContent = "\u0412\u044B\u0431\u0440\u0430\u043D\u043E ".concat(file.length, " \u0444\u0430\u0439\u043B\u0430");
				}

				if (file.length > 4) {
					textSelector.textContent = "\u0412\u044B\u0431\u0440\u0430\u043D\u043E ".concat(file.length, " \u0444\u0430\u0439\u043B\u043E\u0432");
				}
			} else {
				textSelector.textContent = file.name;
			}
		};
	}); // Отправка формы на сервер 
	// const postData = async (url, fData) => { // имеет асинхронные операции 
	// 	// начало отправки 
	// 	// здесь можно оповестить пользователя о начале отправки 
	// 	// ждём ответ, только тогда наш код пойдёт дальше 
	// 	let fetchResponse = await fetch(url, {
	// 		method: 'POST',
	// 		body: fData
	// 	});
	// 	// ждём окончания операции 
	// 	return await fetchResponse.text();
	// };
	// if (forms) {
	// 	forms.forEach(el => {
	// 		el.addEventListener('submit', function (e) {
	// 			e.preventDefault();
	// 			// создание объекта FormData 
	// 			let fData = new FormData();
	// 			// Добавление всех input, кроме type="file" 
	// 			el.querySelectorAll('input:not([type="file"])').forEach(input => {
	// 				fData.append(input.name, input.value);
	// 			});
	// 			// Добавление файлов input type file 
	// 			let file = el.querySelector('.upload-file__input');
	// 			for (let i = 0; i < (file.files.length); i++) {
	// 				fData.append('files[]', file.files[i]); // добавляем файлы в объект FormData() 
	// 			}
	// 			// Отправка на сервер 
	// 			postData('./mail.php', fData)
	// 				.then(fetchResponse => {
	// 					console.log('Данные успешно отправлены!');
	// 					console.log(fetchResponse);
	// 				})
	// 				.catch(function (error) {
	// 					console.log('Ошибка!');
	// 					console.log(error);
	// 				});
	// 		});
	// 	});
	// };
}; //Select


var selects = document.getElementsByTagName('select');

if (selects.length > 0) {
	selects_init();
}

function selects_init() {
	for (var _index6 = 0; _index6 < selects.length; _index6++) {
		var select = selects[_index6];
		select_init(select);
	} //select_callback();


	document.addEventListener('click', function (e) {
		selects_close(e);
	});
	document.addEventListener('keydown', function (e) {
		if (e.code === 'Escape') {
			selects_close(e);
		}
	});
}

function selects_close(e) {
	var selects = document.querySelectorAll('.select');

	if (!e.target.closest('.select') && !e.target.classList.contains('_option')) {
		for (var _index7 = 0; _index7 < selects.length; _index7++) {
			var select = selects[_index7];
			var select_body_options = select.querySelector('.select__options');
			select.classList.remove('_active');

			_slideUp(select_body_options, 100);
		}
	}
}

function select_init(select) {
	var select_parent = select.parentElement;
	var select_modifikator = select.getAttribute('class');
	var select_selected_option = select.querySelector('option:checked');
	select.setAttribute('data-default', select_selected_option.value);
	select.style.display = 'none';
	select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');
	var new_select = select.parentElement.querySelector('.select');
	new_select.appendChild(select);
	select_item(select);
}

function select_item(select) {
	var select_parent = select.parentElement;
	var select_items = select_parent.querySelector('.select__item');
	var select_options = select.querySelectorAll('option');
	var select_selected_option = select.querySelector('option:checked');
	var select_selected_text = select_selected_option.text;
	var select_type = select.getAttribute('data-type');

	if (select_items) {
		select_items.remove();
	}

	var select_type_content = '';

	if (select_type == 'input') {
		select_type_content = '<div class="select__value icon-select-arrow"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
	} else {
		select_type_content = '<div class="select__value icon-select-arrow"><span>' + select_selected_text + '</span></div>';
	}

	select_parent.insertAdjacentHTML('beforeend', '<div class="select__item">' + '<div class="select__title">' + select_type_content + '</div>' + '<div hidden class="select__options">' + select_get_options(select_options) + '</div>' + '</div></div>');
	select_actions(select, select_parent);
}

function select_actions(original, select) {
	var select_item = select.querySelector('.select__item');
	var selectTitle = select.querySelector('.select__title');
	var select_body_options = select.querySelector('.select__options');
	var select_options = select.querySelectorAll('.select__option');
	var select_type = original.getAttribute('data-type');
	var select_input = select.querySelector('.select__input');
	selectTitle.addEventListener('click', function (e) {
		selectItemActions();
	});

	function selectMultiItems() {
		var selectedOptions = select.querySelectorAll('.select__option');
		var originalOptions = original.querySelectorAll('option');
		var selectedOptionsText = [];

		for (var _index8 = 0; _index8 < selectedOptions.length; _index8++) {
			var selectedOption = selectedOptions[_index8];

			originalOptions[_index8].removeAttribute('selected');

			if (selectedOption.classList.contains('_selected')) {
				var selectOptionText = selectedOption.innerHTML;
				selectedOptionsText.push(selectOptionText);

				originalOptions[_index8].setAttribute('selected', 'selected');
			}
		}

		select.querySelector('.select__value').innerHTML = '<span>' + selectedOptionsText + '</span>';
	}

	function selectItemActions(type) {
		if (!type) {
			var _selects = document.querySelectorAll('.select');

			for (var _index9 = 0; _index9 < _selects.length; _index9++) {
				var _select = _selects[_index9];

				var _select_body_options = _select.querySelector('.select__options');

				if (_select != select_item.closest('.select')) {
					_select.classList.remove('_active');

					_slideUp(_select_body_options, 100);
				}
			}

			_slideToggle(select_body_options, 100);

			select.classList.toggle('_active');
		}
	}

	var _loop6 = function _loop6(_index10) {
		var select_option = select_options[_index10];
		var select_option_value = select_option.getAttribute('data-value');
		var select_option_text = select_option.innerHTML;

		if (select_type == 'input') {
			select_input.addEventListener('keyup', select_search);
		} else {
			if (select_option.getAttribute('data-value') == original.value && !original.hasAttribute('multiple')) {
				select_option.style.display = 'none';
			}
		}

		select_option.addEventListener('click', function () {
			for (var _index11 = 0; _index11 < select_options.length; _index11++) {
				var el = select_options[_index11];
				el.style.display = 'block';
			}

			if (select_type == 'input') {
				select_input.value = select_option_text;
				original.value = select_option_value;
			} else {
				if (original.hasAttribute('multiple')) {
					select_option.classList.toggle('_selected');
					selectMultiItems();
				} else {
					select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
					original.value = select_option_value;
					select_option.style.display = 'none';
				}
			}

			var type;

			if (original.hasAttribute('multiple')) {
				type = 'multiple';
			}

			selectItemActions(type);
		});
	};

	for (var _index10 = 0; _index10 < select_options.length; _index10++) {
		_loop6(_index10);
	}
}

function select_get_options(select_options) {
	if (select_options) {
		var select_options_content = '';

		for (var _index12 = 0; _index12 < select_options.length; _index12++) {
			var select_option = select_options[_index12];
			var select_option_value = select_option.value;

			if (select_option_value != '') {
				var select_option_text = select_option.innerHTML;
				select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
			}
		}

		return select_options_content;
	}
}

function select_search(e) {
	var select_block = e.target.closest('.select ').querySelector('.select__options');
	var select_options = e.target.closest('.select ').querySelectorAll('.select__option');
	var select_search_text = e.target.value.toUpperCase();

	for (var i = 0; i < select_options.length; i++) {
		var select_option = select_options[i];
		var select_txt_value = select_option.textContent || select_option.innerText;

		if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
			select_option.style.display = "";
		} else {
			select_option.style.display = "none";
		}
	}
}

function selects_update_all() {
	var selects = document.querySelectorAll('select');

	if (selects) {
		for (var _index13 = 0; _index13 < selects.length; _index13++) {
			var select = selects[_index13];
			select_item(select);
		}
	}
}

var scr_body = document.querySelector('body');
var scr_blocks = document.querySelectorAll('._scr-sector');
var scr_items = document.querySelectorAll('._scr-item');
var scr_fix_block = document.querySelectorAll('._side-wrapper');
var scr_min_height = 750;
var scrolling = true;
var scrolling_full = true;
var scrollDirection = 0;
var currentScroll; //ScrollOnScroll

window.addEventListener('scroll', scroll_scroll);

function scroll_scroll() {
	var src_value = currentScroll = pageYOffset;
	var header = document.querySelector('header.header');

	if (header !== null) {
		if (src_value > 10) {
			header.classList.add('_scroll');
		} else {
			header.classList.remove('_scroll');
		}
	}

	if (scr_blocks.length > 0) {
		for (var _index14 = 0; _index14 < scr_blocks.length; _index14++) {
			var block = scr_blocks[_index14];
			var block_offset = offset(block).top;
			var block_height = block.offsetHeight;
			/*
			if ((src_value > block_offset - block_height) && src_value < (block_offset + block_height) && window.innerHeight > scr_min_height && window.innerWidth > 992) {
				let scrProcent = (src_value - block_offset) / block_height * 100;
				scrParallax(block, scrProcent, block_height);
			}
			*/

			if (pageYOffset > block_offset - window.innerHeight / 1.5 && pageYOffset < block_offset + block_height - window.innerHeight / 5) {
				block.classList.add('_scr-sector_active');
			} else {
				if (block.classList.contains('_scr-sector_active')) {
					block.classList.remove('_scr-sector_active');
				}
			}

			if (pageYOffset > block_offset - window.innerHeight / 2 && pageYOffset < block_offset + block_height - window.innerHeight / 5) {
				if (!block.classList.contains('_scr-sector_current')) {
					block.classList.add('_scr-sector_current');
				}
			} else {
				if (block.classList.contains('_scr-sector_current')) {
					block.classList.remove('_scr-sector_current');
				}
			}
		}
	}

	if (scr_items.length > 0) {
		for (var _index15 = 0; _index15 < scr_items.length; _index15++) {
			var scr_item = scr_items[_index15];
			var scr_item_offset = offset(scr_item).top;
			var scr_item_height = scr_item.offsetHeight;
			var scr_item_point = window.innerHeight - (window.innerHeight - scr_item_height / 3);

			if (window.innerHeight > scr_item_height) {
				scr_item_point = window.innerHeight - scr_item_height / 3;
			}

			if (src_value > scr_item_offset - scr_item_point && src_value < scr_item_offset + scr_item_height) {
				scr_item.classList.add('_active');
				scroll_load_item(scr_item);
			}

			if (src_value > scr_item_offset - window.innerHeight) {
				if (scr_item.querySelectorAll('._lazy').length > 0) {
					scroll_lazy(scr_item);
				}
			}
		}
	}

	if (scr_fix_block.length > 0) {
		fix_block(scr_fix_block, src_value);
	}

	var custom_scroll_line = document.querySelector('._custom-scroll__line');

	if (custom_scroll_line) {
		var window_height = window.innerHeight;
		var content_height = document.querySelector('.wrapper').offsetHeight;
		var scr_procent = pageYOffset / (content_height - window_height) * 100;
		var custom_scroll_line_height = custom_scroll_line.offsetHeight;
		custom_scroll_line.style.transform = "translateY(" + (window_height - custom_scroll_line_height) / 100 * scr_procent + "px)";
	}

	if (src_value > scrollDirection) {// downscroll code
	} else {// upscroll code
	}

	scrollDirection = src_value <= 0 ? 0 : src_value;
}

setTimeout(function () {
	//document.addEventListener("DOMContentLoaded", scroll_scroll);
	scroll_scroll();
}, 100);

function scroll_lazy(scr_item) {
	var lazy_src = scr_item.querySelectorAll('*[data-src]');

	if (lazy_src.length > 0) {
		for (var _index16 = 0; _index16 < lazy_src.length; _index16++) {
			var el = lazy_src[_index16];

			if (!el.classList.contains('_loaded')) {
				el.setAttribute('src', el.getAttribute('data-src'));
				el.classList.add('_loaded');
			}
		}
	}

	var lazy_srcset = scr_item.querySelectorAll('*[data-srcset]');

	if (lazy_srcset.length > 0) {
		for (var _index17 = 0; _index17 < lazy_srcset.length; _index17++) {
			var _el = lazy_srcset[_index17];

			if (!_el.classList.contains('_loaded')) {
				_el.setAttribute('srcset', _el.getAttribute('data-srcset'));

				_el.classList.add('_loaded');
			}
		}
	}
}

function scroll_load_item(scr_item) {
	if (scr_item.classList.contains('_load-map') && !scr_item.classList.contains('_loaded-map')) {
		var map_item = document.getElementById('map');

		if (map_item) {
			scr_item.classList.add('_loaded-map');
			map();
		}
	}
}

function map() {
	var scriptMapSrc = document.querySelector('script[data-src]');
	var loadMapUrl = scriptMapSrc.dataset.src;

	if (loadMapUrl) {
		scriptMapSrc.removeAttribute('data-src');
		scriptMapSrc.setAttribute('src', loadMapUrl);
	}
}

function scrParallax(block, scrProcent, blockHeight) {
	var prlxItems = block.querySelectorAll('._prlx-item');

	if (prlxItems.length > 0) {
		for (var _index18 = 0; _index18 < prlxItems.length; _index18++) {
			var prlxItem = prlxItems[_index18];
			var prlxItemAttr = prlxItem.dataset.prlx ? prlxItem.dataset.prlx : 3;
			var prlxItemValue = -1 * (blockHeight / 100 * scrProcent / prlxItemAttr);
			prlxItem.style.cssText = "transform: translateY(".concat(prlxItemValue, "px);");
		}
	}
} //FullScreenScroll


if (scr_blocks.length > 0 && !isMobile.any()) {
	disableScroll();
	window.addEventListener('wheel', full_scroll);
	var swiperScrolls = document.querySelectorAll('._swiper_scroll');

	if (swiperScrolls.length > 0) {
		for (var _index19 = 0; _index19 < swiperScrolls.length; _index19++) {
			var swiperScroll = swiperScrolls[_index19];
			swiperScroll.addEventListener("mouseenter", function (e) {
				window.removeEventListener('wheel', full_scroll);
			});
			swiperScroll.addEventListener("mouseleave", function (e) {
				window.addEventListener('wheel', full_scroll);
			});
		}
	}
}

function getPrevBlockPos(current_block_prev) {
	var viewport_height = window.innerHeight;
	var current_block_prev_height = current_block_prev.offsetHeight;
	var block_pos = offset(current_block_prev).top;

	if (current_block_prev_height >= viewport_height) {
		block_pos = block_pos + (current_block_prev_height - viewport_height);
	}

	return block_pos;
}

function full_scroll(e) {
	var viewport_height = window.innerHeight;

	if (viewport_height >= scr_min_height) {
		if (scrolling_full) {
			var current_block = document.querySelector('._scr-sector._scr-sector_current');
			var current_block_pos = offset(current_block).top;
			var current_block_height = current_block.offsetHeight;
			var current_block_next = current_block.nextElementSibling;
			var current_block_prev = current_block.previousElementSibling;

			if (e.keyCode == 40 || e.keyCode == 34 || e.deltaX > 0 || e.deltaY < 0) {
				if (current_block_height <= viewport_height) {
					if (current_block_prev) {
						full_scroll_to_sector(getPrevBlockPos(current_block_prev));
					}
				} else {
					enableScroll();

					if (currentScroll <= current_block_pos) {
						if (current_block_prev) {
							full_scroll_to_sector(getPrevBlockPos(current_block_prev));
						}
					}
				}
			} else if (e.keyCode == 38 || e.keyCode == 33 || e.deltaX < 0 || e.deltaY > 0) {
				if (current_block_height <= viewport_height) {
					if (current_block_next) {
						var block_pos = offset(current_block_next).top;
						full_scroll_to_sector(block_pos);
					}
				} else {
					enableScroll();

					if (current_block_next) {
						var _block_pos = offset(current_block_next).top;

						if (currentScroll >= _block_pos - viewport_height) {
							full_scroll_to_sector(_block_pos);
						}
					}
				}
			}
		} else {
			disableScroll();
		}
	} else {
		enableScroll();
	}
}

function full_scroll_to_sector(pos) {
	disableScroll();
	scrolling_full = false;

	_goto(pos, 800);

	var scr_pause = 500;

	if (navigator.appVersion.indexOf("Mac") != -1) {
		scr_pause = 1000;
	}

	;
	setTimeout(function () {
		scrolling_full = true;
	}, scr_pause);
}

function full_scroll_pagestart() { }

function full_scroll_pageend() { } //ScrollOnClick (Navigation)


var link = document.querySelectorAll('._goto-block');

if (link) {
	var blocks = [];

	var _loop7 = function _loop7(_index20) {
		var el = link[_index20];
		var block_name = el.getAttribute('href').replace('#', '');

		if (block_name != '' && !~blocks.indexOf(block_name)) {
			blocks.push(block_name);
		}

		el.addEventListener('click', function (e) {
			if (document.querySelector('.menu__body._active')) {
				menu_close();
				body_lock_remove(500);
			}

			var target_block_class = el.getAttribute('href').replace('#', '');
			var target_block = document.querySelector('.' + target_block_class);

			_goto(target_block, 300);

			e.preventDefault();
		});
	};

	for (var _index20 = 0; _index20 < link.length; _index20++) {
		_loop7(_index20);
	}

	window.addEventListener('scroll', function (el) {
		var old_current_link = document.querySelectorAll('._goto-block._active');

		if (old_current_link) {
			for (var _index21 = 0; _index21 < old_current_link.length; _index21++) {
				var _el2 = old_current_link[_index21];

				_el2.classList.remove('_active');
			}
		}

		for (var _index22 = 0; _index22 < blocks.length; _index22++) {
			var block = blocks[_index22];
			var block_item = document.querySelector('.' + block);

			if (block_item) {
				var block_offset = offset(block_item).top;
				var block_height = block_item.offsetHeight;

				if (pageYOffset > block_offset - window.innerHeight / 3 && pageYOffset < block_offset + block_height - window.innerHeight / 3) {
					var current_links = document.querySelectorAll('._goto-block[href="#' + block + '"]');

					for (var _index23 = 0; _index23 < current_links.length; _index23++) {
						var current_link = current_links[_index23];
						current_link.classList.add('_active');
					}
				}
			}
		}
	});
} //ScrollOnClick (Simple)


var goto_links = document.querySelectorAll('._goto');

if (goto_links) {
	var _loop8 = function _loop8(_index24) {
		var goto_link = goto_links[_index24];
		goto_link.addEventListener('click', function (e) {
			var target_block_class = goto_link.getAttribute('href').replace('#', '');
			var target_block = document.querySelector('.' + target_block_class);

			_goto(target_block, 800);

			e.preventDefault();
		});
	};

	for (var _index24 = 0; _index24 < goto_links.length; _index24++) {
		_loop8(_index24);
	}
}

function _goto(target_block, speed) {
	var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	var header = ''; //OffsetHeader
	// if (window.innerWidth < 992) {
	// 	header = 'header';
	// }

	var options = {
		speedAsDuration: true,
		speed: speed,
		header: 'header',
		offset: offset,
		easing: 'easeOutQuad'
	};
	var scr = new SmoothScroll();
	scr.animateScroll(target_block, '', options);
} //SameFunctions


function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return {
		top: rect.top + scrollTop,
		left: rect.left + scrollLeft
	};
}

function disableScroll() {
	if (window.addEventListener) // older FF
		window.addEventListener('DOMMouseScroll', preventDefault, false);
	document.addEventListener('wheel', preventDefault, {
		passive: false
	}); // Disable scrolling in Chrome

	window.onwheel = preventDefault; // modern standard

	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE

	window.ontouchmove = preventDefault; // mobile

	document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
	if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', preventDefault, false);
	document.removeEventListener('wheel', preventDefault, {
		passive: false
	}); // Enable scrolling in Chrome

	window.onmousewheel = document.onmousewheel = null;
	window.onwheel = null;
	window.ontouchmove = null;
	document.onkeydown = null;
}

function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault) e.preventDefault();
	e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
	/*if (keys[e.keyCode]) {
		preventDefault(e);
		return false;
	}*/
}

function fix_block(scr_fix_block, scr_value) {
	var window_width = parseInt(window.innerWidth);
	var window_height = parseInt(window.innerHeight);
	var header_height = parseInt(document.querySelector('header').offsetHeight) + 15;

	for (var _index25 = 0; _index25 < scr_fix_block.length; _index25++) {
		var block = scr_fix_block[_index25];
		var block_width = block.getAttribute('data-width');
		var item = block.querySelector('._side-block');

		if (!block_width) {
			block_width = 0;
		}

		if (window_width > block_width) {
			if (item.offsetHeight < window_height - (header_height + 30)) {
				if (scr_value > offset(block).top - (header_height + 15)) {
					item.style.cssText = "position:fixed;bottom:auto;top:" + header_height + "px;width:" + block.offsetWidth + "px;left:" + offset(block).left + "px;";
				} else {
					gotoRelative(item);
				}

				if (scr_value > block.offsetHeight + offset(block).top - (item.offsetHeight + (header_height + 15))) {
					block.style.cssText = "position:relative;";
					item.style.cssText = "position:absolute;bottom:0;top:auto;left:0px;width:100%";
				}
			} else {
				gotoRelative(item);
			}
		}
	}

	function gotoRelative(item) {
		item.style.cssText = "position:relative;bottom:auto;top:0px;left:0px;";
	}
}

if (!isMobile.any()) {//custom_scroll();

	/*
	window.addEventListener('wheel', scroll_animate, {
		capture: true,
		passive: true
	});
	window.addEventListener('resize', custom_scroll, {
		capture: true,
		passive: true
	});
	*/
}

function custom_scroll(event) {
	scr_body.style.overflow = 'hidden';
	var window_height = window.innerHeight;
	var custom_scroll_line = document.querySelector('._custom-scroll__line');
	var custom_scroll_content_height = document.querySelector('.wrapper').offsetHeight;
	var custom_cursor_height = Math.min(window_height, Math.round(window_height * (window_height / custom_scroll_content_height)));

	if (custom_scroll_content_height > window_height) {
		if (!custom_scroll_line) {
			var _custom_scroll = document.createElement('div');

			custom_scroll_line = document.createElement('div');

			_custom_scroll.setAttribute('class', '_custom-scroll');

			custom_scroll_line.setAttribute('class', '_custom-scroll__line');

			_custom_scroll.appendChild(custom_scroll_line);

			scr_body.appendChild(_custom_scroll);
		}

		custom_scroll_line.style.height = custom_cursor_height + 'px';
	}
}

var new_pos = pageYOffset;

function scroll_animate(event) {
	var window_height = window.innerHeight;
	var content_height = document.querySelector('.wrapper').offsetHeight;
	var start_position = pageYOffset;
	var pos_add = 100;

	if (event.keyCode == 40 || event.keyCode == 34 || event.deltaX > 0 || event.deltaY < 0) {
		new_pos = new_pos - pos_add;
	} else if (event.keyCode == 38 || event.keyCode == 33 || event.deltaX < 0 || event.deltaY > 0) {
		new_pos = new_pos + pos_add;
	}

	if (new_pos > content_height - window_height) new_pos = content_height - window_height;
	if (new_pos < 0) new_pos = 0;

	if (scrolling) {
		scrolling = false;

		_goto(new_pos, 1000);

		var scr_pause = 100;

		if (navigator.appVersion.indexOf("Mac") != -1) {
			scr_pause = scr_pause * 2;
		}

		;
		setTimeout(function () {
			scrolling = true;

			_goto(new_pos, 1000);
		}, scr_pause);
	} //If native scroll
	//disableScroll();

}