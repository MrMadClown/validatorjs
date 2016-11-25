# validator.js
Simple Form Validation jQuery Plugin.
You can customize each error-message for each field / error combination.
Designed to work with Bootstrap.

##Basic Example
```html
<script>
    $( "[data-validator=true]" ).validator( {} );
</script>
<form data-validator="true">
    <div class="form-group">
        <input data-required="true"
            type="text" class="form-control">
        <span class="help-block error--required">
            Please fill out this field
        </span>
    </div>
</form>
```
##Default Options
```javascript
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
```


For Example:
With the Attribute `data-required="true"` an Input will be required.
When the Input is Invalid, its parent `form-group` (formRowSelector) will get the `has-error` plus `has-error--required`.
With the included `validator.css` the Error Message inside `<span class="help-block error--required">` will be shown.

##Options Explained
###elementsToValidate
This Array is used to select all form Elements which will get tested for validation.
You probably won't need to change this.
###onlyValidateOnSubmit
If this is set to `false`, additionally to validating on `.submit()`
all `elementsToValidate` within the form will get validated on `.blur()`.
###errorClass
This is the default Error Class.
Change it according to your Project.
You should be fine if you use Bootstrap.
If you tinker with this you should also take a look into `validator.css`
and adjust that also.
###formRowSelector
This, in Combination with `.parents()` determines what element gets the `errorClass`.
###debug
If this is true, the Plugin will attempt to validate the Setup.
It checks all `elementsToValidate` and checks if for every validator
there is a Error Message. It will Print out a warning per missing Error Message.
It also checks if the function in a `data-callback="someFunctionName"` is defined.

##Validators Explained
All available Validators:

1. data-required="true"

2. data-length="12"

3. data-pattern="^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"

4. data-callback="someFunctionName" 

5. data-or="nameOfSomeOtherInput"

6. data-equals="nameOfSomeOtherInput" 

They get Validated in that order.

###required
`data-required="true"` 
If this attribute is present,
the Plugin will check that the value isn't empty.

###length
`data-length="12"`
If this attribute is present,
the Plugin will check that the value is equally long or longer than specified in the attribute.

###pattern
``data-pattern="^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"``
If this attribute is present,
the plugin will check if the value matches the given Pattern.

###callback
`data-callback="someFunctionName"`
If this attribute is present,
the Plugin will check if there is a function `someFunctionName` defined.
If the function is defined, it will call it and based on the return (should be a Boolean)
it marks the Input as Valid / Invalid.

###or
`data-or="nameOfSomeOtherInput"`
If this attribute is present,
the Plugin checks if this or the Input specified in the attribute is empty.
If neither of the Inputs is filled, both Inputs will be marked Invalid.

###equals
`data-equals="nameOfSomeOtherInput"` 
If this attribute is present,
the Plugin compares the value of the specified Input and the current one.
If the Values don't match, both Inputs will be marked Invalid.
