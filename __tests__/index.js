import micromark from 'micromark';

import syntax from '../index.js';
import html from '../html.js';

function renderMarkdown(document) {
  return micromark(document, {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });
}

function expectRenderResult(document, expectation) {
  expect(renderMarkdown(document)).toEqual(expectation);
}

test('it parses a single line footer', () => {
  expectRenderResult('^^ a footer', '<footer>a footer</footer>');
});

test('it allows omission of whitespace after the prefix', () => {
  expectRenderResult('^^a footer', '<footer>a footer</footer>');
});

test('it does not parse a ^^^ prefix', () => {
  expectRenderResult('^^^ a footer', '<p>^^^ a footer</p>');
});

test('it parses a multi line footer', () => {
  expectRenderResult(
    `^^ a footer
with a second line`,
    `<footer>
<p>a footer
with a second line</p>
</footer>`
  );
});

test('it ignores the ^^ prefix on successive lines', () => {
  expectRenderResult(
    `^^ a footer
^^ with a second line`,
    `<footer>
<p>a footer
with a second line</p>
</footer>`
  );
});

test('it allows a footer inside of a blockquote', () => {
  expectRenderResult(
    `> a quotation
>
> ^^ its citation`,
    `<blockquote>
<p>a quotation</p>
<footer>its citation</footer>
</blockquote>`
  );
});

// FIXME: It seems like the list item text should be wrapped in a <p>
test('it allows a footer inside of a list item', () => {
  expectRenderResult(
    `* list item
	continuation of list item
  ^^ footer in list item`,
    `<ul>
<li>list item
continuation of list item<footer>footer in list item</footer></li>
</ul>`
  );
});

test('it allows a blockquote inside of a footer', () => {
  expectRenderResult(
    `^^ a footer
^^ > containing a blockquote`,
    `<footer>
<p>a footer</p>
<blockquote>
<p>containing a blockquote</p>
</blockquote>
</footer>`
  );
});

test('it allows multi paragraph footers', () => {
  expectRenderResult(
    `^^ footer
^^
^^ second paragraph`,
    `<footer>
<p>footer</p>
<p>second paragraph</p>
</footer>`
  );
});
