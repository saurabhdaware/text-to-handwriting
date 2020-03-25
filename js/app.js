async function generateImage() {
  document.querySelector('.overlay').style.display = 'block';
  document.querySelector('.paper').classList.remove('paper-holder');

  const canvas = await html2canvas(document.querySelector(".page"), {
      scrollX: 0,
      scrollY: -window.scrollY
  })
  
  document.querySelector('.output').innerHTML = '';
  const img = document.createElement('img');
  img.src = canvas.toDataURL("image/jpeg");
  document.querySelector('.output').appendChild(img);
  document.querySelector('.paper').classList.add('paper-holder');
  document.querySelector('.overlay').style.display = 'none';
  location.href = '#output';
}



document.querySelector('#handwriting-font').addEventListener('change', e => {
  document.querySelector('.paper').style.fontFamily = e.target.value;
})

document.querySelector('#ink-color').addEventListener('change', e => {
  document.querySelector('.paper').style.color = e.target.value;
})

document.querySelector('.generate-image').addEventListener('click', generateImage)