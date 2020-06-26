import {
  applyPaperStyles,
  removePaperStyles,
  renderOutput
} from './utils/generate-utils.mjs'

const pageEl = document.querySelector('.page-a');
const outputImages = [];

export async function generateImages() {
  applyPaperStyles();
  const pageHeight = getComputedStyle(pageEl, null).getPropertyValue('height').replace(/[a-z]/g, '');
  const contentOffsetHeight = document.querySelector('.page-a .paper-content').offsetHeight;
  const totalPages = Math.ceil(contentOffsetHeight / Number(Math.ceil(pageHeight)));
  console.log(totalPages);

  const canvas = await html2canvas(pageEl, {
    scrollX: 0,
    scrollY: -window.scrollY,
    scale: 1.5
  });

  outputImages.push(canvas);
  removePaperStyles();
  renderOutput(outputImages);
}