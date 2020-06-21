import {
  isMobile,
  applyPaperStyles,
  removePaperStyles,
  addFontFromFile,
  createPDF,
  smoothlyScrollTo
} from './helpers.mjs';

import { setInkColor, toggleDrawCanvas } from './draw.mjs';

import { warpVertically, warp_canvas } from './curvature.mjs';

const textareaEl = document.querySelector('.page > .textarea');
const textareaInner = document.querySelector('.page > .textarea > .paper-content');
const page = document.querySelector('.page');
const warpedImage = document.getElementById("warped-image");
const output = document.querySelector('.output');
const currentPageNo = document.querySelector('#current-page-no');

var generatedImages = [];
var previewImages = [];
let currentPage = 0;

function setDownloadSource(imageSource) {
  document.querySelectorAll('a.download-button').forEach((a) => {
    a.href = imageSource;
    a.download = 'assignment';
    a.classList.remove('disabled');
  });
  document.querySelector('#nav').style.display = 'block';
}

function disableDownloadSource(){
  document.querySelectorAll('a.download-button').forEach((a) => {
    a.classList.add('disabled');
  });
  document.querySelector('#nav').style.display = 'none';
}

function setOutputImage(imageEl) {
  output.innerHTML = '';
  output.appendChild(imageEl);
  previewImages.push(imageEl);
  // Push image to generated images to create PDF
  generatedImages.push(imageEl.src);
  setDownloadSource(imageEl.src);
  document.querySelector('#image-count').innerHTML = generatedImages.length;
  document.querySelector('#total-page-count').innerHTML = generatedImages.length;
  currentPage = generatedImages.length;
  currentPageNo.innerHTML = currentPage;
}

function setPDFPreviews() {
  document.querySelector('.preview-holder').innerHTML = generatedImages.map((imageb64, index) => {
    return `
    <div class="preview-image image-${index}">
      <button data-removeindex="${index}" class="close-image">&times;</button>
      <img src="${imageb64}">
    </div>
    `
  }).join('');

  document.querySelector('#image-count').innerHTML = generatedImages.length;
  document.querySelector('#total-page-count').innerHTML = generatedImages.length;


  document.querySelectorAll('.preview-holder .close-image')
    .forEach(closeButton =>
      closeButton.addEventListener('click', e => {
        generatedImages.splice(Number(closeButton.dataset.removeindex), 1);
        previewImages.splice(Number(closeButton.dataset.removeindex), 1);
        setPDFPreviews();
        setNavPage(generatedImages.length);
      })
    )
}

function togglePDFPreview() {
  const pdfPreviewContainer = document.querySelector('.pdf-preview-container');
  if(pdfPreviewContainer.classList.contains('show')) {
    // draw canvas is currently shown
    document.querySelector('main').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
  } else {
    document.querySelector('main').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    setPDFPreviews();
  }

  pdfPreviewContainer.classList.toggle('show');
}

function setNavPage(pageNo) {
  output.innerHTML = '';
  if(pageNo>0){
    output.appendChild(previewImages[pageNo - 1]);
    setDownloadSource(previewImages[pageNo - 1].src);
    currentPageNo.innerHTML = pageNo;
  }else{
    currentPageNo.innerHTML = 0;
    disableDownloadSource();
  }
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
  let pageHeight = 570;
  if(page.classList.contains('margined-page')){
    pageHeight = 622;
  }
  let totalPages = Math.ceil(textareaInner.offsetHeight / pageHeight);
  try {
    let originalString = textareaInner.innerText;
    let fullString = originalString.split(/(\s+)/);;
    let wordNo = 0;
    for(let i=0; i<totalPages; i++){
      textareaInner.innerText = '';
      let pageStringList = [];
      let pageString = '';
      while(textareaInner.offsetHeight <= pageHeight && wordNo <= fullString.length) {
        pageString = pageStringList.join(' ');
        pageStringList.push(fullString[wordNo]);
        textareaInner.innerText = pageStringList.join(' ');
        wordNo++;
      }
      textareaInner.innerText = pageString;
      wordNo--;
      const canvas = await html2canvas(page, {
        scrollX: 0,
        scrollY: -window.scrollY,
      });

      const img = new Image();
      if (document.querySelector('#paper-curve-toggle').checked){
        img.onload = function(){
          warpVertically(img, 0);
          warpedImage.src = warp_canvas.toDataURL("image/png");
          setOutputImage(warpedImage);
        }
        img.src = canvas.toDataURL("image/jpeg");
      } else {
        img.src = canvas.toDataURL('image/jpeg');
        setOutputImage(img);
      }
    }
    textareaInner.innerText = originalString;
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
 * Event listeners preview page navigation buttons
 */

document.querySelector('#page-nav-right').addEventListener('click', () => {
  if (currentPage < previewImages.length) {
    currentPage++;
  }
  setNavPage(currentPage);
});
document.querySelector('#page-nav-left').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
  }
  setNavPage(currentPage);
});


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

let popup = '';

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
    action: () => {
      toggleDrawCanvas();
      popup = 'draw';
    },
  },
  '.draw-container .close-button': {
    on: 'click',
    action: () => {
      toggleDrawCanvas();
      popup = '';
    },
  },
  '#pdf-preview-button': {
    on: 'click',
    action: () => {
      togglePDFPreview();
      popup = 'pdfpreview'
    },
  },
  '.pdf-preview-container .close-button': {
    on: 'click',
    action: () => {
      togglePDFPreview();
      popup = '';
    },
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

window.addEventListener('keyup', e => {
  if (e.code === 'Escape') {
    if (popup === 'pdfpreview') {
      togglePDFPreview();
    } else if (popup === 'draw') {
      toggleDrawCanvas();
    }
  }
})


// Set paper lines to true on init
EVENT_MAP['#paper-line-toggle'].action();

document.querySelector("#note").addEventListener('paste', (event) => {
  event.preventDefault();
  const text = event.clipboardData.getData("text/plain").replace(/\n/g, '<br/>');
  document.execCommand("insertHTML", false, text);
})

/**
 * i18n for China
 */
if(navigator.language.slice(0, 2) === 'zh') {

  const chineseSupportFont = "'Liu Jian Mao Cao', cursive"
  setTextareaStyle('fontFamily', chineseSupportFont)
  document.querySelector('#handwriting-font').value = chineseSupportFont;

  // set chinese lorem ipsum
  document.querySelector('#note').innerText = "嗨，您好！多谢您尝试文字转笔迹。该网站的流量一直很高，我很乐意让其他语言的人们可以访问该网站，因此，如果您有任何建议或可以帮助我使您所在国家的人们可以访问该网站。在GitHub上让我知道还是向我发送电子邮件（在GitHub中提到的电子邮件ID）";
}



// Fetch and set contributors
fetch('https://api.github.com/repos/saurabhdaware/text-to-handwriting/contributors')
  .then(res => res.json())
  .then(res => {
    document.querySelector('#project-contributors')
      .innerHTML = res.map(contributor => /* html */`
        <div class="contributor-profile shadow">
          <a href="${contributor.html_url}">
            <img 
              alt="GitHub avatar of contributor ${contributor.login}" 
              class="contributor-avatar" 
              loading="lazy" 
              src="${contributor.avatar_url}" 
            />
            <div class="contributor-username">${contributor.login}</div>
          </a>
        </div>
      ` ).join('');
  })

// Too lazy to change year in footer every year soo...
document.querySelector('#year').innerHTML = new Date().getFullYear();
