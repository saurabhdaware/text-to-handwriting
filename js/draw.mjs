import { isMobile } from './helpers.mjs';

let inkColor = '#000f55';
let pointSize = isMobile ? .5 : 1;
var lastX, lastY;

const drawCanvas = document.querySelector('canvas#diagram-canvas');
const ctx = drawCanvas.getContext('2d');
ctx.fillStyle = "transparent";
ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
// Set smaller canvas on mobiles
if(isMobile) {
  drawCanvas.height = 150
  drawCanvas.width = 300
}

function setInkColor(color) {
  inkColor = color;
}

function drawPoint(x, y) {
  const canvasRect = drawCanvas.getBoundingClientRect();
  
  function fixPositions(eventX, eventY) {
    if(isMobile) {
      return [
        eventX - canvasRect.left, 
        eventY - canvasRect.top
      ];
    }

    return [
      eventX - canvasRect.left, 
      eventY - canvasRect.top + 32
    ];
  }

  if (lastX && lastY && (x !== lastX || y !== lastY)) {
    ctx.lineWidth = 2 * pointSize;
    ctx.beginPath();
    ctx.strokeStyle = inkColor;
    ctx.moveTo(...fixPositions(lastX, lastY));
    ctx.lineTo(...fixPositions(x, y));
    ctx.stroke();
  }

  ctx.beginPath(); //Start path
  ctx.fillStyle = inkColor;

  ctx.arc(
    ...fixPositions(x, y),
    pointSize, 
    0, 
    Math.PI * 2, 
    true
  ); // Draw a point using the arc function of the canvas with a point structure.

  ctx.fill(); // Close 

  lastX = x;
  lastY = y;
}
  

function toggleDrawCanvas() {
  const drawContainer = document.querySelector('.draw-container');
  if(drawContainer.classList.contains('show')) {
    // draw canvas is currently shown
    document.querySelector('main').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
  } else {
    document.querySelector('main').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
  }

  drawContainer.classList.toggle('show');
}


function clear() {
  ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
}

function downloadFile() {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = drawCanvas.toDataURL('image/png');
  a.download = 'diagram.png';
  document.body.appendChild(a);
  a.click();
}

function addToPaper() {
  document.querySelector('#note').innerHTML = /* html */`
    <img style="width: 100%;" src="${drawCanvas.toDataURL('image/png')}" />
  ` + document.querySelector('#note').innerHTML;

  toggleDrawCanvas();
}

var isMouseDown = false;

const onMouseDown = e => {
  isMouseDown = true;
  lastX = e.clientX;
  lastY = e.clientY;
  drawPoint(e.clientX, e.clientY);
}


const onMouseUp = e => {
  isMouseDown = false;
  lastX = 0;
  lastY = 0;
}

const onMouseMove = e => {
  if(isMouseDown){
    drawPoint(e.clientX, e.clientY)
  }
}

const onTouchStart = e => {
  isMouseDown = true;
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;

  lastX = touchX;
  lastY = touchY;
  drawPoint(touchX, touchY);
}

const onTouchEnd = e => {
  isMouseDown = false;
  lastX = 0;
  lastY = 0;
}

const onTouchMove = e => {
  e.preventDefault();
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;

  drawPoint(touchX, touchY);
}



/* Event listeners */
document.querySelector('#clear-draw-canvas').addEventListener('click', clear);
document.querySelector('#add-to-paper-button').addEventListener('click', addToPaper);
document.querySelector('#draw-download-button').addEventListener('click', downloadFile);

if(isMobile) {
  drawCanvas.addEventListener('touchstart', onTouchStart, {passive: true});
  drawCanvas.addEventListener('touchend', onTouchEnd, {passive: true});
  drawCanvas.addEventListener('touchmove', onTouchMove, {passive: true});
} else {
  drawCanvas.addEventListener('mousedown', onMouseDown, {passive: true})
  drawCanvas.addEventListener('mouseup', onMouseUp, {passive: true})
  drawCanvas.addEventListener('mousemove', onMouseMove, {passive: true})
}


export {
  setInkColor,
  drawPoint,
  toggleDrawCanvas
};