# @amanda-mitchell/micromark-extension-footer

**[micromark](https://github.com/micromark/micromark)** extension to support a CommonMark [proposal for footers](https://talk.commonmark.org/t/syntax-for-footer/2070).

This package provides the low-level modules for integrating with the micromark tokenizer and the micromark HTML compiler.

## Installation

```
yarn add @amanda-mitchell/micromark-extension-footer
```

## Usage

`micromark` can be configured to use this plugin by specifying its `extensions` and `htmlExtensions` options:

```javascript
const micromark = require('micromark');

const syntax = require('@amanda-mitchell/micromark-extension-footer');
const html = require('@amanda-mitchell/micromark-extension-footer/html');

const document = `hello, world!

^^ a footer
`;

const renderedDocument = micromark(document, {
  extensions: [syntax()],
  htmlExtensions: [html()],
});

console.log(renderedDocument);
```

When run, this script will output

```html
<p>hello, world!</p>
<footer>a footer</footer>
```
