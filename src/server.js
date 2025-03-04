import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { Filter } from 'bad-words';
import Sentiment from 'sentiment';

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

// Create an instance of the sentiment analyzer
const sentiment = new Sentiment();

// Function to filter URLs and email addresses
function filterPatterns(comment) {
  const urlPattern = /https?:\/\/[^\s]+/gi; // Matches URLs
  const emailPattern = /[^\s]+@[^\s]+\.[^\s]+/gi; // Matches email addresses

  let filteredComment = comment
    .replace(urlPattern, '[URL REMOVED]')
    .replace(emailPattern, '[EMAIL REMOVED]');

  return filteredComment;
}

// Endpoint to return a math question
app.get('/math-question', (req, res) => {
  const num1 = Math.floor(Math.random() * 10); // Random number between 0 and 9
  const num2 = Math.floor(Math.random() * 10); // Random number between 0 and 9
  res.status(200).json({ num1, num2 });
});

// Endpoint to save a comment with a math question answer
app.post('/add-comment', (req, res) => {
  const { comment, mathAnswer, mathQuestion } = req.body;

  // Use the math question sent by the client
  if (!mathQuestion || !mathQuestion.num1 || !mathQuestion.num2) {
    return res.status(400).send({ error: 'Math question is missing or invalid' });
  }

  const { num1, num2 } = mathQuestion;
  const correctAnswer = num1 + num2;

  // Verify the answer
  if (parseInt(mathAnswer) !== correctAnswer) {
    return res.status(400).send({ error: 'Incorrect answer to the math question' });
  }

  // Step 2: Filter profanity
  const cleanComment = filter.clean(comment);

  // Reject the comment if it contains profanity
  if (cleanComment !== comment) {
    return res.status(400).send({ error: 'Your comment contains inappropriate language and cannot be submitted.' });
  }

  // Step 3: Filter URLs and email addresses
  const filteredComment = filterPatterns(cleanComment);

  // Step 4: Analyze sentiment
  const sentimentScore = sentiment.analyze(filteredComment).score;

  // Reject the comment if it has a negative sentiment score
  if (sentimentScore < 0) {
    return res.status(400).send({ error: 'Your comment contains negative content and cannot be submitted.' });
  }

  // Save the comment in the database only if it passes all checks
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const twentyFourHours = 1; //24 * 60 * 60 * 1000

  db.get('SELECT * FROM comments WHERE ip = ? AND timestamp > ?', [ip, now - twentyFourHours], (err, row) => {
    if (err) {
      console.error('Database error (SELECT):', err.message); // Log the error
      return res.status(500).send({ error: 'Internal server error' });
    }

    if (row) {
      return res.status(400).send({ error: 'You can only submit a comment once every 24 hours' });
    }

    // Save the filtered comment
    db.run('INSERT INTO comments (content, ip, timestamp) VALUES (?, ?, ?)', [filteredComment, ip, now], function (err) {
      if (err) {
        console.error('Database error (INSERT):', err.message); // Log the error
        return res.status(500).send({ error: 'Internal server error' });
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// TO RUN SERVER: node server.js