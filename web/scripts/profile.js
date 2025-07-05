const { createClient } = supabase;
const supabaseClient = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

async function loadProfile() {
  const { user } = await supabaseClient.auth.getUser();
  if (user) {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) console.error('Error loading profile:', error);
    else {
      document.getElementById('name').value = data.name || '';
      document.getElementById('phone').value = data.phone || '';
      document.getElementById('username').value = data.username || '';
      document.getElementById('bio').value = data.bio || '';
      document.getElementById('class').value = data.class || 'VII';
      document.getElementById('section').value = data.section || 'A';
      document.getElementById('roll').value = data.roll || '';
      document.getElementById('version').value = data.version || 'Bangla';
      document.getElementById('projects').value = data.projects || '';
      document.getElementById('role').value = data.role || 'Student';
      document.getElementById('position').value = data.position || 'General Member';
      document.getElementById('email').value = user.email || '';
      if (data.is_admin) document.getElementById('admin-page').style.display = 'block';
      if (data.is_teacher) {
        document.getElementById('class').disabled = true;
        document.getElementById('section').disabled = true;
        document.getElementById('roll').disabled = true;
        document.getElementById('version').disabled = true;
        document.getElementById('projects').disabled = true;
      }
      const badgeList = document.getElementById('badge-list');
      badgeList.innerHTML = (data.badges || []).map(badge => `<span class="badge-card">${badge}</span>`).join('');
    }
  }
}

async function saveProfile() {
  const { user } = await supabaseClient.auth.getUser();
  if (user) {
    const updates = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      username: document.getElementById('username').value,
      bio: document.getElementById('bio').value
    };
    if (!user.user_metadata.is_teacher) {
      updates.class = document.getElementById('class').value;
      updates.section = document.getElementById('section').value;
      updates.roll = document.getElementById('roll').value;
      updates.version = document.getElementById('version').value;
      updates.projects = document.getElementById('projects').value;
    }
    const { error } = await supabaseClient
      .from('users')
      .update(updates)
      .eq('id', user.id);
    if (error) alert('Error saving profile: ' + error.message);
    else alert('Profile saved!');
  }
}

async function requestChanges() {
  const { user } = await supabaseClient.auth.getUser();
  if (user) {
    const { error } = await supabaseClient
      .from('requests')
      .insert({
        user_id: user.id,
        role: document.getElementById('role').value,
        position: document.getElementById('position').value,
        email: document.getElementById('email').value
      });
    if (error) alert('Error requesting changes: ' + error.message);
    else alert('Change request submitted!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profile-form');
  const requestForm = document.getElementById('request-form');
  if (profileForm) profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProfile();
  });
  if (requestForm) requestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    requestChanges();
  });
  loadProfile();
});