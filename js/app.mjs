import {
  isMobile,
  applyPaperStyles,
  removePaperStyles,
  addFontFromFile,
  createPDF,
  smoothlyScrollTo,
} from './helpers.mjs';

import { setInkColor, toggleDrawCanvas } from './draw.mjs';


const textareaEl = document.querySelector('.page > .textarea');
const page = document.querySelector('.page');
var generatedImages = [];

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

    // Push image to generated images to create PDF
    generatedImages.push(img.src);
    document.querySelector('#image-count').innerHTML = generatedImages.length;

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
  '#letter-spacing': {
    on: 'change',
    action: (e) => setTextareaStyle('letterSpacing', e.target.value + 'pt'),
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
  '#paper-line-toggle': {
    on: 'change',
    action: () => textareaEl.classList.toggle('lines'),
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
  '#generate-pdf': {
    on: 'click',
    action: (e) => {
      if(generatedImages.length <= 0) {
        alert("No generated images found.");
        return;
      }
      createPDF(generatedImages);
    }
  }
};

for (const event in EVENT_MAP) {
  document
    .querySelector(event)
    .addEventListener(EVENT_MAP[event].on, EVENT_MAP[event].action);
}


// Set paper lines to true on init
EVENT_MAP['#paper-line-toggle'].action();

// Fetch and set contributors
fetch('https://api.github.com/repos/saurabhdaware/text-to-handwriting/contributors')
  .then(res => res.json())
  .then(res => {
    document.querySelector('#project-contributors')
      .innerHTML = res.map(contributor => /* html */`
        <div class="contributor-profile shadow">
          <a href="${contributor.html_url}">
            <img class="contributor-avatar" src="${contributor.avatar_url}" />
            <div class="contributor-username">${contributor.login}</div>
          </a>
        </div>
      ` ).join('');
  })

// Too lazy to change year in footer every year soo...
document.querySelector('#year').innerHTML = new Date().getFullYear();
