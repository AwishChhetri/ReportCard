const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://abishchhetri2502:yeXrEIFsKZPdkohn@cluster0.jeau3.mongodb.net/studentdb?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a StudentData schema
const StudentDataSchema = new mongoose.Schema({
    name: String,
    rollNo: String,
    class: String,
    section: String,
    dob: Date,
    subjects: [
        {
            name: String,
            marks: Number,
            grade: String,
        },
    ],
    attendance: {
        totalDays: Number,
        daysPresent: Number,
    },
    remarks: String,
});

// Create a model from the schema
const StudentData = mongoose.model('StudentData', StudentDataSchema);

// Route to register a new StudentData
app.post('/register', async (req, res) => {
    try {
        const studentData = new StudentData(req.body);
        await studentData.save();
        res.status(201).send(studentData);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to get a StudentData's details by ID
app.get('/StudentData/:id', async (req, res) => {
    try {
        const studentData = await StudentData.findById(req.params.id);
        if (!studentData) {
            return res.status(404).send('StudentData not found');
        }
        res.send(studentData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to get all StudentDatas
app.get('/StudentDatas', async (req, res) => {
    try {
        const studentDatas = await StudentData.find({});
        res.send(studentDatas);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to update remarks and subjects
app.post('/StudentDatas/:id/remarks', async (req, res) => {
    try {
        const studentData = await StudentData.findById(req.params.id);
        if (!studentData) {
            return res.status(404).send('StudentData not found');
        }

        // Update remarks
        if (req.body.remarks) {
            studentData.remarks = req.body.remarks;
        }

        // Update subjects
        if (req.body.subjects) {
            studentData.subjects = req.body.subjects;
        }

        await studentData.save();
        res.send(studentData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
