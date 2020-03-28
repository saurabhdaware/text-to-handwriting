const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const pageContainerEl = document.querySelector('.page');
const textareaEl = document.querySelector('.page > .textarea');
const overlayEl = document.querySelector('.page > .overlay');



function distortion(outputCanvas) {
  const ctx = outputCanvas.getContext('2d');
  const distortWidth = outputCanvas.width;
  const distortHeight = outputCanvas.height*1.3;
  const x = 0;
  const y = -100;

  var imgData = ctx.getImageData(x, y, distortWidth, distortHeight);
      pixels = imgData.data,
      pixelsCopy = [], index = 0, h = distortHeight, w = distortWidth;
  
  for (var i = 0; i <= pixels.length; i+=4) {
      pixelsCopy[index] = [pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]];
      index++;
  }
  console.log(pixelsCopy);
  var result = fisheye(pixelsCopy, w, h);
  
  for(var i = 0; i < result.length; i++) {
      index = 4*i;
      if (result[i] != undefined) {
          pixels[index + 0] = result[i][0];
          pixels[index + 1] = result[i][1];
          pixels[index + 2] = result[i][2]; 
          pixels[index + 3] = result[i][3];
      }
  }
  
  ctx.putImageData(imgData, x, y);
}

function fisheye(srcpixels, w, h) {

  var dstpixels = srcpixels.slice();            
  for (var y = 0; y < h; y++) {                                

      var ny = ((2*y)/h)-1;                        
      var ny2 = ny*ny;                                

      for (var x = 0; x < w; x++) {                            

          var nx = ((2*x)/w)-1;                    
          var nx2 = nx*nx;
          var r = Math.sqrt(nx2+ny2); // Calculates radius        

          if (0.0 <= r && r <= 1.0) {                            
              var nr = Math.sqrt(1.0-r*r);            
              nr = (r + (1.0-nr)) / 2.0;

              if (nr <= 1.0) {
                  
                  var theta = Math.atan2(ny,nx);         
                  var nxn = nr*Math.cos(theta);        
                  var nyn = nr*Math.sin(theta);        
                  var x2 = parseInt(((nxn+1)*w)/2);        
                  var y2 = parseInt(((nyn+1)*h)/2);        
                  var srcpos = parseInt(y2*w+x2);            
                  if (srcpos >= 0 & srcpos < w*h) {
                      dstpixels[parseInt(y*w+x)] = srcpixels[srcpos];    
                  }
              }
          }
      }
  }
  return dstpixels;
} 


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

    distortion(canvas);
    
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