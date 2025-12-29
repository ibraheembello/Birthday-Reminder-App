require('dotenv').config();
require('./src/config/database');
const { checkAndSendBirthdayEmails } = require('./src/services/birthdayService');

console.log('🎂 Manually triggering birthday check...\n');
console.log('This will check for birthdays TODAY and send emails.\n');

checkAndSendBirthdayEmails()
  .then(result => {
    console.log('\n✅ Birthday check completed!');
    console.log('📊 Results:', result);
    console.log(`   - Total birthdays found: ${result.total}`);
    console.log(`   - Emails sent successfully: ${result.sent}`);
    console.log(`   - Emails failed: ${result.failed}`);
    console.log('\n📧 Check your email inbox (and spam folder)!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Birthday check failed!');
    console.error('Error:', error.message);
    process.exit(1);
  });
