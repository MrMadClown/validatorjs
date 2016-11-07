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
(function ( $ ) {
	$.validator = function ( element, options ) {

		var defaults = {
			elementsToValidate: [
				"input",
				"select",
				"textarea"
			],
			onlyValidateOnSubmit: false,
			errorClass: "has-error",
			formRowSelector: ".form-group"
		};

		var plugin = this;

		plugin.settings = {};
		var _hasError = false;

		var $el = $( element );

		plugin.init = function () {
			plugin.settings = $.extend( {}, defaults, options );
			_bindEvents();
		};

		var _bindEvents = function () {
			$el.submit( function ( event ) {
				_validateForm( event );
			} );
			if ( !plugin.settings.onlyValidateOnSubmit ) {
				$el.find( plugin.settings.elementsToValidate.join( "," ) ).blur( function () {
					_validateInput( $( this ) );
				} );
			}
		};

		var _validateForm = function ( event ) {
			_hasError = false;
			$el.find( plugin.settings.elementsToValidate.join( "," ) ).each( function () {
				_validateInput( $( this ) );
			} );

			if ( _hasError ) {
				event.preventDefault();
			}
		};

		var _validateInput = function ( $input ) {
			_handleRequired( $input );
			_handleLength( $input );
			_handlePattern( $input );
			_handleCallBack( $input );
			_handleOr( $input );
			_handleEquals( $input );
		};

		var _handleRequired = function ( $input ) {
			if ( $input.data( "required" ) ) {
				if ( _isEmpty( $input ) ) {
					_hasError = true;
					_setError( $input, "required" );
				}
				else {
					_removeError( $input, "required" );
				}
			}
		};

		var _handleLength = function ( $input ) {
			if ( $input.data( "length" ) && !_isEmpty( $input ) ) {
				if ( $input.val().length >= parseInt( $input.data( "length" ) ) ) {
					_removeError( $input, "length" );
				}
				else {
					_hasError = true;
					_setError( $input, "length" );
				}
			}
		};

		var _handlePattern = function ( $input ) {
			if ( $input.data( "pattern" ) && !_isEmpty( $input ) ) {
				if ( (new RegExp( $input.data( "pattern" ) )).test( $input.val() ) ) {
					_removeError( $input, "pattern" );
				}
				else {
					_hasError = true;
					_setError( $input, "pattern" );
				}
			}
		};

		var _handleCallBack = function ( $input ) {
			if ( $input.data( "callback" ) && !_isEmpty( $input ) ) {
				var functionName = $input.data( "callback" );
				if ( typeof window[functionName] === "function" ) {
					if ( window[functionName]( $input ) ) {
						_removeError( $input, "callback" );
					}
					else {
						_hasError = true;
						_setError( $input, "callback" );
					}
				}
			}
		};

		var _handleOr = function ( $input ) {
			if ( $input.data( "or" ) ) {
				var or = $input.data( "or" );
				if ( !_isEmpty( $el.find( '[name=' + or + ']' ) ) || !_isEmpty( $input ) ) {
					_removeError( $input, "or" );
				}
				else {
					_hasError = true;
					_setError( $input, "or" );
				}
			}
		};

		var _handleEquals = function ( $input ) {
			if ( $input.data( "equals" ) ) {
				var equals = $input.data( "equals" );
				if ( $el.find( '[name=' + equals + ']' ).val() === $input.val() ) {
					_removeError( $input, "equals" );
				}
				else {
					_hasError = true;
					_setError( $input, "equals" );
				}
			}
		};

		var _isEmpty = function ( $input ) {
			return $input.val() === "";
		};

		var _setError = function ( $input, errorType ) {
			if ( !$input.parents( plugin.settings.formRowSelector ).hasClass( plugin.settings.errorClass ) ) {
				$input.parents( plugin.settings.formRowSelector ).addClass( plugin.settings.errorClass );
			}
			if ( !$input.parents( plugin.settings.formRowSelector ).hasClass( plugin.settings.errorClass + "--" + errorType ) ) {
				$input.parents( plugin.settings.formRowSelector ).addClass( plugin.settings.errorClass + "--" + errorType );
			}
			var errors = _getErrorsFromInput( $input );
			if ( !errors.includes( errorType ) ) {
				errors.push( errorType );
				$input.data( "errors", errors );
			}
		};

		var _removeError = function ( $input, errorType ) {
			var errors = _getErrorsFromInput( $input );
			if ( errors.includes( errorType ) ) {
				errors = errors.filter( function ( i ) {
					return i != errorType
				} );
				$input.data( "errors", errors );
			}
			$input.parents( plugin.settings.formRowSelector ).removeClass( plugin.settings.errorClass + "--" + errorType );
			if ( errors.length == 0 ) {
				$input.parents( plugin.settings.formRowSelector ).removeClass( plugin.settings.errorClass );
			}
		};

		var _getErrorsFromInput = function ( $input ) {
			var errors = $input.data( "errors" );
			if ( errors == undefined ) {
				errors = [];
			}
			return errors;
		};

		plugin.init();
	};

	$.fn.validator = function ( options ) {
		return this.each( function () {
			if ( undefined == $( this ).data( 'plugin--validator' ) ) {
				var plugin = new $.validator( this, options );
				$( this ).data( 'plugin--validator', plugin );
			}
		} );
	};
})( jQuery );