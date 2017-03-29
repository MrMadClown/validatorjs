/**
 * Copyright (c) 2016 MrMadClown
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (window) {
	"use strict";

	/**
	 * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
	 */
	if (!Array.prototype.includes) {
		Array.prototype.includes = function (searchElement /*, fromIndex*/) {
			if (this == null) {
				throw new TypeError("Array.prototype.includes called on null or undefined");
			}

			var O = Object(this);
			var len = parseInt(O.length, 10) || 0;
			if (len === 0) {
				return false;
			}
			var n = parseInt(arguments[1], 10) || 0;
			var k;
			if (n >= 0) {
				k = n;
			} else {
				k = len + n;
				if (k < 0) {
					k = 0;
				}
			}
			var currentElement;
			while (k < len) {
				currentElement = O[k];
				if (searchElement === currentElement ||
					(searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
					return true;
				}
				k++;
			}
			return false;
		};
	}

	/**
	 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
	 */
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function (s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {
				}
				return i > -1;
			};
	}

	/**
	 * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
	 */
	if (!Array.prototype.filter) {
		Array.prototype.filter = function (fun/*, thisArg*/) {
			'use strict';

			if (this === void 0 || this === null) {
				throw new TypeError();
			}

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== 'function') {
				throw new TypeError();
			}

			var res = [];
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			for (var i = 0; i < len; i++) {
				if (i in t) {
					var val = t[i];

					// NOTE: Technically this should Object.defineProperty at
					//       the next index, as push can be affected by
					//       properties on Object.prototype and Array.prototype.
					//       But that method's new, and collisions should be
					//       rare, so use the more-compatible alternative.
					if (fun.call(thisArg, val, i, t)) {
						res.push(val);
					}
				}
			}

			return res;
		};
	}

	function _parents(el, selector) {
		while (el && el.parentNode) {
			el = el.parentNode;
			if (el.matches(selector)) {
				return el;
			}
		}

		// Many DOM methods return null if they don't
		// find the element they are searching for
		// It would be OK to omit the following and just
		// return undefined
		return null;
	}

	function MergeRecursive(obj1, obj2) {
		var obj3 = obj1;
		for (var p in obj2) {
			if (obj2.hasOwnProperty(p)) {
				try {
					// Property in destination object set; update its value.
					if (obj2[p].constructor == Object) {
						obj3[p] = MergeRecursive(obj3[p], obj2[p]);

					} else {
						obj3[p] = obj2[p];
					}

				} catch (e) {
					// Property in destination object not set; create it and set its value.
					obj3[p] = obj2[p];
				}
			}
		}

		return obj3;
	}

	function _validator(element, options) {

		var defaults = {
			elementsToValidate: [
				"input",
				"select",
				"textarea"
			],
			onlyValidateOnSubmit: false,
			errorClass: "has-error",
			formRowSelector: ".form-group",
			debug: true
		};

		var _validators = [
			"required",
			"length",
			"callback",
			"equals",
			"or",
			"pattern"
		];
		var _hasError = false;
		var plugin = this;
		var inputs;

		plugin.settings = {};

		plugin.init = function () {
			plugin.settings = MergeRecursive(defaults, options);
			inputs = element.querySelectorAll(plugin.settings.elementsToValidate.join(","));
			if (plugin.settings.debug) {
				_validateSetup();
			}

			_bindEvents();
		};

		plugin.destroy = function () {
			element.removeEventListener("submit");
			if (!plugin.settings.onlyValidateOnSubmit) {
				Array.prototype.slice.call(inputs).forEach(function (input) {
					input.removeEventListener("blur")
				});
			}
		};

		var _validateSetup = function () {
			Array.prototype.slice.call(inputs).forEach(function (input) {
				Object.keys(input.dataset).forEach(function (index, validator) {
					if (_validators.includes(validator)) {
						if (_getParentFromInput(input).querySelectorAll("[class*=" + validator + "]").length == 0) {
							console.warn(input, "Does not have a Error Message for the " + validator + " Validator!");
						}
						if (
							validator == "callback"
							&& typeof window[input.dataset["callback"]] != "function"
						) {
							console.warn("The function " + validator + " used as callback on " + input + " is not defined!");
						}
					}
				});
			});
		};

		var _bindEvents = function () {
			element.addEventListener("submit", function (event) {
				_validateForm(event);
			});
			if (!plugin.settings.onlyValidateOnSubmit) {
				Array.prototype.slice.call(inputs).forEach(function (input) {
					input.addEventListener("blur", function () {
						_validateInput(this);
					})
				});
			}
		};

		var _validateForm = function (event) {
			_hasError = false;
			Array.prototype.slice.call(inputs).forEach(function () {
				_validateInput(this);
			});

			if (_hasError) {
				event.preventDefault();
			}
		};

		var _validateInput = function (input) {
			_handleRequired(input);
			_handleLength(input);
			_handlePattern(input);
			_handleCallBack(input);
			_handleOr(input);
			_handleEquals(input);
		};

		var _handleRequired = function (input) {
			if (input.dataset["required"]) {
				_handle(input, _isNotEmpty, "required");
			}
		};

		var _handleLength = function (input) {
			if (input.dataset["length"] && _isNotEmpty(input)) {
				_handle(input, _validateLength, "length");
			}
		};

		var _validateLength = function (input) {
			return input.value.length >= parseInt(input.dataset["length"])
		};

		var _handlePattern = function (input) {
			if (input.dataset["pattern"] && _isNotEmpty(input)) {
				_handle(input, _validatePattern, "pattern");
			}
		};

		var _validatePattern = function (input) {
			return (new RegExp(input.dataset["pattern"])).test(input.value);
		};

		var _handleCallBack = function (input) {
			if (input.dataset["callback"] && _isNotEmpty(input)) {
				var functionName = input.dataset["callback"];
				_handle(input, window[functionName], "callback");
			}
		};

		var _handleOr = function (input) {
			if (input.dataset["or"]) {
				var or = input.dataset["or"];
				var orInput = element.querySelector("[name=" + or + "]");
				_handleDouble(input, orInput, _validateOr, "or");
			}
		};

		var _validateOr = function (input, secondInput) {
			return _isNotEmpty(input) || _isNotEmpty(secondInput);
		};

		var _handleEquals = function (input) {
			if (input.dataset["equals"]) {
				var equals = input.dataset["equals"];
				var equalsInput = element.querySelector("[name=" + equals + "]");
				_handleDouble(input, equalsInput, _validateEquals, "equals");
			}
		};

		var _validateEquals = function (input, secondInput) {
			return input.value === secondInput.value;
		};

		var _handle = function (input, condition, errorType) {
			if (typeof condition === "function") {
				if (condition(input)) {
					_removeError(input, errorType);
				}
				else {
					_hasError = true;
					_setError(input, errorType);
				}
			}
		};

		var _handleDouble = function (input, secondInput, condition, errorType) {
			if (typeof condition === "function") {
				if (condition(input, secondInput)) {
					_removeError(input, errorType);
					_removeError(secondInput, errorType);
				}
				else {
					_hasError = true;
					_setError(input, errorType);
					_setError(secondInput, errorType);
				}
			}
		};

		var _isNotEmpty = function (input) {
			return input.value !== "";
		};

		var _setError = function (input, errorType) {
			var parent = _getParentFromInput(input);
			if (!parent.classList.contains(plugin.settings.errorClass)) {
				parent.classList.add(plugin.settings.errorClass);
			}
			var errorClass = plugin.settings.errorClass + "--" + errorType;
			if (!parent.classList.contains(errorClass)) {
				parent.classList.add(errorClass);
			}
			var errors = _getErrorsFromInput(input);
			if (!errors.includes(errorType)) {
				errors.push(errorType);
				input.dataset["errors"] = errors;
			}
		};

		var _removeError = function (input, errorType) {
			var errors = _getErrorsFromInput(input);
			if (errors.includes(errorType)) {
				errors = errors.filter(function (error) {
					return error != errorType
				});
				input.dataset["errors"] = errors;
			}
			_getParentFromInput(input).classList.remove(plugin.settings.errorClass + "--" + errorType);
			if (errors.length == 0) {
				_getParentFromInput(input).classList.remove(plugin.settings.errorClass);
			}
		};

		var _getErrorsFromInput = function (input) {
			if (input.dataset.hasOwnProperty("errors")) {
				return input.dataset.errors.split(",");
			} else {
				return [];
			}
		};

		var _getParentFromInput = function (input) {
			return _parents(input, plugin.settings.formRowSelector);
		};

		plugin.init();
	}

	window.validator = function (elementSelector, options) {
		Array.prototype.slice.call(document.querySelectorAll(elementSelector)).forEach(function (element) {
			if (undefined === element.dataset["validatorPlugin"]) {
				element.dataset["validatorPlugin"] = new _validator(element, options);
			}
		});
	}
})(window);
