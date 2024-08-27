const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generatePDF = async (marks, outputPath) => {
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(outputPath));

    doc.fontSize(20).text('Student Report Card', { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text(`Name: ${marks.student.name}`);
    doc.fontSize(16).text(`Roll Number: ${marks.student.rollNumber}`);
    doc.fontSize(16).text(`Class: ${marks.student.class}`);
    doc.fontSize(16).text(`Section: ${marks.student.section}`);
    doc.moveDown();

    doc.fontSize(14).text('Subject Marks:');
    marks.subjects.forEach(subject => {
        doc.fontSize(12).text(`${subject.name}: ${subject.marks} - Grade: ${subject.grade} - Remarks: ${subject.remarks}`);
    });

    doc.end();
};
