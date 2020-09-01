import {
  applyPaperStyles,
  removePaperStyles,
  renderOutput
} from './utils/generate-utils.mjs';
import { createPDF } from './utils/helpers.mjs';

const outputImages = [];

/**
 * To generate image, we add styles to DIV and converts that HTML Element into Image.
 * This is the function that deals with it.
 */
async function convertDIVToImage(pageEl) {
  const options = {
    scrollX: 0,
    scrollY: -window.scrollY,
    scale: document.querySelector('#resolution').value
  };

  /** Function html2canvas comes from a library html2canvas which is included in the index.html */
  const canvas = await html2canvas(pageEl, options);

  /** Send image data for modification if effect is scanner */
  if (document.querySelector('#page-effects').value === 'scanner') {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    contrastImage(imageData, 0.55);
    canvas.getContext('2d').putImageData(imageData, 0, 0);
  }
  return canvas;
}

/**
 * This is the function that gets called on clicking "Generate Image" button.
 */
export async function generateImages() {
  let pageEl;
  const allPagePromises = [];
  const allPaperStylePromises = [];
  const allRemoveStylePromises = [];
  const paperContentEl = document.querySelectorAll('.page-a');
  const paperArr = [...paperContentEl];
  const totalPages = paperArr.length;
  for (let index = 0; index < totalPages; index++) {
    pageEl = paperArr[index];
    pageEl.scrollTo(0, 0);
    allPaperStylePromises.push(applyPaperStyles(pageEl));
    allPagePromises.push(convertDIVToImage(pageEl));
    allRemoveStylePromises.push(removePaperStyles(pageEl));
  }
  await Promise.all(allPaperStylePromises);
  const allPages = await Promise.all(allPagePromises);
  await Promise.all(allRemoveStylePromises);
  outputImages.push(...allPages);
  // Displaying no. of images on addition
  if (outputImages.length >= 1) {
    document.querySelector('#output-header').textContent =
      'Output ' + '( ' + outputImages.length + ' )';
  }
  renderOutput(outputImages);
  setRemoveImageListeners();
}

/**
 * Downloads generated images as PDF
 *
 */
export const downloadAsPDF = () => createPDF(outputImages);

/**
 * Sets event listeners for close button on output images.
 */
function setRemoveImageListeners() {
  document
    .querySelectorAll('.output-image-container > .close-button')
    .forEach((closeButton) => {
      closeButton.addEventListener('click', (e) => {
        outputImages.splice(Number(e.target.dataset.index), 1);
        // Displaying no. of images on deletion
        if (outputImages.length >= 0) {
          document.querySelector('#output-header').textContent =
            'Output' +
            (outputImages.length ? ' ( ' + outputImages.length + ' )' : '');
        }
        renderOutput(outputImages);
        // When output changes, we have to set remove listeners again
        setRemoveImageListeners();
      });
    });
}

/** Modifies image data to add contrast */

function contrastImage(imageData, contrast) {
  const data = imageData.data;
  contrast *= 255;
  const factor = (contrast + 255) / (255.01 - contrast);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
  return imageData;
}
