const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware to parse URL-encoded bodies (from HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.URL);


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connection open');
});

// Create a data schema
const noteSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    message: String
});

const Note = mongoose.model('Note', noteSchema);

// Serve the HTML form on GET request
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Form.html');
});

// Handle form submission on POST request
app.post('/', async (req, res) => {
    const newNote = new Note({
        Name: req.body.Name,
        Email: req.body.Email,
        message: req.body.message
    });

    try {
        await newNote.save();
        res.send("Successfully saved to database.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to save to database.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});

