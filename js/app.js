const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const pageContainerEl = document.querySelector('.page');
const textareaEl = document.querySelector('.page > .textarea');
const overlayEl = document.querySelector('.page > .overlay');

var warped_image = document.getElementById('warped_image'),
	  warp_canvas  = document.createElement('canvas'),
    warp_context = warp_canvas.getContext('2d');

var warp_percentage_input = 0.1;

function getQuadraticBezierXYatT(start_point, control_point, end_point, T) {
  var pow1minusTsquared = Math.pow(1 - T, 2), powTsquared = Math.pow(T, 2);
  var x = pow1minusTsquared * start_point.x + 2 * (1 - T) * T * control_point.x + powTsquared * end_point.x,
      y = pow1minusTsquared * start_point.y + 2 * (1 - T) * T * control_point.y + powTsquared * end_point.y; 
  return {
    x: x,
    y: y
  };
}

function warpVertically (image_to_warp, invert_curve) {
  var image_width  = image_to_warp.width,
    image_height = image_to_warp.height,
    warp_percentage = parseFloat(warp_percentage_input, 10),
    warp_y_offset = warp_percentage * image_height;
    console.log(image_height, image_width);
  warp_canvas.width  = image_width;
  warp_canvas.height = image_height + Math.ceil(warp_y_offset * 2); 
  var start_point = {
    x: 0,
    y: 0
  };
  var control_point = {
    x: image_width / 2,
    y: invert_curve ? warp_y_offset : -warp_y_offset
  };
  var end_point = {
    x: image_width,
    y: 0
  };  
  var offset_y_points = [],
    t = 0;
  for ( ; t < image_width; t = t + 0.95) {
    var xyAtT = getQuadraticBezierXYatT(start_point, control_point, end_point, t / image_width),
        y = parseInt(xyAtT.y);
    offset_y_points.push(y);
  }
  warp_context.clearRect(0, 0, warp_canvas.width, warp_canvas.height);
  var x = 0;
  for ( ; x < image_width; x = x + 1) {
    warp_context.drawImage(image_to_warp,
      // clip 1 pixel wide slice from the image
      x, 0, 1, image_height + warp_y_offset,
      // draw that slice with a y-offset
      x, warp_y_offset + offset_y_points[x], 1, image_height + warp_y_offset
    );
  }
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
  document.querySelectorAll('a.download-button').forEach(a => {
    a.classList.add('disabled');
  }) // to disable the Download button everytime the User tries to generate an image.

  // apply extra styles to textarea to make it look like paper
  applyPaperStyles();

  try{
    const canvas = await html2canvas(document.querySelector(".page"), {
        scrollX: 0,
        scrollY: -window.scrollY
      })
    var download_source;
    document.querySelector('.output').innerHTML = '';
    var img = new Image();
    if ( document.querySelector('#paper-curve-toggle').checked ){
      img.onload = function(){
        warpVertically(img, 0);
        warped_image.src = warp_canvas.toDataURL("image/png");
      }
      img.src = canvas.toDataURL("image/jpeg");
      document.querySelector('.output').appendChild(warped_image);
      console.log(document.getElementById('warped_image'));	
      setTimeout( function(){
        download_source = document.getElementById('warped_image').src;
      } ,400);
    } else {
      img.src = canvas.toDataURL("image/jpeg");
      document.querySelector('.output').appendChild(img);
      download_source = canvas.toDataURL("image/jpeg");
    }
    setTimeout( function(){
      document.querySelectorAll('a.download-button').forEach(a => {
        a.download = 'assignment.png';
        a.href = 	download_source;
        a.classList.remove('disabled');
      })
    } , 500);
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