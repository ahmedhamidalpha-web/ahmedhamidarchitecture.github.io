// ==================== 1. الاعدادات ====================
const SUPABASE_URL = "https://fzlpqsvcicuvldaxgvcz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bHBxc3ZjaWN1dmxkYXhndmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3OTM1NjksImV4cCI6MjA5OTM2OTU2OX0.4YTOUuAv9RP5yGz_OF0Sh6ocZLMJa86HrVgAor97Lq8"
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwFd_q0GcRNc4qEI1NBlHAJxE_cLlmNzdTRXKJkO1wiPt6TUj05aSUWL76uM1YeD3hJ/exec";
const ADMIN_EMAIL = "ahmedhamidarchitecture@gmail.com";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== 2. دوال مساعدة ====================
// دالة لرفع الصور لـ Google Drive باستخدام نفس الـ URL حقك
async function uploadImagesToDrive(files) {
    const formData = new FormData();
    for(let i=0; i<files.length; i++){
        formData.append("file", files[i]); // غيرنا الاسم لـ file لانو دا البفهمو السكربت الحالي
    }
    formData.append("folder", "AHA Projects");

    document.getElementById('uploadStatus').innerText = "جاري رفع الصور لـ Google Drive... الرجاء الانتظار";
    const res = await fetch(APPS_SCRIPT_URL, { method: 'POST', body: formData });
    const data = await res.json();
    document.getElementById('uploadStatus').innerText = "تم رفع الصور بنجاح!";
    return data.fileUrls || [data.url]; // عشان يشتغل مع اي رد
}

// ==================== 3. كود لوحة التحكم Admin ====================
if(window.location.pathname.includes('admin.html')){
    document.getElementById('submitLoginBtn').addEventListener('click', () => {
        const user = document.getElementById('loginUsername').value;
        const pass = document.getElementById('loginPassword').value;
        if(user === "ahmed" && pass === "123"){
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            window.location.href = "dashboard.html";
        } else {
            document.getElementById('loginError').innerText = "اسم المستخدم او كلمة السر خطأ";
        }
    });
}

if(window.location.pathname.includes('dashboard.html')){
    if(sessionStorage.getItem('isAdminLoggedIn')!== 'true'){
        window.location.href = "admin.html";
    }
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('isAdminLoggedIn');
        window.location.href = "admin.html";
    });

    // اضافة مشروع جديد
    document.getElementById('addProjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const imageFiles = document.getElementById('pImages').files;
        if(imageFiles.length === 0) { alert("الرجاء اختيار صورة واحدة على الاقل"); return; }

        const imageUrls = await uploadImagesToDrive(imageFiles);

        const newProject = {
            title: document.getElementById('pTitle').value,
            location: document.getElementById('pLocation').value,
            area: document.getElementById('pArea').value,
            concept: document.getElementById('pConcept').value,
            images: imageUrls,
            likes: 0,
            created_at: new Date()
        };
        const { error } = await supabase.from('projects').insert([newProject]);
        if(error){ alert("خطأ: " + error.message) }
        else { alert("تم نشر المشروع بنجاح"); e.target.reset(); document.getElementById('uploadStatus').innerText = ""; }
    });

    // اضافة وظيفة جديدة
    document.getElementById('addJobForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newJob = {
            title: document.getElementById('jTitle').value,
            location: document.getElementById('jLocation').value,
            description: document.getElementById('jDesc').value,
            created_at: new Date()
        };
        const { error } = await supabase.from('jobs').insert([newJob]);
        if(error){ alert("خطأ: " + error.message) }
        else { alert("تم نشر الوظيفة بنجاح"); e.target.reset(); }
    });
}

// ==================== 4. عرض البيانات في الموقع ====================
async function renderLatestProjects() {
  const container = document.getElementById('latest-projects');
  if(!container) return;
  const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(3);
  if(!data || data.length === 0) { container.innerHTML = "<p>لا توجد مشاريع بعد</p>"; return; }
  container.innerHTML = data.map(p => createProjectCard(p)).join('');
}

async function renderAllProjects() {
  const container = document.getElementById('posts-feed-container');
  if(!container) return;
  const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if(!data || data.length === 0) { container.innerHTML = "<p>لا توجد مشاريع بعد</p>"; return; }
  container.innerHTML = data.map(p => createProjectCard(p)).join('');
}

async function renderJobs() {
  const container = document.getElementById('jobs-container');
  if(!container) return;
  const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
  if(!data || data.length === 0) { container.innerHTML = "<p>لا توجد وظائف متاحة حاليا</p>"; return; }
  container.innerHTML = data.map(j => `
    <div class="job-card admin-card">
      <h3>${j.title}</h3>
      <p><strong>📍 الموقع:</strong> ${j.location}</p>
      <p>${j.description}</p>
      <a href="contact.html" class="btn-primary">قدم الآن</a>
    </div>
  `).join('');
}

function createProjectCard(p){
    return `
    <div class="post-card">
      <div class="project-images-slider">
        ${p.images? p.images.map(img => `<img src="${img}" alt="${p.title}">`).join('') : ''}
      </div>
      <div class="post-content">
        <h3>${p.title}</h3>
        <p><strong>📍 الموقع:</strong> ${p.location || '-'}</p>
        <p><strong>📐 المساحة:</strong> ${p.area || '-'}</p>
        <p>${p.concept || ''}</p>
        <div class="post-actions">
            <button onclick="likeProject(${p.id}, ${p.likes})" class="btn-like">❤️ ${p.likes}</button>
        </div>
      </div>
    </div>
  `;
}

async function likeProject(id, currentLikes){
  await supabase.from('projects').update({ likes: currentLikes + 1 }).eq('id', id);
  renderAllProjects();
  renderLatestProjects();
}

// ==================== 5. فورم "اطلب مشروع" يرسل ايميل ====================
// الحل: بنرسل الايميل عن طريق Supabase Edge Function او بنحفظو في جدول ونرسلو يدوي
// بما انو ما دايرين نعدل Apps Script. الحل البديل: نحفظ الطلب في Supabase
const contactForm = document.getElementById('clientRequestForm');
if(contactForm){
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            details: document.getElementById('clientDetails').value,
            created_at: new Date()
        };
        // بنحفظ الطلب في جدول جديد اسمو client_requests
        const { error } = await supabase.from('client_requests').insert([data]);
        if(error){ alert("خطأ: " + error.message) }
        else {
            alert("تم استلام طلبك بنجاح. سنتواصل معك قريبا على الرقم: " + data.phone);
            contactForm.reset();
        }
    });
}

// ==================== 6. التشغيل التلقائي ====================
document.addEventListener('DOMContentLoaded', () => {
    renderLatestProjects();
    renderAllProjects();
    renderJobs();
});
