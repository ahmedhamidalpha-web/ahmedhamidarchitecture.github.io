// 1. تسجيل الدخول
const loginBtn = document.getElementById('submitLoginBtn');
if(loginBtn){
    loginBtn.addEventListener('click', () => {
        const user = document.getElementById('loginUsername').value;
        const pass = document.getElementById('loginPassword').value;
        if(user === "ahmed" && pass === "123"){ // غير كلمة السر دي
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            window.location.href = "dashboard.html";
        } else {
            document.getElementById('loginError').innerText = "اسم المستخدم او كلمة السر خطأ";
        }
    });
}

// 2. حماية لوحة التحكم
if(window.location.pathname.includes('dashboard.html')){
    if(sessionStorage.getItem('isAdminLoggedIn')!== 'true'){
        window.location.href = "admin.html";
    }
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('isAdminLoggedIn');
        window.location.href = "admin.html";
    });

    // 3. اضافة مشروع
    document.getElementById('addProjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newProject = {
            title: pTitle.value,
            location: pLocation.value,
            area: pArea.value,
            concept: pConcept.value,
            images: pImages.value.split(','),
            likes: 0
        };
        const { error } = await supabase.from('projects').insert([newProject]);
        if(error){ alert("خطأ: " + error.message) }
        else { alert("تم نشر المشروع بنجاح"); e.target.reset(); }
    });

    // 4. اضافة وظيفة
    document.getElementById('addJobForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newJob = {
            title: jTitle.value,
            location: jLocation.value,
            description: jDesc.value
        };
        const { error } = await supabase.from('jobs').insert([newJob]);
        if(error){ alert("خطأ: " + error.message) }
        else { alert("تم نشر الوظيفة بنجاح"); e.target.reset(); }
    });
    }
