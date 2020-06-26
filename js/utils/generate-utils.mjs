const pageEl = document.querySelector('.page-a');
const paperContentEl = document.querySelector('.page-a .paper-content');
let paperContentPadding;

function isFontErrory() {
  // SOme fonts have padding top errors, this functions tells you if the current font has that;
  const currentHandwritingFont = document.body.style.getPropertyValue('--handwriting-font');
  return currentHandwritingFont === '' || currentHandwritingFont.includes('Homemade Apple');
}

function applyPaperStyles() {
  pageEl.style.border = 'none';
  if (isFontErrory()) {
    paperContentPadding = paperContentEl.style.paddingTop.replace(/px/g, '') || 5;
    let newPadding = Number(paperContentPadding) - 5;
    paperContentEl.style.paddingTop = `${newPadding}px`;
  }
}

function removePaperStyles() {
  pageEl.style.border = '1px solid var(--elevation-background)';
  if (isFontErrory()) {
    paperContentEl.style.paddingTop = `${paperContentPadding}px`;
  }
}
export {
  removePaperStyles,
  applyPaperStyles
}