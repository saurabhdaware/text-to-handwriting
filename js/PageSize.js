function pgsize(value) {
  if (value == 'notebook') {
    document.querySelector('.page-a').style.height = (11 * 400) / 8.5 + ' px';
  }
  if (value == 'journal') {
    document.querySelector('.page-a').style.height = (250 * 400) / 176 + ' px';
  }
  if (value == 'foolscap') {
    document.querySelector('.page-a').style.height = (430 * 400) / 340 + 'px';
  }
}
