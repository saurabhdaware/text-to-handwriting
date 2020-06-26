import {
  applyPaperStyles,
  removePaperStyles,
  renderOutput
} from './utils/generate-utils.mjs'

const pageEl = document.querySelector('.page-a');
const outputImages = [];

export async function generateImages() {
  applyPaperStyles();

  const canvas = await html2canvas(pageEl, {
    scrollX: 0,
    scrollY: -window.scrollY,
    scale: 1.5
  });

  outputImages.push(canvas);
  removePaperStyles();
  renderOutput(outputImages);
}