const cron = require('node-cron');
const { checkAndSendBirthdayEmails } = require('../services/birthdayService');

// Schedule cron job to run every day at 7:00 AM
function startBirthdayCron() {
  // Cron expression: '0 7 * * *' means "At 7:00 AM every day"
  // Format: minute hour day month day-of-week
  const cronSchedule = '0 7 * * *';

  cron.schedule(cronSchedule, () => {
    const now = new Date();
    console.log(`[${now.toISOString()}] Birthday cron job triggered`);

    checkAndSendBirthdayEmails()
      .then(result => {
        console.log(`Birthday job completed:`, result);
      })
      .catch(error => {
        console.error(`Birthday job failed:`, error.message);
      });
  });

  console.log('Birthday cron job scheduled to run daily at 7:00 AM');
}

module.exports = { startBirthdayCron };
