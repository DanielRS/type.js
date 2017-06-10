# typing.js

A simple and lightweight jQuery plugin for type animations. Check the [stress-test demo](http://codepen.io/DanielRS/pen/jbjoZN)

### Installation

The plugin is available in bower:

`bower install typing.js`

### Usage

Simply use jQuery's selection and call `typing`:

```javascript
...
$('p').typing({ sentences: ['Lorem ipSOM do', 'Lorem ipsum dolor SIT amet', 'Lorem ipsum dolor sit amet'] [...<other options>]});
...
```

### Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| `sentences` | `-` | List of strings to render in the selected elements. |
| `caretChar` | `_` | String that will be used as the caret character. |
| `caretClass` | `typingjs__caret` | Class to be used for the caret character. Can be styled using CSS. |

| `ignoreContent` | `false` | If set to true, the current content in the selected elements will be cleared without typing animation. |
| `ignorePrefix` | `false` | Typing animation stops on the common prefix between current sentence and next sentence. If set to true, the animation will ignore the prefix and delete all characters before starting next sentence. |
| `typeDelay` | `50` | The delay in milliseconds between each typed character. |
| `sentenceDelay` | `750` | The delay in milliseconds between each sentence. |
| `humanize` | `true` | Adds noise to typeDelay, so the typing looks less robotic. |

| `onType` | `undefined` | Callback that is called each time a new character is entered. |
| `onBackspace` | `undefined` | Callback that is called each time a new character is deleted. |
| `onFinish` | `undefined` | Callback that is called when the plugin finished its job. |
| `onSentenceFinish` | `undefined` | Callback that is called each time a sentence is finished. |

## Any alternatives?

The goal of this plugin is to be as lightweight and simple as posible, for another similar plugin check [typed.js](https://github.com/mattboldt/typed.js/)
