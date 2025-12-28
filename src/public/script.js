// Set max date to tomorrow (to allow today's date)
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('dateOfBirth');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.setAttribute('max', tomorrow.toISOString().split('T')[0]);
});

// Form submission handler
document.getElementById('birthdayForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous errors
  clearErrors();
  hideMessage();

  // Get form values
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const dateOfBirth = document.getElementById('dateOfBirth').value;

  // Validate inputs
  let isValid = true;

  if (!username || username.length < 2) {
    showError('usernameError', 'Username must be at least 2 characters');
    isValid = false;
  }

  if (!email || !isValidEmail(email)) {
    showError('emailError', 'Please enter a valid email address');
    isValid = false;
  }

  if (!dateOfBirth) {
    showError('dateOfBirthError', 'Please select your date of birth');
    isValid = false;
  } else if (new Date(dateOfBirth) > new Date()) {
    showError('dateOfBirthError', 'Date of birth must be in the past');
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Disable submit button
  const submitBtn = document.querySelector('.btn-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Registering...';

  try {
    // Send data to API
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        dateOfBirth
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Success
      showMessage('success', data.message || 'Registration successful! You will receive birthday wishes on your special day.');
      document.getElementById('birthdayForm').reset();
    } else {
      // Error from server
      if (data.errors && data.errors.length > 0) {
        // Validation errors
        data.errors.forEach(err => {
          if (err.path === 'email') {
            showError('emailError', err.msg);
          } else if (err.path === 'username') {
            showError('usernameError', err.msg);
          } else if (err.path === 'dateOfBirth') {
            showError('dateOfBirthError', err.msg);
          }
        });
      } else {
        showMessage('error', data.message || 'Registration failed. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('error', 'Network error. Please check your connection and try again.');
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';
  }
});

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  const inputElement = errorElement.previousElementSibling;
  errorElement.textContent = message;
  inputElement.classList.add('invalid');
}

function clearErrors() {
  const errorElements = document.querySelectorAll('.error');
  errorElements.forEach(el => el.textContent = '');

  const inputElements = document.querySelectorAll('input');
  inputElements.forEach(el => el.classList.remove('invalid'));
}

function showMessage(type, message) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
  messageElement.style.display = 'block';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideMessage();
  }, 5000);
}

function hideMessage() {
  const messageElement = document.getElementById('message');
  messageElement.style.display = 'none';
  messageElement.className = 'message';
}
