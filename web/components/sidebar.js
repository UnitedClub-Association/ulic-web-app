document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.createElement('nav');
  sidebar.className = 'sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2>ULIC</h2>
    </div>
    Neutral
    <ul>
      <li><a href="/pages/home.html"><img src="/assets/images/home_icon.png" alt="Home Icon"> Home</a></li>
      <li><a href="/pages/calendar.html"><img src="/assets/images/calendar_icon.png" alt="Calendar Icon"> Calendar</a></li>
      <li><a href="/pages/events.html"><img src="/assets/images/events_icon.png" alt="Events Icon"> Events</a></li>
      <li><a href="/pages/projects.html"><img src="/assets/images/projects_icon.png" alt="Projects Icon"> Projects</a></li>
      <li><a href="/pages/profile.html"><img src="/assets/images/profile_icon.png" alt="Profile Icon"> Profile</a></li>
    </ul>
    <div class="theme-toggle">
      <button id="theme-toggle-btn">Toggle Light/Dark Mode</button>
    </div>
  `;
  document.body.prepend(sidebar);

  // Theme toggle logic
  const toggleBtn = document.getElementById('theme-toggle-btn');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });

  // Load saved theme
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }
});