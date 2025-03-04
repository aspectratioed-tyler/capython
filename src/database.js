const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./comments.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected');
  }
});

// Create the table for storing comments
db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
);`);

module.exports = db;