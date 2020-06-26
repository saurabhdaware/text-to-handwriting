import {
  applyPaperStyles,
  removePaperStyles
} from './utils/generate-utils.mjs'

const pageEl = document.querySelector('.page-a');
const outputImages = [];

function renderOutput() {
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

export async function generateImages() {
  applyPaperStyles();

  const canvas = await html2canvas(pageEl, {
    scrollX: 0,
    scrollY: -window.scrollY,
    scale: 1.5
  });

  outputImages.push(canvas);

  removePaperStyles();

  renderOutput();
}