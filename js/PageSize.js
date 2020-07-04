function pgsize(value) {
  if (value == 'notebook') {
    document.getElementById('page-a').style.height = (11 * 400) / 8.5;
  }
  if (value == 'journal') {
    document.getElementById('page-a').style.height = (250 * 400) / 176;
  }
  if (value == 'foolscap') {
    document.getElementById('page-a').style.height = (430 * 400) / 340;
  }
}
