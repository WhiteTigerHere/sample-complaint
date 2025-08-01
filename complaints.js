const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/', (req, res) => {
  const { summary, full_text, category } = req.body;
  const sql = `INSERT INTO complaints (summary, full_text, category, priority, group_id) 
               VALUES (?, ?, ?, 'Medium', FLOOR(RAND() * 10000))`;
  db.query(sql, [summary, full_text, category], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Complaint submitted' });
  });
});

module.exports = router;
