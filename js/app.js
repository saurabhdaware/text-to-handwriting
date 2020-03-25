const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function applyPaperStyles() {
  document.querySelector('.overlay').style.display = 'block';
  document.querySelector('.paper').classList.remove('paper-holder');
  if(isMobile) {
    document.querySelector('.page').style.transform = 'scale(1)';
  }
}

function removePaperStyles() {
  document.querySelector('.overlay').style.display = 'none';
  document.querySelector('.paper').classList.add('paper-holder');
  if(isMobile) {
    document.querySelector('.page').style.transform = 'scale(0.6)';
  }
}


async function generateImage() {
  // apply extra styles to textarea to make it look like paper
  applyPaperStyles();

  const canvas = await html2canvas(document.querySelector(".page"), {
      scrollX: 0,
      scrollY: -window.scrollY
    })
  
  document.querySelector('.output').innerHTML = '';
  const img = document.createElement('img');
  img.src = canvas.toDataURL("image/jpeg");
  document.querySelector('.output').appendChild(img);

  // Now remove styles to get textarea back to normal
  removePaperStyles();
  location.href = '#output';
}



document.querySelector('#handwriting-font').addEventListener('change', e => {
  document.querySelector('.paper').style.fontFamily = e.target.value;
})

document.querySelector('#ink-color').addEventListener('change', e => {
  document.querySelector('.paper').style.color = e.target.value;
})

document.querySelector('.generate-image').addEventListener('click', generateImage)