import {
  applyPaperStyles,
  removePaperStyles,
  renderOutput
} from './utils/generate-utils.mjs'

const pageEl = document.querySelector('.page-a');
const outputImages = [];

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

export async function generateImages() {
  applyPaperStyles();
  pageEl.scrollTo(0, 0);
  const pageHeight = 564;
  const paperContentEl = document.querySelector('.page-a .paper-content');
  const totalPages = Math.ceil(paperContentEl.offsetHeight / pageHeight);
  console.log(paperContentEl.offsetHeight / pageHeight);


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
  
      while (paperContentEl.offsetHeight <= pageHeight && wordCount <= splitContent.length) {
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
}