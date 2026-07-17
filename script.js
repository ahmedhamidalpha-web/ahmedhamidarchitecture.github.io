// Scroll reveal
const io = new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in'); io.unobserve(e.target);}})},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Nav solid-on-scroll (only affects pages that opt in via .nav-scroll-solid)
window.addEventListener('scroll', ()=>{
  const nav = document.getElementById('nav');
  if(nav && nav.classList.contains('nav-scroll-solid')){
    nav.classList.toggle('solid', window.scrollY > 40);
  }
});

// Mobile burger menu
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
if(burger && navLinks){
  burger.addEventListener('click', ()=>{
    const open = navLinks.style.display === 'flex';
    navLinks.style.cssText = open ? 'display:none;' : 'display:flex; position:fixed; top:64px; left:0; right:0; background:#fff; flex-direction:column; padding:20px 32px; gap:18px; border-bottom:1px solid var(--line); z-index:99;';
  });
}

// Gallery / project filtering — pages define window.GALLERY_DATA before loading this script
const DEFAULT_GALLERY = [
  {url:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=700&auto=format&fit=crop', cat:'residential', cls:'g1', name:'Modern Villa — Concept'},
  {url:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=700&auto=format&fit=crop', cat:'interior', cls:'g2', name:'Living Space — Concept'},
  {url:'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=700&auto=format&fit=crop', cat:'residential', cls:'g3', name:'Villa with Pool — Concept'},
  {url:'https://images.unsplash.com/photo-1600566753376-12c8ab8e17a9?q=80&w=700&auto=format&fit=crop', cat:'commercial', cls:'g4', name:'Office Building — Concept'},
  {url:'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=700&auto=format&fit=crop', cat:'interior', cls:'g5', name:'Interior Lounge — Concept'},
  {url:'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=700&auto=format&fit=crop', cat:'commercial', cls:'g2', name:'Commercial Facade — Concept'},
];
const galleryImages = window.GALLERY_DATA || DEFAULT_GALLERY;
const grid = document.getElementById('galleryGrid');
function renderGallery(filter){
  if(!grid) return;
  grid.innerHTML = '';
  galleryImages.filter(g=>filter==='all'||g.cat===filter).forEach(g=>{
    const div = document.createElement('div');
    div.className = 'g-item ' + (g.cls || 'g2');
    div.innerHTML = `<img src="${g.url}" alt="${g.name || g.cat + ' project photo'}" loading="lazy">`;
    grid.appendChild(div);
  });
}
if(grid){
  renderGallery('all');
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    });
  });
}
