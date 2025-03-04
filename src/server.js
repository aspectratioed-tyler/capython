import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { Filter } from 'bad-words';

const db = new sqlite3.Database('./comments.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected');
  }
});

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Create an instance of the bad-words filter
const filter = new Filter();

// Endpoint to save a comment with a math question answer
app.post('/add-comment', (req, res) => {
  const { comment, mathAnswer } = req.body;

  // Math question answer logic
  const num1 = Math.floor(Math.random() * 10); // Random number between 0 and 9
  const num2 = Math.floor(Math.random() * 10); // Random number between 0 and 9
  const correctAnswer = num1 + num2;

  // Verify the answer
  if (parseInt(mathAnswer) !== correctAnswer) {
    return res.status(400).send({ error: 'Incorrect answer to the math question' });
  }

  // Filter the comment to check for profanity
  const cleanComment = filter.clean(comment); // This will replace bad words with *

  // If the comment was cleaned (i.e., profanity was found), reject the comment
  if (cleanComment !== comment) {
    return res.status(400).send({ error: 'Your comment contains inappropriate language and cannot be submitted.' });
  }

  // Save the comment in the database only if it passes the profanity check
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  db.get('SELECT * FROM comments WHERE ip = ? AND timestamp > ?', [ip, now - twentyFourHours], (err, row) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    if (row) {
      return res.status(400).send({ error: 'You can only submit a comment once every 24 hours' });
    }

    db.run('INSERT INTO comments (content, ip, timestamp) VALUES (?, ?, ?)', [comment, ip, now], function (err) {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      res.status(200).send({ message: 'Comment added!' });
    });
  });
});

// Endpoint to get a random comment
app.get('/random-comment', (req, res) => {
  db.get('SELECT content FROM comments ORDER BY RANDOM() LIMIT 1', [], (err, row) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.status(200).json({ comment: row ? row.content : 'No comments yet!' });
  });
});

// Endpoint to get all comments
app.get('/comments', (req, res) => {
  db.all('SELECT * FROM comments', [], (err, rows) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.status(200).json({ comments: rows });
  });
});

// Endpoint to delete a comment by ID
app.delete('/delete-comment/:id', (req, res) => {
    const commentId = req.params.id;
  
    db.run('DELETE FROM comments WHERE id = ?', [commentId], function(err) {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
  
      if (this.changes === 0) {
        return res.status(404).send({ error: 'Comment not found.' });
      }
  
      res.status(200).send({ message: `Comment with ID ${commentId} has been deleted.` });
    });
  });   

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// TO RUN SERVER: node server.js