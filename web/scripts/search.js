const { createClient } = supabase;
const supabaseClient = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

async function searchUsers(query) {
  const { data, error } = await supabaseClient
    .from('users')
    .select('name, username, badges, projects')
    .ilike('username', `%${query}%`)
    .ilike('name', `%${query}%`);
  if (error) console.error('Error searching users:', error);
  else {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
      searchResults.innerHTML = data.map(user => `
        <div class="user-card">
          <h3>${user.name} (@${user.username})</h3>
          <p>Badges: ${(user.badges || []).join(', ')}</p>
          <p>Projects: ${user.projects || 'None'}</p>
          <button onclick="followUser('${user.username}')">Follow</button>
          <button onclick="likeUser('${user.username}')">Like</button>
        </div>
      `).join('');
    }
  }
}

async function followUser(username) {
  const { user } = await supabaseClient.auth.getUser();
  if (user) {
    const { error } = await supabaseClient
      .from('user_connections')
      .insert({ user_id: user.id, followed_username: username, type: 'follow' });
    if (error) alert('Error following user: ' + error.message);
    else alert(`Followed ${username}!`);
  }
}

async function likeUser(username) {
  const { user } = await supabaseClient.auth.getUser();
  if (user) {
    const { error } = await supabaseClient
      .from('user_connections')
      .insert({ user_id: user.id, liked_username: username, type: 'like' });
    if (error) alert('Error liking user: ' + error.message);
    else alert(`Liked ${username}!`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => searchUsers(e.target.value));
  }
});