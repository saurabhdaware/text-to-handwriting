const textareaEl = document.querySelector(".page-a");

const setTextareaStyle = (attrib, v) => textareaEl.style[attrib] = v;

const EVENT_MAP = {
  "#handwriting-font": {
    on: "change",
    action: (e) => document.body.style.setProperty('--handwriting-font', e.target.value)
  },
  "#font-size": {
    on: "change",
    action: (e) => setTextareaStyle("fontSize", e.target.value + "pt"),
  },
  "#letter-spacing": {
    on: "change",
    action: (e) => setTextareaStyle("letterSpacing", e.target.value + "pt"),
  },
  "#word-spacing": {
    on: "change",
    action: (e) => setTextareaStyle("wordSpacing", e.target.value + "px"),
  },
  "#top-padding": {
    on: "change",
    action: (e) => {
      document.querySelector('.page-a .paper-content').style.paddingTop = e.target.value + 'px'
    }
  },
  // "#font-file": {
  //   on: "change",
  //   action: (e) => addFontFromFile(e.target.files[0]),
  // },
  "#ink-color": {
    on: "change",
    action: (e) => {
      document.body.style.setProperty('--ink-color', e.target.value);
    }
  },
  "#paper-margin-toggle": {
    on: "change",
    action: () => {
      if (textareaEl.classList.contains('margined')) {
        textareaEl.classList.remove('margined');
      } else {
        textareaEl.classList.add("margined");
      }
    },
  },
  "#paper-line-toggle": {
    on: "change",
    action: () => textareaEl.classList.toggle("lines"),
  },
  // "#draw-diagram-button": {
  //   on: "click",
  //   action: () => {
  //     toggleDrawCanvas();
  //     popup = "draw";
  //   },
  // },
  // ".draw-container .close-button": {
  //   on: "click",
  //   action: () => {
  //     toggleDrawCanvas();
  //     popup = "";
  //   },
  // },
  // "#pdf-preview-button": {
  //   on: "click",
  //   action: () => {
  //     togglePDFPreview();
  //     popup = "pdfpreview";
  //   },
  // },
  // ".pdf-preview-container .close-button": {
  //   on: "click",
  //   action: () => {
  //     togglePDFPreview();
  //     popup = "";
  //   },
  // },
  // "#generate-image-form": {
  //   on: "submit",
  //   action: (e) => {
  //     e.preventDefault();
  //     generateImage();
  //   },
  // },
  // "#generate-pdf": {
  //   on: "click",
  //   action: (e) => {
  //     if (generatedImages.length <= 0) {
  //       alert("No generated images found.");
  //       return;
  //     }
  //     createPDF(generatedImages);
  //   },
  // },
  // "#toggle-body": {
  //   on: "change",
  //   action: () => {
  //     toggleMode();
  //   },
  // },
};


function initiateEvents() {
  for (const event in EVENT_MAP) {
    document
      .querySelector(event)
      .addEventListener(EVENT_MAP[event].on, EVENT_MAP[event].action);
  }
  
  
  document.querySelectorAll('.switch-toggle input')
    .forEach(toggleInput => {
      toggleInput.addEventListener('change', e => {
        if (toggleInput.checked) {
          document.querySelector(`label[for="${toggleInput.id}"] .status`)
            .textContent = 'on'
          toggleInput.setAttribute('aria-pressed', true);
        } else {
          toggleInput.setAttribute('aria-pressed', false);
          document.querySelector(`label[for="${toggleInput.id}"] .status`)
            .textContent = 'off'
        }
      })
    })
}

export {
  initiateEvents
}