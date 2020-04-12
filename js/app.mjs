import {
  $,
  isMobile,
  applyPaperStyles,
  removePaperStyles,
  addFontFromFile,
  addEvent,
} from './helpers.mjs';
import { setInkColor, toggleDrawCanvas } from './draw.mjs';

const textareaEl = $('.page > .textarea');

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
    const canvas = await html2canvas($('.page'), {
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    const output = $('.output');
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

// Convert copied text to plaintext
addEvent('#note', 'paste', (event) => {
  if (!event.clipboardData.types.includes('Files')) {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  }
});

/**
 * Event listeners on input fields
 */
const ID = {
  HANDWRITING: '#handwriting-font',
  PEN_COLOR: '#ink-color',
  FONT_SIZE: '#font-size',
  TOP_PADDING: '#top-padding',
  WORD_SPACING: '#word-spacing',
  FONT_FILE: '#font-file',
  TOGGLE_MARGIN: '#paper-margin-toggle',
};

/**
 *
 * @param {string} attrib
 * @param {any} value
 */
const setStyle = (attrib, v) => {
  textareaEl.style[attrib] = v;
};

/**
 *
 * @param {ChangeEvent} e
 */
const handleToolEvents = (e) => {
  e.preventDefault();

  const id = '#' + e.target.getAttribute('id');
  switch (id) {
    case ID.HANDWRITING:
      setStyle('fontFamily', e.target.value);
      break;
    case ID.FONT_SIZE:
      setStyle('fontSize', e.target.value + 'pt');
      break;
    case ID.TOP_PADDING:
      setStyle('paddingTop', e.target.value + 'px');
      break;
    case ID.WORD_SPACING:
      setStyle('wordSpacing', e.target.value + 'px');
      break;
    case ID.FONT_FILE:
      addFontFromFile(e.target.files[0]);
      break;
    case ID.TOGGLE_MARGIN:
      $('.page').classList.toggle('margined-page');
      break;
    case ID.PEN_COLOR:
      setStyle('color', e.target.value);
      setInkColor(e.target.value);
      break;
    default:
      return;
  }
};

// form change events
document
  .querySelector('#generate-image-form')
  .addEventListener('change', handleToolEvents);

// click events
addEvent('#draw-diagram-button', 'click', toggleDrawCanvas);
addEvent('.draw-container .close-button', 'click', toggleDrawCanvas);
addEvent('#generate-image-form', 'submit', (e) => {
  e.preventDefault();
  generateImage();
});

// Too lazy to change year in footer every year soo...
$('#year').innerHTML = new Date().getFullYear();
