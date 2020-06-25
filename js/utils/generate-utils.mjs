function removePaperStyles() {
  pageContainerEl.style.border = '1px solid #ccc';
  pageContainerEl.style.background = 'linear-gradient(to right,#fff, #fff)';
  overlayEl.style.display = 'none';
  textareaEl.classList.remove('paper');
}


function applyPaperStyles() {
  pageContainerEl.style.border = 'none';
  overlayEl.style.background = `linear-gradient(${
    Math.random() * 360
  }deg, #0008, #0000)`;
  overlayEl.style.display = 'block';
}

export {
  removePaperStyles,
  applyPaperStyles
}