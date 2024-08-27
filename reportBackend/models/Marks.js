const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subjects: [{
        name: String,
        marks: Number,
        grade: String,
        remarks: String,
    }],
});

module.exports = mongoose.model('Marks', marksSchema);
