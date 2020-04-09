import {
  isMobile,
  applyPaperStyles,
  removePaperStyles,
  addFontFromFile
} from './helpers.mjs'


const textareaEl = document.querySelector('.page > .textarea');


function toggleDrawCanvas() {
  const drawContainer = document.querySelector('.draw-container');
  if(drawContainer.classList.contains('show')) {
    // draw canvas is currently shown
    document.querySelector('.form-container').style.filter = 'blur(0px)';
  } else {
    document.querySelector('.form-container').style.filter = 'blur(3px)';
  }

  drawContainer.classList.toggle('show');
}


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

  try{
    const canvas = await html2canvas(document.querySelector(".page"), {
        scrollX: 0,
        scrollY: -window.scrollY
      })
    
    document.querySelector('.output').innerHTML = '';
    const img = document.createElement('img');
    img.src = canvas.toDataURL("image/jpeg");
    document.querySelector('.output').appendChild(img);

    document.querySelectorAll('a.download-button').forEach(a => {
      a.href = img.src;
      a.download = 'assignment';
      a.classList.remove('disabled');
    })
  }catch(err) {
    alert("Something went wrong :(");
    console.error(err);
  }

  // Now remove styles to get textarea back to normal
  removePaperStyles();

  if(isMobile) {
    smoothlyScrollTo('#output');
  }
}

// Convert copied text to plaintext
document.querySelector("#note").addEventListener('paste', (event) => {
  if(!event.clipboardData.types.includes('Files')) {
    event.preventDefault();
    var text = event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  }
})


/**
 * Event listeners on input fields
 */

document.querySelector('select#handwriting-font')
  .addEventListener('change', e => textareaEl.style.fontFamily = e.target.value)

document.querySelector('select#ink-color')
  .addEventListener('change', e => textareaEl.style.color = e.target.value)

document.querySelector('input#font-size')
  .addEventListener('change', e => textareaEl.style.fontSize = e.target.value + 'pt')

document.querySelector('input#top-padding')
  .addEventListener('change', e => textareaEl.style.paddingTop = e.target.value + 'px')

document.querySelector('input#word-spacing')
  .addEventListener('change', e => textareaEl.style.wordSpacing = e.target.value + 'px')

document.querySelector('#font-file')
  .addEventListener('change', e => {
    addFontFromFile(e.target.files[0])
  })

document.querySelector('#paper-margin-toggle')
  .addEventListener('change', e => 
    document.querySelector('.page').classList.toggle('margined-page')
  )

document.querySelector('button#draw-diagram-button')
  .addEventListener('click', toggleDrawCanvas)

document.querySelector('.draw-container .close-button')
  .addEventListener('click', toggleDrawCanvas)

// Generate image on form submit
document.querySelector('form#generate-image-form')
  .addEventListener('submit', e => {
    e.preventDefault(); // prevents reloading
    generateImage();
  })


/***
 * Mostly the code nobody has to care about
*/

function smoothlyScrollTo(hashval) {
  let target = document.querySelector(hashval)
  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
  history.pushState(null, null, hashval)
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]')
  .forEach(item => {
    item.addEventListener('click', (e)=> {
      let hashval = item.getAttribute('href')
      smoothlyScrollTo(hashval);
      e.preventDefault()
    })
  })


// Too lazy to change year in footer every year soo...
document.querySelector('#year').innerHTML = new Date().getFullYear();
