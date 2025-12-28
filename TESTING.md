# Testing Guide

## Important: Gmail App Password Setup

Before testing email functionality, you need to set up a Gmail App Password correctly.

### Step 1: Enable 2-Factor Authentication

1. Go to https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the steps to enable it

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other" as the device and enter "Birthday Reminder App"
4. Click "Generate"
5. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File

Open `.env` and update:

```env
EMAIL_PASS=abcdefghijklmnop
```

**Important**: Remove all spaces from the app password - it should be exactly 16 characters.

## Running Tests

### Test 1: Start the Server

```bash
npm start
```

Expected output:
```
Server is running on http://localhost:3003
Environment: development
Birthday cron job scheduled to run daily at 7:00 AM
Connected to SQLite database
Users table ready
Email service is ready to send messages
```

If you see "Email configuration error", check your Gmail App Password.

### Test 2: Test User Registration (API)

Open a new terminal and run:

```bash
node test-registration.js
```

Expected output:
```
Status Code: 201
Response: {
  success: true,
  message: 'User registered successfully',
  data: {
    id: 1,
    username: 'Test User',
    email: 'test@example.com',
    dateOfBirth: '1990-12-28'
  }
}
```

### Test 3: Test Duplicate Email

Run the same command again:

```bash
node test-registration.js
```

Expected output:
```
Status Code: 400
Response: { success: false, message: 'Email already exists' }
```

### Test 4: Test Get All Users

```bash
curl http://localhost:3003/api/users
```

Or open in browser: http://localhost:3003/api/users

Expected output:
```json
{
  "success": true,
  "count": 1,
  "users": [
    {
      "id": 1,
      "username": "Test User",
      "email": "test@example.com",
      "date_of_birth": "1990-12-28",
      "created_at": "2024-01-15 10:30:00"
    }
  ]
}
```

### Test 5: Test Web UI

1. Open browser and go to: http://localhost:3003
2. Fill in the form:
   - Username: John Doe
   - Email: john.doe@example.com
   - Date of Birth: 1995-06-15
3. Click "Register"
4. You should see a success message

### Test 6: Test UI Validation

Try these invalid inputs to test validation:

1. **Empty fields**: Leave any field empty and submit
2. **Invalid email**: Enter "notanemail" in the email field
3. **Short username**: Enter "A" (less than 2 characters)
4. **Future date**: Select tomorrow's date as birthday
5. **Duplicate email**: Try to register with the same email again

### Test 7: Test Birthday Email (MOST IMPORTANT)

To test the birthday email functionality:

1. **Register a user with TODAY's birthday**:
   ```bash
   curl -X POST http://localhost:3003/api/users \
     -H "Content-Type: application/json" \
     -d '{
       "username": "Birthday Test",
       "email": "YOUR_ACTUAL_EMAIL@gmail.com",
       "dateOfBirth": "1990-12-28"
     }'
   ```

   Replace:
   - `YOUR_ACTUAL_EMAIL@gmail.com` with a real email you can check
   - `1990-12-28` - keep the month and day as today's date, change the year

2. **Manually trigger the birthday check**:

   Create a file called `manual-test-birthday.js`:

   ```javascript
   require('dotenv').config();
   require('./src/config/database');
   const { checkAndSendBirthdayEmails } = require('./src/services/birthdayService');

   console.log('Manually triggering birthday check...');

   checkAndSendBirthdayEmails()
     .then(result => {
       console.log('Result:', result);
       process.exit(0);
     })
     .catch(error => {
       console.error('Error:', error);
       process.exit(1);
     });
   ```

3. **Run the test**:
   ```bash
   node manual-test-birthday.js
   ```

4. **Check the email inbox** - you should receive a birthday email!

Expected console output:
```
Manually triggering birthday check...
Running birthday check...
Found 1 birthday(s) today
Sending birthday email to Birthday Test (your-email@gmail.com)
Birthday email sent to your-email@gmail.com: <message-id>
Birthday emails sent: 1, failed: 0
Result: { sent: 1, failed: 0, total: 1 }
```

### Test 8: Test Cron Job

The cron job runs automatically at 7:00 AM every day. To test it:

**Option A: Wait until 7:00 AM**
- Leave the server running overnight
- Check the console at 7:00 AM for birthday check logs
- Check email if you have a user with today's birthday

**Option B: Temporarily change the cron schedule**

1. Edit `src/jobs/birthdayCron.js` line 8
2. Change from `'0 7 * * *'` to `'* * * * *'` (runs every minute)
3. Restart the server
4. Watch the console - it should run every minute
5. **Remember to change it back to `'0 7 * * *'` after testing!**

## Test Results Checklist

- [ ] Server starts without errors
- [ ] Database initializes successfully
- [ ] Email service connects (no authentication errors)
- [ ] Cron job is scheduled
- [ ] User registration works via API
- [ ] Duplicate email validation works
- [ ] Get all users endpoint works
- [ ] Web UI loads correctly
- [ ] Web UI form validation works
- [ ] Web UI registration works
- [ ] Birthday email sends successfully
- [ ] Email has correct HTML formatting
- [ ] Email contains personalized username

## Common Issues

### Issue: "Email configuration error: Invalid login"

**Solution**:
1. Verify Gmail App Password is correct (16 characters, no spaces)
2. Ensure 2-Factor Authentication is enabled
3. Make sure you're using App Password, not regular password

### Issue: "ECONNREFUSED" when testing API

**Solution**: Make sure the server is running (`npm start`)

### Issue: Database locked error

**Solution**:
1. Stop the server
2. Delete `database.sqlite`
3. Restart the server (database will be recreated)

### Issue: Birthday email not received

**Solution**:
1. Check spam/junk folder
2. Verify the user's birthday matches today's month and day
3. Check server logs for email sending errors
4. Verify Gmail credentials in `.env`

## Performance Testing

### Test with Multiple Users

Create a script to register 100 users:

```javascript
// bulk-register.js
const http = require('http');

for (let i = 1; i <= 100; i++) {
  const data = JSON.stringify({
    username: `User ${i}`,
    email: `user${i}@example.com`,
    dateOfBirth: '1990-05-15'
  });

  const options = {
    hostname: 'localhost',
    port: 3003,
    path: '/api/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    res.on('data', () => {});
    res.on('end', () => {
      console.log(`Registered user ${i}`);
    });
  });

  req.on('error', (error) => {
    console.error(`Error registering user ${i}:`, error.message);
  });

  req.write(data);
  req.end();
}
```

Run with:
```bash
node bulk-register.js
```

## Clean Up After Testing

To reset the database and start fresh:

```bash
# Stop the server (Ctrl+C)

# Delete the database file
rm database.sqlite   # On Mac/Linux
del database.sqlite  # On Windows

# Delete the test registration file
rm test-registration.js   # On Mac/Linux
del test-registration.js  # On Windows

# Restart the server
npm start
```
