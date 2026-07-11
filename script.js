// قاعدة البيانات والروابط الرسمية المحدثة بالكامل
const CORPORATE_CONFIG = {
    email: "ahmedhamidarchitecture@gmail.com",
    whatsapp: "249924372845",
    linkedin: "https://www.linkedin.com/in/ahmed-hamid-architecture-9b9372260?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    tiktok: "https://vm.tiktok.com/ZS9M9KvHtr62K-4vcMJ/",
    instagram: "https://www.instagram.com/ahmed_hamid_architecture?igsh=MXd1ZDlyaHlpdzB5NA==",
    facebook: "https://www.instagram.com/ahmed_hamid_architecture?igsh=MXd1ZDlyaHlpdzB5NA=="
};

document.addEventListener("DOMContentLoaded", () => {
    // ربط الحسابات وتحديث الروابط في الفوتر تلقائياً
    if(document.getElementById("link-fb")) document.getElementById("link-fb").href = CORPORATE_CONFIG.facebook;
    if(document.getElementById("link-ig")) document.getElementById("link-ig").href = CORPORATE_CONFIG.instagram;
    if(document.getElementById("link-tt")) document.getElementById("link-tt").href = CORPORATE_CONFIG.tiktok;
    if(document.getElementById("link-ln")) document.getElementById("link-ln").href = CORPORATE_CONFIG.linkedin;

    // تشغيل وعرض ساحة المشاريع والمنشورات
    renderPosts();

    // نظام تسجيل دخول الأدمن التفاعلي المتوافق مع الجوال
    const loginBtn = document.getElementById("adminLoginBtn");
    if(loginBtn) {
        loginBtn.addEventListener("click", () => {
            if (localStorage.getItem("isAdmin") === "true") {
                document.getElementById("adminPanelSection").style.display = "block";
                alert("أنت مسجل الدخول بالفعل كأدمن يا هندسة!");
                return;
            }
            
            const userEmail = prompt("أدخل البريد الإلكتروني للإدارة:");
            const userPass = prompt("أدخل كلمة المرور السرية:");

            if (userEmail === CORPORATE_CONFIG.email && userPass === "AhmedHamid2026") {
                localStorage.setItem("isAdmin", "true");
                document.getElementById("adminPanelSection").style.display = "block";
                alert("تم تسجيل الدخول بنجاح. أهلاً بك باشمهندس أحمد! يمكنك الآن رفع المنشورات وحذفها.");
                window.location.reload();
            } else {
                alert("خطأ في البيانات! غير مسموح بالدخول.");
            }
        });
    }

    // إبقاء اللوحة ظاهرة للأدمن في حال عدم تسجيل الخروج
    if (localStorage.getItem("isAdmin") === "true" && document.getElementById("adminPanelSection")) {
        document.getElementById("adminPanelSection").style.display = "block";
    }

    // معالجة تسليم واستقبال البيانات وإرسالها فوراً إلى صندوق الإيميل الخاص بك
    const form = document.getElementById("projectIntakeForm");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = "جاري رفع طلبك...";
            submitBtn.disabled = true;

            const payload = {
                name: document.getElementById("clientName").value,
                phone: document.getElementById("clientPhone").value,
                area: document.getElementById("plotArea").value,
                requirements: document.getElementById("clientRequirements").value
            };

            // تم الربط برابط Formspree الخاص بك مباشرة لتصلك الإيميلات بدون خطوات إضافية
            fetch("https://formspree.io/f/mzdnpevq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(res => {
                if(res.ok) {
                    alert("تم رفع طلبك بنجاح. الرجاء الانتظار حتى يتم الرد عليك أو التواصل معك في أقرب وقت.");
                    form.reset();
                } else {
                    alert("حدث خطأ غير متوقع، سيتم توجيهك إلى الواتساب مباشرة للتواصل المهني.");
                    window.location.href = `https://wa.me/${CORPORATE_CONFIG.whatsapp}`;
                }
            })
            .catch(() => {
                window.location.href = `https://wa.me/${CORPORATE_CONFIG.whatsapp}`;
            })
            .finally(() => {
                submitBtn.textContent = "SUBMIT DESIGN BRIEF →";
                submitBtn.disabled = false;
            });
        });
    }
});

// مصفوفة المنشورات والمشاريع المحفوظة ديناميكياً داخل المتصفح
let posts = JSON.parse(localStorage.getItem("studio_posts")) || [];

function renderPosts() {
    const container = document.getElementById("posts-feed-container");
    if (!container) return;
    
    if (posts.length === 0) {
        container.innerHTML = `<div class="no-posts-message" style="text-align:center; padding:40px; border:1px dashed #ccc;"><p>لا توجد مشاريع مرفوعة حالياً. سجل دخولك كأدمن من الأعلى لإضافة مشروعك الأول ببياناتك وصورك.</p></div>`;
        return;
    }

    container.innerHTML = posts.map(post => `
        <div style="background:#fff; border:1px solid #e5e5e5; padding:20px; margin-bottom:20px;">
            <h3 style="text-transform: uppercase; letter-spacing:1px;">${post.title}</h3>
            <p style="color:#555; margin:15px 0; line-height:1.6; white-space: pre-line;">${post.content}</p>
            ${post.img ? `<img src="${post.img}" style="width:100%; max-height:450px; object-fit:cover; margin-bottom:15px; border:1px solid #eee;">` : ''}
            
            <div style="margin-top:20px; border-top:1px dashed #ddd; padding-top:15px;">
                <h4 style="font-size:14px; margin-bottom:10px;">آراء وتعليقات الزوار:</h4>
                <div id="comments-${post.id}">
                    ${post.comments.length === 0 ? '<p style="color:#999; font-size:12px;">لا توجد تعليقات بعد.</p>' : post.comments.map(c => `<p style="background:#f9f9f9; padding:8px; margin:5px 0; font-size:13px; border-left:2px solid #000;">💬 ${c}</p>`).join('')}
                </div>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    <input type="text" id="input-${post.id}" placeholder="اكتب تعليقك هنا كزائر للموقع..." style="flex:1; padding:10px; border:1px solid #ccc; outline:none;">
                    <button onclick="addComment(${post.id})" style="background:#000; color:#fff; border:none; padding:10px 20px; cursor:pointer; font-weight:600; font-size:12px;">نشر</button>
                </div>
            </div>
            ${localStorage.getItem("isAdmin") === "true" ? `<button onclick="deletePost(${post.id})" style="background:#cc0000; color:#fff; border:none; padding:8px 15px; margin-top:20px; cursor:pointer; font-size:12px; font-weight:600;">حذف هذا المنشور 🗑️</button>` : ''}
        </div>
    `).join('');
}

// دالة النشر الإدارية (تأخذ عنوان، تفاصيل، ورابط الصورة)
function publishAdminPost() {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;
    const img = document.getElementById("postImgUrl").value;

    if (!title || !content) {
        alert("الرجاء كتابة العنوان والتفاصيل الهندسية للمشروع أولاً!");
        return;
    }

    const newPost = { id: Date.now(), title, content, img, comments: [] };
    posts.unshift(newPost);
    localStorage.setItem("studio_posts", JSON.stringify(posts));
    
    alert("تم نشر المشروع بنجاح على واجهة موقعك الجديد!");
    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
    document.getElementById("postImgUrl").value = "";
    renderPosts();
}

// دالة تفاعل الزوار لترك تعليقات
function addComment(postId) {
    const input = document.getElementById(`input-${postId}`);
    if (!input || input.value.trim() === "") return;

    posts = posts.map(p => {
        if (p.id === postId) p.comments.push(input.value);
        return p;
    });

    localStorage.setItem("studio_posts", JSON.stringify(posts));
    input.value = "";
    renderPosts();
}

// دالة حذف المنشور للأدمن أحمد
function deletePost(postId) {
    if (confirm("هل أنت متأكد من حذف هذا المنشور أو المشروع نهائياً من الموقع؟")) {
        posts = posts.filter(p => p.id !== postId);
        localStorage.setItem("studio_posts", JSON.stringify(posts));
        renderPosts();
    }
}

// دالة تسجيل الخروج للمسؤول
function logoutAdmin() {
    localStorage.removeItem("isAdmin");
    document.getElementById("adminPanelSection").style.display = "none";
    alert("تم تسجيل الخروج بنجاح.");
    window.location.reload();
}
