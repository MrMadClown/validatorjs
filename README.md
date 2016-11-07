# validator.js
Simple Form Validation jQuery Plugin.
You can customize each error-message for each field / error combination.
Designed to work with Bootstrap.

## Basic Example
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
All available Validatiors:
1. ```data-required="true"```

2. ```data-length="true"```

3. ```data-pattern="true"```

4. ```data-callback="true"```

5. ```data-or="true"```

6. ```data-equals="true"```

They get Validated in that order,
For Example:

With the Attribute ```data-required="true"``` an Input will be required.
When the Input is Invalid, its parent ```form-group``` will get the ```has-error``` plus ```has-error--required```.
With the included ```validator.css``` the Error Message inside ```<span class="help-block error--required">``` will be shown.

## Options
```javascript
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
```
TODO:
1. Explain Options

2. Explain all Validators
