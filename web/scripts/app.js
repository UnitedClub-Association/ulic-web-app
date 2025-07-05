const { createClient } = supabase;
const supabaseClient = createClient('https://auyijdnrccmtkuvzkkot.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eWlqZG5yY2NtdGt1dnpra290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDE4MDIsImV4cCI6MjA2NzI3NzgwMn0.hGZsssIYvHCjmGky8Udm575V5nJFrXNjThR766tyoss');

async function loadUserName() {
  const { user } = await supabaseClient.auth.getUser();
  if (user) {
    const userName = document.getElementById('user-name');
    if (userName) userName.textContent = user.user_metadata.name || 'User';
  }
}

async function loadFeaturedProjects() {
  const { data, error } = await supabaseClient
    .from('projects')
    .select('name, description, creator')
    .eq('is_featured', true);
  if (error) console.error('Error loading featured projects:', error);
  else {
    const projectList = document.getElementById('project-list');
    if (projectList) {
      projectList.innerHTML = data.map(project => `
        <div class="project-card">
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          <p>By: ${project.creator}</p>
        </div>
      `).join('');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadUserName();
  loadFeaturedProjects();
});