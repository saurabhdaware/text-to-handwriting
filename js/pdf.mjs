function createPDF(imgs) {

    var doc = new jsPDF('p', 'pt', 'a4');
    var width = doc.internal.pageSize.width;
    var height = doc.internal.pageSize.height;
    for (var i = 0; i < imgs.length; i++) {
        doc.text(10, 20, 'Scanned by Anonymous Scanner');
        doc.addImage(imgs[i], 'JPEG', 25, 50, width - 50, (height - 80), 36);
        if (i != imgs.length - 1) {
            doc.addPage();
        }
    }
    doc.save();
}

export {
    createPDF
};