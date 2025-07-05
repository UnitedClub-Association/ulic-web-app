const { createClient } = supabase;
const supabaseClient = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

async function loadLiveEvents() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabaseClient
    .from('events')
    .select('*')
    .gte('start_time', today + 'T00:00:00')
    .lte('start_time', today + 'T23:59:59');
  if (error) console.error('Error loading live events:', error);
  else {
    const liveEventList = document.getElementById('live-event-list');
    if (liveEventList) {
      liveEventList.innerHTML = data.map(event => `
        <div class="event-card">
          <h3>${event.name}</h3>
          <p>${event.description}</p>
          <p>Time: ${new Date(event.start_time).toLocaleString()}</p>
        </div>
      `).join('');
    }
  }
}

async function loadUpcomingEvents() {
  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
  const { data, error } = await supabaseClient
    .from('events')
    .select('*')
    .gte('start_time', new Date().toISOString())
    .lte('start_time', nextMonth + 'T23:59:59');
  if (error) console.error('Error loading upcoming events:', error);
  else {
    const upcomingEventList = document.getElementById('upcoming-event-list');
    if (upcomingEventList) {
      upcomingEventList.innerHTML = data.map(event => `
        <div class="event-card">
          <h3>${event.name}</h3>
          <p>${event.description}</p>
          <p>Time: ${new Date(event.start_time).toLocaleString()}</p>
        </div>
      `).join('');
    }
  }
}

async function loadAllEvents() {
  const { data, error } = await supabaseClient.from('events').select('*');
  if (error) console.error('Error loading all events:', error);
  else {
    const allEventList = document.getElementById('all-event-list');
    if (allEventList) {
      allEventList.innerHTML = data.map(event => `
        <div class="event-card">
          <h3>${event.name}</h3>
          <p>${event.description}</p>
          <p>Time: ${new Date(event.start_time).toLocaleString()}</p>
        </div>
      `).join('');
    }
  }
}

async function loadCalendar() {
  const calendar = document.getElementById('calendar');
  if (calendar) {
    const { data, error } = await supabaseClient
      .from('events')
      .select('*')
      .gte('start_time', '2024-10-01T00:00:00')
      .lte('start_time', '2050-12-31T23:59:59');
    if (error) console.error('Error loading calendar events:', error);
    else {
      // Simplified calendar rendering (requires a library like FullCalendar for production)
      calendar.innerHTML = '<p>Calendar rendering coming soon...</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadLiveEvents();
  loadUpcomingEvents();
  loadAllEvents();
  loadCalendar();
});