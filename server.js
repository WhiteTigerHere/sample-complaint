const express = require('express');
const path = require('path');
const complaints = require('./complaints');
require('dotenv').config();

const app = express();
app.use(express.json());

// Serve static files (HTML, JS, CSS) from current folder
app.use(express.static(__dirname));

// Complaints API route
app.use('/api/complaints', complaints);

// Serve index.html manually at root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
