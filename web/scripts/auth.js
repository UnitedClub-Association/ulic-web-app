const { createClient } = supabase;
const supabaseClient = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const signupLink = document.getElementById('signup-link');
  const googleLogin = document.getElementById('google-login');
  const facebookLogin = document.getElementById('facebook-login');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) alert('Login failed: ' + error.message);
      else window.location.href = 'home.html';
    });
  }

  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const name = document.getElementById('signup-name').value;
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) alert('Sign-up failed: ' + error.message);
      else window.location.href = 'home.html';
    });
  }

  if (googleLogin) {
    googleLogin.addEventListener('click', async () => {
      const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'google' });
      if (error) alert('Google login failed: ' + error.message);
    });
  }

  if (facebookLogin) {
    facebookLogin.addEventListener('click', async () => {
      const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'facebook' });
      if (error) alert('Facebook login failed: ' + error.message);
    });
  }
});