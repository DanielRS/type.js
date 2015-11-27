# typing.js

A simple and lightweight jQuery plugin for type animations. Check the [stress-test demo](http://codepen.io/DanielRS/pen/jbjoZN)

### Installation

The plugin is available in bower:

`bower install typing.js`

### Usage

Simply use jQuery's selection and call `type`:

```javascript
...
$('p').type({ sentences: ['Lorem ipSOM do', 'Lorem ipsum dolor SIT amet', 'Lorem ipsum dolor sit amet']});
...
```

### Options

**sentences**: List of strings to render in the selected elements.

**caretChar** (Default `_`): String that will be used as the caret character.

**caretClass** (Default `typingjs__caret`): Class to be used for the caret character. Can be styled using CSS.

**ignoreContent** (Default `false`): if set to true, the current content in the selected elements will be cleared without typing animation.

**typeDelay** (Default `50`): The delay in milliseconds between each typed character.

**sentenceDelay** (Default `750`): The delay in milliseconds between each sentence.

**humanize** (Default `true`): Adds noise to typeDelay, so the typing looks less robotic.

**onType** (Default `undefined`): Callback that is called each time a new character is entered.

**onBackspace** (Default `undefined`): Callback that is called each time a new character is deleted.

**onFinish** (Default `undefined`): Callback that is called when the plugin finished its job.

**onSentenceFinish** (Default `undefined`): Callback that is called each time a sentence is finished.

## Any alternatives?

The goal of this plugin is to be as lightweight and simple as posible, for another similar plugin check [typed.js](https://github.com/mattboldt/typed.js/)
