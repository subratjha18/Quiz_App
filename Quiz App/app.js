// Function to toggle between login and signup forms
function toggleForms() {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  loginForm.style.display =
    loginForm.style.display === "none" ? "block" : "none";
  signupForm.style.display =
    signupForm.style.display === "none" ? "block" : "none";
}

// Function to handle login
function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  // Perform login validation (e.g., check credentials)
  if (username && password) {
    // Assuming successful login, display a welcome message
    document.getElementById(
      "login-message"
    ).innerText = `Welcome, ${username}!`;
  } else {
    document.getElementById("login-message").innerText =
      "Invalid username or password";
  }
}

// Function to handle signup
function signup() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  // Perform signup (e.g., send data to server)
  if (username && password) {
    // Assuming successful signup, display a success message
    document.getElementById("signup-message").innerText = "Signup successful";
  } else {
    document.getElementById("signup-message").innerText =
      "Please enter username and password";
  }
}

// Initially show login form
toggleForms();
