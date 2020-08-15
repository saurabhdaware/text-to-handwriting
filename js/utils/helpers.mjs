const pageEl = document.querySelector('.page-a');
const fixedPage = document.querySelector(
  '.display-flex.left-margin-and-content'
);
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function addFontFromFile(fileObj) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const newFont = new FontFace('temp-font', e.target.result);
    newFont.load().then((loadedFace) => {
      document.fonts.add(loadedFace);
      pageEl.style.fontFamily = 'temp-font';
    });
  };
  reader.readAsArrayBuffer(fileObj);
}

/**
 * @method createPDF
 * @param imgs array of images (in base64)
 * @description
 * Creates PDF from list of given images
 */
function createPDF(imgs) {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF('p', 'pt', 'a4');
  const width = doc.internal.pageSize.width;
  const height = doc.internal.pageSize.height;
  for (const i in imgs) {
    doc.text(10, 20, '');
    doc.addImage(
      imgs[i],
      'JPEG',
      25,
      50,
      width - 50,
      height - 80,
      'image-' + i
    );
    if (i != imgs.length - 1) {
      doc.addPage();
    }
  }
  doc.save();
}

function formatText(event) {
  event.preventDefault();
  const text = event.originalEvent.clipboardData
    .getData('text/plain')
    .replace(/\n/g, '<br/>');
  document.execCommand('insertHTML', false, text);
}

function preventNewDiv(event) {
  if (event.key === 'Enter') {
    document.execCommand('insertLineBreak');
    event.preventDefault();
  }
}

function setEndOfContenteditable(contentEditableElement) {
  let range;
  let selection;
  if (document.createRange) {
    range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection) {
    // IE 8 and lower
    range = document.body.createTextRange();
    range.moveToElementText(contentEditableElement);
    range.collapse(false);
    range.select();
  }
}

function trimContent(event) {
  const fixedHeight = fixedPage.clientHeight;
  let flag = false;
  const className = '.' + this.className;
  const paddingTop = parseInt(
    $(className).css('padding-top').replace('px', '')
  );
  while (fixedHeight < this.scrollHeight - paddingTop) {
    flag = true;
    let innerContent = this.innerHTML;
    innerContent = innerContent.substring(0, innerContent.length - 1);
    this.innerHTML = innerContent;
  }
  if (flag) setEndOfContenteditable(this);
}

function addPage() {
  const pageList = document.querySelectorAll('.page-a');
  const pageArr = [...pageList];
  const lastNode = pageArr[pageArr.length - 1];
  const newNode = lastNode.cloneNode(true);
  newNode
    .querySelectorAll('div[contenteditable=true]')
    .forEach((node) => (node.innerHTML = ''));
  lastNode.insertAdjacentElement('afterend', newNode);
}

function removePage() {
  const pageList = document.querySelectorAll('.page-a');
  const pageArr = [...pageList];
  const lastNode = pageArr[pageArr.length - 1];
  if (pageArr.length > 1) lastNode.remove();
}
export {
  isMobile,
  addFontFromFile,
  createPDF,
  formatText,
  preventNewDiv,
  trimContent,
  addPage,
  removePage
};
