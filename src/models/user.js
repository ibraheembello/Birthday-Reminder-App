const db = require('../config/database');

class User {
  // Create a new user
  static create(userData, callback) {
    const { username, email, dateOfBirth } = userData;
    const query = 'INSERT INTO users (username, email, date_of_birth) VALUES (?, ?, ?)';

    db.run(query, [username, email, dateOfBirth], function (err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, username, email, dateOfBirth });
      }
    });
  }

  // Find user by email
  static findByEmail(email, callback) {
    const query = 'SELECT * FROM users WHERE email = ?';

    db.get(query, [email], (err, row) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, row);
      }
    });
  }

  // Get all users
  static getAll(callback) {
    const query = 'SELECT id, username, email, date_of_birth, created_at FROM users';

    db.all(query, [], (err, rows) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, rows);
      }
    });
  }

  // Get users with birthdays today
  static getTodayBirthdays(callback) {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    // SQLite date format: YYYY-MM-DD, we check MM-DD
    const query = `
      SELECT * FROM users
      WHERE substr(date_of_birth, 6, 5) = ?
    `;

    db.all(query, [`${month}-${day}`], (err, rows) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, rows);
      }
    });
  }
}

module.exports = User;
