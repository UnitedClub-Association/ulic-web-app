const { createClient } = supabase;
const supabaseClient = createClient('https://auyijdnrccmtkuvzkkot.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eWlqZG5yY2NtdGt1dnpra290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDE4MDIsImV4cCI6MjA2NzI3NzgwMn0.hGZsssIYvHCjmGky8Udm575V5nJFrXNjThR766tyoss');

document.addEventListener('DOMContentLoaded', async () => {
  const loginFormContainer = document.getElementById('signin-form-container');
  const createAccountFormContainer = document.getElementById('create-account-form-container');
  const forgotPasswordFormContainer = document.getElementById('forgot-password-form-container');
  const loginForm = document.getElementById('login-form');
  const createAccountForm = document.getElementById('create-account-form');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const createAccountLinkLogin = document.getElementById('create-account-link-login');
  const loginLinkCreateAccount = document.getElementById('login-link-create-account');
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const backToLoginLinkForgot = document.getElementById('back-to-login-link-forgot');
  const googleLogin = document.getElementById('google-login');
  const facebookLogin = document.getElementById('facebook-login');
  const googleCreateAccount = document.getElementById('google-create-account');
  const facebookCreateAccount = document.getElementById('facebook-create-account');
  const rememberMe = document.getElementById('remember-me');

  // Show/hide forms
  const showForm = (formToShow) => {
    loginFormContainer.classList.add('hidden');
    createAccountFormContainer.classList.add('hidden');
    forgotPasswordFormContainer.classList.add('hidden');
    formToShow.classList.remove('hidden');
  };

  // Form navigation
  [createAccountLinkLogin, loginLinkCreateAccount, forgotPasswordLink, backToLoginLinkForgot].forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      const container = document.getElementById(elem.dataset.container);
      showForm(container);
    });
  });

  // Check for existing session
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    window.location.href = '/pages/home.html';
    return;
  }

  // Check for stored credentials (if "Remember Me" was checked)
  const savedCredentials = localStorage.getItem('ulic-credentials');
  if (savedCredentials && rememberMe.checked) {
    const { email, password } = JSON.parse(savedCredentials);
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (!error) {
      window.location.href = '/pages/home.html';
      return;
    }
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        alert('Login failed: ' + error.message);
      } else {
        if (rememberMe.checked) {
          localStorage.setItem('ulic-credentials', JSON.stringify({ email, password }));
        } else {
          localStorage.removeItem('ulic-credentials');
        }
        window.location.href = '/pages/home.html';
      }
    });
  }

  // Create account form submission
  if (createAccountForm) {
    createAccountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = document.getElementById('create-account-first-name').value;
      const lastName = document.getElementById('create-account-last-name').value;
      const email = document.getElementById('create-account-email').value;
      const phone = document.getElementById('create-account-phone').value;
      const birthdate = document.getElementById('create-account-birthdate').value;
      const password = document.getElementById('create-account-password').value;
      const confirmPassword = document.getElementById('create-account-confirm-password').value;

      // Validate phone number format (+880 xxxx xxx xxx)
      const phoneRegex = /^\+880[0-9]{4}\s[0-9]{3}\s[0-9]{3}$/;
      if (!phoneRegex.test(phone)) {
        alert('Phone number must be in the format: +880 xxxx xxx xxx');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      const { data: { user }, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName, phone, birthdate } }
      });

      if (error) {
        alert('Account creation failed: ' + error.message);
      } else {
        await supabaseClient.from('users').insert({
          id: user.id,
          name: `${firstName} ${lastName}`,
          email,
          username: email.split('@')[0],
          role: 'Student',
          position: 'General Member',
          phone,
          birthdate
        });
        if (rememberMe.checked) {
          localStorage.setItem('ulic-credentials', JSON.stringify({ email, password }));
        }
        window.location.href = '/pages/home.html';
      }
    });
  }

  // Forgot password form submission
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/pages/login.html'
      });
      if (error) {
        alert('Error sending reset link: ' + error.message);
      } else {
        alert('Password reset link sent to your email!');
        showForm(loginFormContainer);
      }
    });
  }

  // Google OAuth
  if (googleLogin) {
    googleLogin.addEventListener('click', async () => {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'http://localhost:3000/pages/home.html' }
      });
      if (error) alert('Google login failed: ' + error.message);
    });
  }

  if (googleCreateAccount) {
    googleCreateAccount.addEventListener('click', async () => {
      const { data: { user }, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'http://localhost:3000/pages/home.html' }
      });
      if (!error && user) {
        await supabaseClient.from('users').insert({
          id: user.id,
          name: user.user_metadata.full_name || 'Google User',
          email: user.email,
          username: user.email.split('@')[0],
          role: 'Student',
          position: 'General Member'
        });
      } else if (error) {
        alert('Google account creation failed: ' + error.message);
      }
    });
  }

  // Facebook OAuth
  if (facebookLogin) {
    facebookLogin.addEventListener('click', async () => {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: 'http://localhost:3000/pages/home.html' }
      });
      if (error) alert('Facebook login failed: ' + error.message);
    });
  }

  if (facebookCreateAccount) {
    facebookCreateAccount.addEventListener('click', async () => {
      const { data: { user }, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: 'http://localhost:3000/pages/home.html' }
      });
      if (!error && user) {
        await supabaseClient.from('users').insert({
          id: user.id,
          name: user.user_metadata.full_name || 'Facebook User',
          email: user.email,
          username: user.email ? user.email.split('@')[0] : 'fb_user',
          role: 'Student',
          position: 'General Member'
        });
      } else if (error) {
        alert('Facebook account creation failed: ' + error.message);
      }
    });
  }

  // Show login form by default
  showForm(loginFormContainer);
});