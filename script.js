const SUPABASE_URL = "https://fzlpqsvcicuvldaxgvcz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bHBxc3ZjaWN1dmxkYXhndmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3OTM1NjksImV4cCI6MjA5OTM2OTU2OX0.4YTOUuAv9RP5yGz_OF0Sh6ocZLMJa86HrVgAor97Lq8"
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwFd_q0GcRNc4qEI1NBlHAJxE_cLlmNzdTRXKJkO1wiPt6TUj05aSUWL76uM1YeD3hJ/exec";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// جلب المشاريع
async function renderProjects() {
  const container = document.getElementById('posts-feed-container');
  if(!container) return;
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if(error){ container.innerHTML = "خطأ في تحميل المشاريع"; return; }
  container.innerHTML = data.map(p => `
    <div class="post-card">
      <h3>${p.title}</h3>
      <p><strong>📍 الموقع:</strong> ${p.location || '-'}</p>
      <p><strong>📐 المساحة:</strong> ${p.area || '-'}</p>
      <p>${p.concept || ''}</p>
      <button onclick="likeProject(${p.id}, ${p.likes})" class="btn-primary">❤️ ${p.likes}</button>
    </div>
  `).join('');
}

// الاعجاب
async function likeProject(id, currentLikes){
  await supabase.from('projects').update({ likes: currentLikes + 1 }).eq('id', id);
  renderProjects();
}

// ارسال فورم التواصل
const form = document.getElementById('clientRequestForm');
if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = { name: clientName.value, phone: clientPhone.value, details: clientDetails.value, type: 'client_request' };
    await fetch(APPS_SCRIPT_URL, { method: 'POST', body: JSON.stringify(data) });
    alert("تم استلام طلبك. سنتواصل معك قريبا");
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', renderProjects);
