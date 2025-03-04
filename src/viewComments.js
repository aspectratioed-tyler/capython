import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./comments.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected');
  }
});

// Function to view all comments
function viewComments() {
  db.all('SELECT * FROM comments', [], (err, rows) => {
    if (err) {
      console.error('Error fetching comments:', err);
      return;
    }
    console.log('Comments in the database:');
    rows.forEach((row) => {
      console.log(`${row.id}: ${row.content}`);
    });
  });
}

// Function to delete a comment by ID
function deleteComment(commentId) {
  if (!commentId || isNaN(commentId)) {
    console.error('Invalid comment ID');
    return;
  }

  db.run('DELETE FROM comments WHERE id = ?', [commentId], function (err) {
    if (err) {
      console.error('Error deleting comment:', err);
      return;
    }

    if (this.changes === 0) {
      console.log('Comment not found');
    } else {
      console.log(`Comment with ID ${commentId} deleted successfully`);
    }
  });
}

// Main logic
const command = process.argv[2]; // Get the command (view or delete)
const commentId = process.argv[3]; // Get the comment ID (for delete)

if (command === 'view') {
  viewComments();
} else if (command === 'delete' && commentId) {
  deleteComment(commentId);
} else {
  console.log('Usage:');
  console.log('To view comments: node viewComments.js view');
  console.log('To delete a comment: node viewComments.js delete <COMMENT_ID>');
}

// Close the database connection after a short delay
setTimeout(() => {
  db.close();
}, 1000);

//TO VIEW COMMENTS: node viewComments.js view
//TO DELETE A COMMENT: node viewComments.js delete (id)