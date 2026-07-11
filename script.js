async function loadProjects() {
    const container = document.getElementById("posts-feed-container");
    if (!container) return;

    try {
        const projects = await supabaseFetch("projects?select=*,comments(*)&order=created_at.desc");
        container.innerHTML = projects.map(project => {
            const isAdmin = localStorage.getItem("isAdmin") === "true";
            const commentsHtml = (project.comments || []).map(c => `
                <div class="comment-item">
                    <strong>👤 ${c.username}:</strong> ${c.comment_text}
                </div>
            `).join('');
            
            let imagesHtml = "";
            if (project.drive_image_ids && project.drive_image_ids.length > 0) {
                imagesHtml = `<div class="project-gallery">`;
                project.drive_image_ids.forEach(url => {
                    imagesHtml += `<img src="${url}" alt="مخطط المشروع" onerror="this.src='https://placehold.co/600x400?text=🖼️+Photo+In+Drive'">`;
                });
                imagesHtml += `</div>`;
            }

            return `
                <div class="post-card">
                    <h2>📋 ${project.title}</h2>
                    
                    <div class="project-details-grid">
                        <div class="detail-item">📍 <strong>الموقع:</strong> ${project.location || 'غير محدد'}</div>
                        <div class="detail-item">📐 <strong>المساحة:</strong> ${project.plot_area || 'غير محدد'}</div>
                        <div class="detail-item">🧱 <strong>المكونات:</strong> ${project.components || 'لا توجد تفاصيل'}</div>
                    </div>
                    
                    <div class="project-text-block"><strong>💡 الفكرة التصميمية (Concept):</strong> ${project.design_concept || 'لا توجد تفاصيل'}</div>
                    <div class="project-text-block"><strong>⚠️ التحديات والحلول:</strong> ${project.challenges || 'لا توجد تفاصيل'}</div>
                    <div class="project-text-block"><strong>🏆 النتيجة المعمارية:</strong> ${project.result || 'لا توجد تفاصيل'}</div>
                    
                    ${imagesHtml}
                    
                    <div class="comments-section">
                        <h4>💬 المناقشات والتعليقات:</h4>
                        <div class="comments-list" id="comments-list-${project.id}">
                            ${commentsHtml || '<p style="color:#aaa; font-size:13px; padding:10px;">لا توجد مناقشات على هذا المشروع بعد.</p>'}
                        </div>
                        <div class="comment-form">
                            <input type="text" id="user-${project.id}" class="input-name" placeholder="اسمك الكريم">
                            <input type="text" id="text-${project.id}" class="input-text" placeholder="أضف ملحوظة أو استفسار معماري...">
                            <button onclick="submitComment(${project.id})" class="btn-comment">تعليق 💬</button>
                        </div>
                    </div>
                    
                    ${isAdmin ? `<button onclick="deleteProject(${project.id})" class="btn-delete">حذف المشروع نهائياً 🗑️</button>` : ''}
                </div>
            `;
        }).join('');
    } catch (err) { console.error(err); }
}
