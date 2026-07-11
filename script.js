/* ==========================================================================
   AHMED HAMID ARCHITECTURE - ADVANCED INTERACTIVE DESK
   ========================================================================== */

// 1. قاعدة بيانات الحسابات الرسمية والروابط الذكية
const CORPORATE_CONFIG = {
    email: "ahmedhamidarchitecture@gmail.com",
    whatsapp: "249924372845",
    linkedin: "https://www.linkedin.com/in/ahmed-hamid-architecture-9b9372260?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    tiktok: "https://vm.tiktok.com/ZS9M9KvHtr62K-4vcMJ/",
    instagram: "https://www.instagram.com/ahmed_hamid_architecture?igsh=MXd1ZDlyaHlpdzB5NA==",
    facebook: "https://www.instagram.com/ahmed_hamid_architecture?igsh=MXd1ZDlyaHlpdzB5NA==" // الرابط المرفق حالياً
};

// 2. تحديث الروابط ديناميكياً في جميع الصفحات لضمان عدم وجود أخطاء
document.addEventListener("DOMContentLoaded", () => {
    // تحديث روابط شبكات التواصل في الفوتر وفي صفحة Contact
    const fbLinks = document.querySelectorAll('a[href*="facebook.com"], .social-links a:nth-child(1)');
    const igLinks = document.querySelectorAll('a[href*="instagram.com"], .social-links a:nth-child(2)');
    const ttLinks = document.querySelectorAll('a[href*="tiktok.com"], .social-links a:nth-child(3)');
    const lnLinks = document.querySelectorAll('a[href*="linkedin.com"], .social-links a:nth-child(4)');

    fbLinks.forEach(el => el.href = CORPORATE_CONFIG.facebook);
    igLinks.forEach(el => el.href = CORPORATE_CONFIG.instagram);
    ttLinks.forEach(el => el.href = CORPORATE_CONFIG.tiktok);
    lnLinks.forEach(el => el.href = CORPORATE_CONFIG.linkedin);

    // ربط زر Let's Talk وزر الواتساب المباشر
    const talkButtons = document.querySelectorAll('.btn-talk, .btn-contact-outline');
    talkButtons.forEach(btn => {
        if(btn.textContent.includes("QUOTE") || btn.textContent.includes("TALK")) {
            btn.href = "contact.html";
        }
    });

    // 3. معالجة نموذج العميل المحتمل وإرسال البيانات فوراً للإيميل
    const projectForm = document.getElementById("projectIntakeForm");
    if (projectForm) {
        projectForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // تجميع بيانات الأرض والمخطط هندسياً
            const clientBrief = {
                name: document.getElementById("clientName").value,
                email: document.getElementById("clientEmail").value,
                phone: document.getElementById("clientPhone").value,
                type: document.getElementById("buildingType").value,
                location: document.getElementById("plotLocation").value,
                area: document.getElementById("plotArea").value,
                dimensions: document.getElementById("plotDimensions").value,
                streets: document.getElementById("surroundingStreets").value,
                requirements: document.getElementById("clientRequirements").value
            };

            // تحويل الزر إلى حالة جاري الإرسال
            const submitBtn = projectForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "TRANSMITTING BRIEF...";
            submitBtn.disabled = true;

            // إرسال البيانات إلى بريدك الإلكتروني عبر الـ API المجاني للنماذج الثابتة
            fetch(`https://formspree.io/f/xvgonwpe`, { // سيتم استبدال الـ ID بـ Formspree الخاص بك
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _to: CORPORATE_CONFIG.email,
                    subject: `Architectural Design Request from ${clientBrief.name}`,
                    message: `
                        --- CLIENT BRIEFING REPORT ---
                        Client Name: ${clientBrief.name}
                        Email: ${clientBrief.email}
                        Phone/WhatsApp: ${clientBrief.phone}
                        Structure Type: ${clientBrief.type}
                        
                        --- SITE SPECIFICATIONS ---
                        Plot Location: ${clientBrief.location}
                        Total Area: ${clientBrief.area} Sqm
                        Dimensions: ${clientBrief.dimensions}
                        Surrounding Streets: ${clientBrief.streets}
                        
                        --- SPATIAL REQUIREMENTS ---
                        Detailed Needs: ${clientBrief.requirements}
                    `
                })
            }).then(() => {
                // إظهار نص النجاح الصارم الذي طلبته بعد تسليم الملفات
                alert("تم رفع طلبك بنجاح. الرجاء الانتظار حتى يتم الرد عليك أو التواصل معك في أقرب وقت.");
                projectForm.reset();
                submitBtn.textContent = "SUBMIT DESIGN BRIEF →";
                submitBtn.disabled = false;
            }).catch(() => {
                // بديل سريع في حال فشل الاتصال بالسيرفر (التوجيه للواتساب مباشرة كنسخة احتياطية هندسية)
                const textMessage = `مرحباً مهندس أحمد، لقد أرسلت لك تفاصيل مشروعي عبر الموقع. اسمي: ${clientBrief.name}، مساحة الأرض: ${clientBrief.area}متر مربع.`;
                window.location.href = `https://wa.me/${CORPORATE_CONFIG.whatsapp}?text=${encodeURIComponent(textMessage)}`;
            });
        });
    }

    // 4. نظام تعليقات الزوار على المشاريع (Visitor Interaction Mode)
    initializeVisitorComments();

    // 5. بوابة تسجيل دخول الأدمن لإضافة المشاريع (Admin Control Panel)
    initializeAdminPortal();
});

/* ==========================================================================
   INTERACTIVE FEATURES (ADMIN & VISITOR SYSTEMS)
   ========================================================================== */

// محاكاة مصفوفة المشاريع المخزنة في الـ LocalStorage ليراها الزوار
let architectureProjects = JSON.parse(localStorage.getItem('studio_projects')) || [
    { id: 1, title: "Modernist Villa X", category: "Residential", comments: ["تصميم فخم وتوزيع الإضاءة عبقري!"] }
];

function initializeVisitorComments() {
    const commentContainer = document.getElementById("project-comments-area");
    if(commentContainer) {
        // كود ديناميكي يتيح للزائر كتابة تعليق وضغطه ليظهر فوراً أسفل المشروع
        window.addVisitorComment = function(projectId) {
            const commentInput = document.getElementById(`comment-input-${projectId}`);
            if(commentInput && commentInput.value.trim() !== "") {
                architectureProjects.find(p => p.id === projectId).comments.push(commentInput.value);
                localStorage.setItem('studio_projects', JSON.stringify(architectureProjects));
                alert("تم نشر تعليقك على المشروع بنجاح!");
                commentInput.value = "";
                // إعادة تحميل واجهة التعليقات
            }
        };
    }
}

function initializeAdminPortal() {
    // إنشاء زر مخفي في الفوتر أو في لوحة التحكم لدخول الأدمن (اضغط مرتين على الحقوق في الأسفل)
    const copyrightText = document.querySelector('.copyright');
    if(copyrightText) {
        copyrightText.style.cursor = "pointer";
        copyrightText.addEventListener("dblclick", () => {
            const adminEmail = prompt("Enter Admin Corporate Email:");
            const adminPassword = prompt("Enter Admin Security Password:");
            
            // حماية صارمة للوحة التحكم الخاصة ببروفايلك المهني
            if(adminEmail === CORPORATE_CONFIG.email && adminPassword === "AhmedHamid2026") {
                alert("Access Granted. Welcome Architect Ahmed Hamid.");
                const projectTitle = prompt("Enter New Project Title:");
                const projectCat = prompt("Enter Project Category (Residential / Commercial):");
                if(projectTitle && projectCat) {
                    architectureProjects.push({ id: Date.now(), title: projectTitle, category: projectCat, comments: [] });
                    localStorage.setItem('studio_projects', JSON.stringify(architectureProjects));
                    alert("Project successfully published to your portfolio!");
                    window.location.reload();
                }
            } else {
                alert("Authentication Failed. Unauthorized Access Deflected.");
            }
        });
    }
}

// زر الصعود للأعلى
const scrollBtn = document.getElementById("scrollTopBtn");
if(scrollBtn) {
    window.onscroll = () => { scrollBtn.style.display = (window.scrollY > 300) ? "block" : "none"; };
    scrollBtn.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}
