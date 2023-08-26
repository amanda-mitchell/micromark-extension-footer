import { codes, constants, types } from 'micromark-util-symbol';
import { markdownSpace } from 'micromark-util-character';
import { factorySpace } from 'micromark-factory-space';

const nodeNames = {
  footer: 'footer',
  prefix: 'footerPrefix',
  prefixMarker: 'footerPrefixMarker',
  prefixWhitespace: 'footerPrefixWhitespace',
};

function tokenize(effects, ok, nok) {
  const start = code => {
    if (code !== codes.caret) {
      return nok(code);
    }

    if (!this.containerState) {
      this.containerState = {};
    }

    if (!this.containerState.open) {
      this.containerState.enterEvent = effects.enter(nodeNames.footer, {
        loose: false,
      });
      this.containerState.open = true;
      this.containerState.lineCount = 0;
    }

    effects.enter(nodeNames.prefix);
    effects.enter(nodeNames.prefixMarker);
    effects.consume(code);

    return secondCaret;
  };

  function secondCaret(code) {
    if (code !== codes.caret) {
      return nok(code);
    }

    effects.consume(code);
    effects.exit(nodeNames.prefixMarker);

    return afterPrefix;
  }

  function afterPrefix(code) {
    if (code === codes.caret) {
      return nok;
    }

    if (markdownSpace(code)) {
      effects.enter(nodeNames.prefixWhitespace);
      effects.consume(code);
      effects.exit(nodeNames.prefixWhitespace);
      effects.exit(nodeNames.prefix);
      return ok;
    }

    effects.exit(nodeNames.prefix);
    return ok(code);
  }

  return start;
}

function tokenizeContinuation(effects, ok, nok) {
  this.containerState.lineCount++;
  return factorySpace(
    effects,
    effects.attempt(footer, ok, nok),
    types.linePrefix,
    constants.tabSize
  );
}

function exit(effects) {
  if (this.containerState.lineCount > 1) {
    this.containerState.enterEvent.loose = true;
  }
  effects.exit(nodeNames.footer);
}

const footer = {
  tokenize,
  continuation: { tokenize: tokenizeContinuation },
  exit,
};

export default function directive() {
  return {
    document: { [codes.caret]: [footer] },
  };
}
