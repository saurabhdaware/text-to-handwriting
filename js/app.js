const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const pageContainerEl = document.querySelector('.page');
const textareaEl = document.querySelector('.page > .textarea');
const overlayEl = document.querySelector('.page > .overlay');

function readFile(fileObj) {
  const reader = new FileReader();
  reader.onload = e => {
    const newFont = new FontFace('temp-font', e.target.result);
    newFont.load()
      .then(loadedFace => {
        document.fonts.add(loadedFace);
        textareaEl.style.fontFamily = 'temp-font';
      })
  }
  reader.readAsArrayBuffer(fileObj)
}


function applyPaperStyles() {
  pageContainerEl.style.border = 'none';
  pageContainerEl.style.background = 'linear-gradient(to right,#eee, #ddd)';
  overlayEl.style.background = `linear-gradient(${Math.random()*360}deg, #0008, #0000)`
  overlayEl.style.display = 'block';
  textareaEl.classList.add('paper');
}

// applyPaperStyles();

function removePaperStyles() {
  pageContainerEl.style.border = '1px solid #ccc';
  pageContainerEl.style.background = 'linear-gradient(to right,#fff, #fff)';
  overlayEl.style.display = 'none';
  textareaEl.classList.remove('paper');
}


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
  event.preventDefault();
  var text = event.clipboardData.getData("text/plain");
  document.execCommand("insertHTML", false, text);
})



document.querySelector('select#handwriting-font').addEventListener('change', e => {
  textareaEl.style.fontFamily = e.target.value;
})

document.querySelector('select#ink-color').addEventListener('change', e => {
  textareaEl.style.color = e.target.value;
})

document.querySelector('input#font-size').addEventListener('change', e => {
  textareaEl.style.fontSize = e.target.value + 'pt';
})

document.querySelector('input#top-padding').addEventListener('change', e => {
  textareaEl.style.paddingTop = e.target.value + 'px';
})

document.querySelector('input#word-spacing').addEventListener('change', e => {
  textareaEl.style.wordSpacing = e.target.value + 'px';
})

document.querySelector('#font-file').addEventListener('change', e => {
  readFile(e.target.files[0])
})

document.querySelector('#paper-margin-toggle').addEventListener('change', e => {
  document.querySelector('.page').classList.toggle('margined-page');
})

document.querySelector('#year').innerHTML = new Date().getFullYear();

document.querySelector('.generate-image').addEventListener('click', generateImage)


function smoothlyScrollTo(hashval) {
  let target = document.querySelector(hashval)
  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
  history.pushState(null, null, hashval)
}
// Smooth scroll
const anchorlinks = document.querySelectorAll('a[href^="#"]');

for (let item of anchorlinks) { // relitere 
  item.addEventListener('click', (e)=> {
    let hashval = item.getAttribute('href')
    smoothlyScrollTo(hashval);
    e.preventDefault()
  })
}