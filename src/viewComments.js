import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./comments.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected');
  }
});

db.all('SELECT * FROM comments', [], (err, rows) => {
  if (err) {
    throw err;
  }
  console.log('Comments in the database:');
  rows.forEach((row) => {
    console.log(`${row.id}: ${row.content}`);
  });
});

db.close();

// TO SEE COMMENTS: node viewComments.js
// TO DELETE COMMENTS: curl -X DELETE http://localhost:3000/delete-comment/(COMMENT_ID)