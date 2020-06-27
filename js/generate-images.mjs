import {
  applyPaperStyles,
  removePaperStyles,
  renderOutput
} from './utils/generate-utils.mjs'
import { createPDF } from './utils/helpers.mjs';

const pageEl = document.querySelector('.page-a');
const outputImages = [];

/**
 * To generate image, we add styles to DIV and converts that HTML Element into Image. 
 * This is the function that deals with it.
 */
async function convertDIVToImage() {
  const options = {
    scrollX: 0,
    scrollY: -window.scrollY,
    scale: 2
  }

  /** Function html2canvas comes from a library html2canvas which is included in the index.html */
  const canvas = await html2canvas(pageEl, options);
  outputImages.push(canvas);
}

/**
 * This is the function that gets called on clicking "Generate Image" button.
 */
export async function generateImages() {
  applyPaperStyles();
  pageEl.scrollTo(0, 0);
  
  const paperContentEl = document.querySelector('.page-a .paper-content');
  let scrollHeight = paperContentEl.scrollHeight;
  const clientHeight = 514; // height of .paper-content when there is no content

  const totalPages = Math.ceil(scrollHeight / clientHeight);

  if (totalPages > 1) {
    // For multiple pages
    if (paperContentEl.innerHTML.includes('<img')) {
      alert("You're trying to generate more than one page, Images and some formatting may not work correctly with multiple images")
    }
    const initialPaperContent = paperContentEl.innerHTML;
    const splitContent = initialPaperContent.split(/(\s+)/);

    // multiple images
    let wordCount = 0;
    for (let i = 0; i < totalPages; i++) {
      paperContentEl.innerHTML = '';
      const wordArray = [];
      let wordString = '';
  
      while (paperContentEl.scrollHeight <= clientHeight && wordCount <= splitContent.length) {
        wordString = wordArray.join(' ');
        wordArray.push(splitContent[wordCount]);
        paperContentEl.innerHTML = wordArray.join(' ');
        wordCount++;
      }
      paperContentEl.innerHTML = wordString;
      wordCount--;
      pageEl.scrollTo(0, 0);
      await convertDIVToImage();
      paperContentEl.innerHTML = initialPaperContent;
    }
  } else {
    // single image
    await convertDIVToImage();
  }


  removePaperStyles();
  renderOutput(outputImages);
  setRemoveImageListeners();
}

/**
 * Downloads generated images as PDF
 */
export const downloadAsPDF = () => createPDF(outputImages);

/**
 * Sets event listeners for close button on output images.
 */
function setRemoveImageListeners() {
  document.querySelectorAll('.output-image-container > .close-button')
    .forEach(closeButton => {
      closeButton.addEventListener('click', (e) => {
        outputImages.splice(Number(e.target.dataset.index), 1);
        renderOutput(outputImages);
        // When output changes, we have to set remove listeners again
        setRemoveImageListeners();
      })
    })
}