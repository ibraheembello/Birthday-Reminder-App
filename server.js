require('dotenv').config();
const app = require('./src/app');
const { startBirthdayCron } = require('./src/jobs/birthdayCron');

const PORT = process.env.PORT || 3003;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Start the birthday cron job
  startBirthdayCron();
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
