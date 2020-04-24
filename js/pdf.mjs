function createPDF(imgs) {

    var doc = new jsPDF('p', 'pt', 'a4');
    var width = doc.internal.pageSize.width;
    var height = doc.internal.pageSize.height;
    for (let i in imgs) {
        doc.text(10, 20, 'Scanned by Anonymous Scanner');
        doc.addImage(imgs[i], 'JPEG', 25, 50, width - 50, (height - 80), "image-"+i);
        if (i != imgs.length - 1) {
            doc.addPage();
        }
    }
    doc.save();
}

export {
    createPDF
};