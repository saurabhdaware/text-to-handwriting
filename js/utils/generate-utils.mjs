const pageEl = document.querySelector('.page-a');
const paperContentEl = document.querySelector('.page-a .paper-content');
const overlayEl = document.querySelector('.overlay');

let paperContentPadding;

function isFontErrory() {
  // SOme fonts have padding top errors, this functions tells you if the current font has that;
  const currentHandwritingFont = document.body.style.getPropertyValue('--handwriting-font');
  return currentHandwritingFont === '' || currentHandwritingFont.includes('Homemade Apple');
}

function applyPaperStyles() {
  pageEl.style.border = 'none';
  console.log(document.querySelector('#page-effects').value)
  overlayEl.classList.add(document.querySelector('#page-effects').value);
  if (isFontErrory()) {
    paperContentPadding = paperContentEl.style.paddingTop.replace(/px/g, '') || 5;
    let newPadding = Number(paperContentPadding) - 5;
    paperContentEl.style.paddingTop = `${newPadding}px`;
  }
}

function removePaperStyles() {
  pageEl.style.border = '1px solid var(--elevation-background)';
  overlayEl.classList.remove(document.querySelector('#page-effects').value);
  if (isFontErrory()) {
    paperContentEl.style.paddingTop = `${paperContentPadding}px`;
  }
}


function renderOutput(outputImages) {
  if (outputImages.length <= 0) {
    document.querySelector('#output').innerHTML = "Click \"Generate Image\" Button to generate new image.";
    return;
  }
  
  document.querySelector('#output').innerHTML = outputImages
    .map((outputImageCanvas, index) => `
      <img 
        class="shadow" 
        alt="Output image ${index}" 
        src="${outputImageCanvas.toDataURL('image/jpeg')}"
      />
    `)
    .join('');
}

export {
  removePaperStyles,
  applyPaperStyles,
  renderOutput
}