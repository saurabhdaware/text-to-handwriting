let inkColor = '#000f55';
let pointSize = 1;
var lastX, lastY;

const drawCanvas = document.querySelector('canvas#diagram-canvas');
const ctx = drawCanvas.getContext('2d');
ctx.fillStyle = "transparent";
ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);

function setInkColor(color) {
  inkColor = color;
}

function drawPoint(x, y) {
  const canvasRect = drawCanvas.getBoundingClientRect();
  
  function fixPositions(eventX, eventY) {
    return [eventX - canvasRect.left, eventY - canvasRect.top + 32];
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
    document.querySelector('.form-container').style.filter = 'blur(0px)';
  } else {
    document.querySelector('.form-container').style.filter = 'blur(3px)';
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

/* Event listeners */
document.querySelector('#clear-draw-canvas').addEventListener('click', clear);
document.querySelector('#add-to-paper-button').addEventListener('click', addToPaper);
document.querySelector('#draw-download-button').addEventListener('click', downloadFile);

var isMouseDown = false;
drawCanvas
  .addEventListener('mousedown', e => {
    isMouseDown = true;
    lastX = e.clientX;
    lastY = e.clientY;
    drawPoint(e.clientX, e.clientY);
  }, false)

drawCanvas
  .addEventListener('mouseup', e => {
    isMouseDown = false;
    lastX = 0;
    lastY = 0;
  }, false)

drawCanvas
  .addEventListener('mousemove', e => {
    if(isMouseDown){
      drawPoint(e.clientX, e.clientY)
    }
  }, false)

export {
  setInkColor,
  drawPoint,
  toggleDrawCanvas
};