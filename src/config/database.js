const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      date_of_birth TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Users table ready');
    }
  });
}

module.exports = db;
