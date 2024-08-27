const Student = require('../models/Student');
const Marks = require('../models/Marks');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const pdfGenerator = require('../utils/pdfGenerator');

// Upload Excel file and parse data
exports.uploadMarks = async (req, res) => {
    try {
        const file = req.file;
        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (const row of data) {
            const student = await Student.findOne({ rollNumber: row.RollNumber });

            if (student) {
                const marksData = {
                    student: student._id,
                    subjects: Object.keys(row).filter(key => key !== 'RollNumber').map(subject => ({
                        name: subject,
                        marks: row[subject],
                        grade: getGrade(row[subject]),
                        remarks: getRemarks(row[subject]),
                    })),
                };

                const marks = new Marks(marksData);
                await marks.save();
            }
        }

        fs.unlinkSync(file.path);  // Delete the file after processing

        res.status(200).json({ message: 'Marks uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading marks', error });
    }
};

const getGrade = (marks) => {
    if (marks >= 90) return 'A1';
    if (marks >= 80) return 'A2';
    if (marks >= 70) return 'B1';
    // Add more conditions as needed
    return 'F';
};

const getRemarks = (marks) => {
    if (marks >= 90) return 'Excellent';
    if (marks >= 80) return 'Very Good';
    if (marks >= 70) return 'Good';
    // Add more conditions as needed
    return 'Needs Improvement';
};

// Generate PDF report for all students
exports.generateReportCards = async (req, res) => {
    try {
        const students = await Student.find();
        const reportCards = [];

        for (const student of students) {
            const marks = await Marks.findOne({ student: student._id }).populate('student');
            const pdfPath = path.join(__dirname, `../report_cards/${student.rollNumber}_report_card.pdf`);

            await pdfGenerator.generatePDF(marks, pdfPath);
            reportCards.push(pdfPath);
        }

        // Zip the files and send to client, or send each one by one
        res.status(200).json({ reportCards });
    } catch (error) {
        res.status(500).json({ message: 'Error generating report cards', error });
    }
};
