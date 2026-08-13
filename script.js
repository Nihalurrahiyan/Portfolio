// ---------- Shared: respect reduced-motion preference everywhere ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Render content from data.js ----------

function renderContact(){
  const c = PORTFOLIO_DATA.contact;
  document.getElementById('emailLink').href = `mailto:${c.email}`;
  document.getElementById('linkedinLink').href = c.linkedin;
  document.getElementById('githubLink').href = c.github;
  document.getElementById('footerEmail').href = `mailto:${c.email}`;
  document.getElementById('footerEmail').textContent = c.email;
  document.getElementById('footerLinkedin').href = c.linkedin;
  document.getElementById('footerGithub').href = c.github;
  document.getElementById('footerLocation').textContent = c.location;
}

function renderMetrics(){
  const el = document.getElementById('metricsGrid');
  el.innerHTML = PORTFOLIO_DATA.metrics.map(m => `
    <div class="metric-card">
      <div class="metric-num" data-count="${m.count}"><span></span><span class="unit">${m.unit}</span></div>
      <div class="metric-label">${m.label}</div>
      <div class="metric-before">${m.before} &rarr; <b>${m.after}</b></div>
    </div>
  `).join('');
}

function renderExperience(){
  const el = document.getElementById('timeline');
  el.innerHTML = PORTFOLIO_DATA.experience.map(e => `
    <div class="tl-entry">
      <div class="tl-card">
        <p class="tl-tag">${e.tag}</p>
        <h3 class="tl-role">${e.role}</h3>
        <p class="tl-meta">${e.meta}</p>
        <ul class="tl-list">
          ${e.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

function renderSkills(){
  const el = document.getElementById('skillsGrid');
  el.innerHTML = PORTFOLIO_DATA.skills.map(s => `
    <div class="skill-panel${s.wide ? ' wide' : ''}">
      <h4>${s.category}</h4>
      <div class="tag-row">
        ${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderProjects(){
  const el = document.getElementById('projectsList');
  el.innerHTML = PORTFOLIO_DATA.projects.map(p => `
    <div class="project-card">
      <p class="project-tag">${p.tag}</p>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      ${p.proof ? `<div class="proof-box">${p.proof}</div>` : ''}
      ${(p.links && p.links.length) ? `
        <div class="project-links">
          ${p.links.map(l => `<a class="arrow-link" href="${l.url}" target="_blank" rel="noopener">${l.label}<span class="arrow">&nearr;</span></a>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
}

function renderEducation(){
  const el = document.getElementById('eduList');
  el.innerHTML = PORTFOLIO_DATA.education.map(ed => `
    <div class="list-row">
      <div class="name">${ed.name}</div>
      <div class="meta">${ed.meta}</div>
    </div>
  `).join('');
}

function renderAwards(){
  const el = document.getElementById('awardsList');
  el.innerHTML = PORTFOLIO_DATA.awards.map(a => `
    <div class="award-row">
      <div class="name">${a.name}</div>
      <div class="desc">${a.desc}</div>
    </div>
  `).join('');
}

function renderCopyright(){
  document.getElementById('copyrightYear').textContent = new Date().getFullYear();
}

renderContact();
renderMetrics();
renderExperience();
renderSkills();
renderProjects();
renderEducation();
renderAwards();
renderCopyright();

// ---------- Rotating role title (typewriter) ----------
function renderRoles(){
  const roleEl = document.getElementById('roleText');
  const roles = (PORTFOLIO_DATA.roles && PORTFOLIO_DATA.roles.length)
    ? PORTFOLIO_DATA.roles
    : ['Database Developer'];

  if(reduceMotion){
    roleEl.textContent = roles[0];
    return;
  }

  const TYPE_SPEED = 65;
  const DELETE_SPEED = 32;
  const HOLD_TIME = 1700;
  const GAP_TIME = 400;
  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick(){
    const current = roles[roleIndex];
    if(!deleting){
      charIndex++;
      roleEl.textContent = current.slice(0, charIndex);
      if(charIndex === current.length){
        deleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      roleEl.textContent = current.slice(0, charIndex);
      if(charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, GAP_TIME);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }
  tick();
}
renderRoles();

// ---------- Fade the scroll cue as soon as the user scrolls ----------
const scrollCue = document.querySelector('.scroll-cue');
function updateScrollCue(){
  if(!scrollCue) return;
  if(window.scrollY > 40){
    scrollCue.classList.add('hidden');
  } else {
    scrollCue.classList.remove('hidden');
  }
}
window.addEventListener('scroll', updateScrollCue, { passive: true });
updateScrollCue();

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ---------- Counting metrics ----------
const counters = document.querySelectorAll('.metric-num');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-count'), 10);
    const span = el.querySelector('span');
    const duration = 1200;
    const startTime = performance.now();
    function step(now){
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      span.textContent = Math.round(eased * target);
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(el => countIO.observe(el));

// ---------- Persistent schema graph canvas (fixed background, whole page) ----------
const canvas = document.getElementById('bgGraphCanvas');
const ctx = canvas.getContext('2d');
let W, H, DPR;
const labels = ['employees','shows','seats','bookings','attendance','branches','vouchers','tickets','shifts','payroll','audit_log','sessions'];

function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
}

let nodes = [];
function initNodes(){
  const count = window.innerWidth < 640 ? 12 : 22;
  nodes = Array.from({length: count}, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    label: labels[i % labels.length],
    showLabel: i % 3 === 0
  }));
}

function draw(){
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a = nodes[i], b = nodes[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      const maxDist = 240;
      if(dist < maxDist){
        const alpha = (1 - dist/maxDist) * 0.32;
        ctx.strokeStyle = `rgba(92,225,230,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
        ctx.stroke();
      }
    }
  }
  ctx.font = '11px JetBrains Mono, monospace';
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 3, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(156,140,255,0.85)';
    ctx.shadowColor = 'rgba(156,140,255,0.75)';
    ctx.shadowBlur = 7;
    ctx.fill();
    ctx.shadowBlur = 0;
    if(n.showLabel){
      ctx.fillStyle = 'rgba(154,165,184,0.5)';
      ctx.fillText(n.label, n.x + 8, n.y - 8);
    }
  });
}

function step(){
  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if(n.x < 0 || n.x > W) n.vx *= -1;
    if(n.y < 0 || n.y > H) n.vy *= -1;
  });
  draw();
  if(!reduceMotion) requestAnimationFrame(step);
}

function start(){
  resize(); initNodes(); draw();
  if(!reduceMotion) requestAnimationFrame(step);
}
window.addEventListener('resize', () => { resize(); initNodes(); draw(); });
start();

document.addEventListener('visibilitychange', () => {
  if(!document.hidden && !reduceMotion) requestAnimationFrame(step);
});

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// ---------- Cursor spotlight ----------
if(!reduceMotion){
  const spotlight = document.getElementById('spotlight');
  window.addEventListener('mousemove', (e) => {
    spotlight.style.setProperty('--mx', e.clientX + 'px');
    spotlight.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });
}