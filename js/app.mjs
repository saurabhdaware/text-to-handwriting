import {
  isMobile,
  applyPaperStyles,
  removePaperStyles,
  addFontFromFile,
  smoothlyScrollTo
} from './helpers.mjs';

import { setInkColor, toggleDrawCanvas } from './draw.mjs';

const textareaEl = document.querySelector('.page > .textarea');
const page = document.querySelector('.page');

/**
 * @method generateImage()
 * @description
 *    1. Apply CSS Styles that make text field look like paper
 *    2. Use html2canvas library to turn the HTML DOM to Canvas
 *    3. Get image out of canvas and render new <img> tag
 *    4. Enable download image buttons
 *    5. Remove the previously applied CSS Styles.
 */
async function generateImage() {
  // apply extra styles to textarea to make it look like paper
  applyPaperStyles();

  try {
    const canvas = await html2canvas(page, {
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    const output = document.querySelector('.output');
    const img = new Image();
    img.src = canvas.toDataURL('image/jpeg');
    output.innerHTML = '';
    output.appendChild(img);

    document.querySelectorAll('a.download-button').forEach((a) => {
      a.href = img.src;
      a.download = 'assignment';
      a.classList.remove('disabled');
    });
  } catch (err) {
    alert('Something went wrong :(');
    console.error(err);
  }

  // Now remove styles to get textarea back to normal
  removePaperStyles();

  if (isMobile) {
    smoothlyScrollTo('#output');
  }
}

// // Convert copied text to plaintext
// document.querySelector('#note').addEventListener('paste', (event) => {
//   // If type is NOT "Files" then only convert to plain text or else copy as it is.
//   if (!event.clipboardData.types.includes('Files')) {
//     event.preventDefault();
//     const text = event.clipboardData.getData('text/plain');
//     document.execCommand('insertHTML', false, text);
//   }
// });

/**
 * Event listeners on input fields
 */

/**
 *
 * @param {string} attrib
 * @param {any} value
 */
const setTextareaStyle = (attrib, v) => {
  textareaEl.style[attrib] = v;
};


const EVENT_MAP = {
  '#handwriting-font': {
    on: 'change',
    action: (e) => setTextareaStyle('fontFamily', e.target.value),
  },
  '#font-size': {
    on: 'change',
    action: (e) => setTextareaStyle('fontSize', e.target.value + 'pt'),
  },
  '#word-spacing': {
    on: 'change',
    action: (e) => setTextareaStyle('wordSpacing', e.target.value + 'px'),
  },
  '#top-padding': {
    on: 'change',
    action: (e) => setTextareaStyle('paddingTop', e.target.value + 'px'),
  },
  '#font-file': {
    on: 'change',
    action: (e) => addFontFromFile(e.target.files[0]),
  },
  '#ink-color': {
    on: 'change',
    action: (e) => {
      setTextareaStyle('color', e.target.value);
      setInkColor(e.target.value);
    },
  },
  '#paper-margin-toggle': {
    on: 'change',
    action: () => page.classList.toggle('margined-page'),
  },
  '#draw-diagram-button': {
    on: 'click',
    action: toggleDrawCanvas,
  },
  '.draw-container .close-button': {
    on: 'click',
    action: toggleDrawCanvas,
  },
  '#generate-image-form': {
    on: 'submit',
    action: (e) => {
      e.preventDefault();
      generateImage();
    },
  },
};

for (const event in EVENT_MAP) {
  document
    .querySelector(event)
    .addEventListener(EVENT_MAP[event].on, EVENT_MAP[event].action);
}

// Too lazy to change year in footer every year soo...
document.querySelector('#year').innerHTML = new Date().getFullYear();
