const transporter = require('../config/email');

// Birthday email template
function getBirthdayEmailHTML(username) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          text-align: center;
          padding: 40px 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .content h2 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          color: #666666;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .cake-emoji {
          font-size: 64px;
          margin: 20px 0;
        }
        .footer {
          background: #f8f8f8;
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Happy Birthday! 🎉</h1>
        </div>
        <div class="content">
          <h2>Dear ${username},</h2>
          <div class="cake-emoji">🎂</div>
          <p>On this special day, we want to take a moment to celebrate YOU!</p>
          <p>May your birthday be filled with joy, laughter, and wonderful memories.</p>
          <p>Wishing you a fantastic year ahead filled with success, happiness, and all the things you love!</p>
          <p><strong>Have an amazing birthday celebration!</strong></p>
        </div>
        <div class="footer">
          <p>With warm wishes,<br>The Birthday Reminder Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send birthday email
async function sendBirthdayEmail(email, username) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🎉 Happy Birthday ${username}! 🎂`,
      html: getBirthdayEmailHTML(username)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Birthday email sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendBirthdayEmail };
