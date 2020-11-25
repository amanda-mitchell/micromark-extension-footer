function createHtmlExtension() {
  function enterFooter(event) {
    const isTight = !event.loose;
    this.getData('tightStack').push(isTight);
    if (!isTight) {
      this.lineEndingIfNeeded();
    }
    this.tag('<footer>');
  }

  function exitFooter() {
    const isTight = this.getData('tightStack').pop();
    if (!isTight) {
      this.lineEndingIfNeeded();
    }
    this.tag('</footer>');
  }

  return {
    enter: {
      footer: enterFooter,
    },
    exit: {
      footer: exitFooter,
    },
  };
}

module.exports = createHtmlExtension;
