const User = require('../models/user');
const { sendBirthdayEmail } = require('./emailService');

// Check for birthdays and send emails
async function checkAndSendBirthdayEmails() {
  console.log('Running birthday check...');

  return new Promise((resolve, reject) => {
    User.getTodayBirthdays((err, users) => {
      if (err) {
        console.error('Error fetching birthday users:', err.message);
        reject(err);
        return;
      }

      if (users.length === 0) {
        console.log('No birthdays today');
        resolve({ sent: 0, failed: 0 });
        return;
      }

      console.log(`Found ${users.length} birthday(s) today`);

      // Send emails to all birthday users
      const emailPromises = users.map(user => {
        console.log(`Sending birthday email to ${user.username} (${user.email})`);
        return sendBirthdayEmail(user.email, user.username);
      });

      Promise.all(emailPromises)
        .then(results => {
          const sent = results.filter(r => r.success).length;
          const failed = results.filter(r => !r.success).length;

          console.log(`Birthday emails sent: ${sent}, failed: ${failed}`);
          resolve({ sent, failed, total: users.length });
        })
        .catch(error => {
          console.error('Error sending birthday emails:', error.message);
          reject(error);
        });
    });
  });
}

module.exports = { checkAndSendBirthdayEmails };
