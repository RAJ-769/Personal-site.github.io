// 1. Age & Config
const ageEl = document.querySelector('.age');
if (ageEl) {
  const upd = () => ageEl.textContent = new Date(Date.now() - new Date('2001-10-31')).getUTCFullYear() - 1970;
  upd(); setInterval(upd, 864e5);
}

// 2. Links & Avatar
const links = ["https://x.com/im_RAJ769", "https://www.linkedin.com/in/raj769", "https://github.com/RAJ-769", "https://www.chess.com/member/raj769"];
document.querySelectorAll(".social-row a").forEach((a, i) => links[i] && Object.assign(a, { href: links[i], target: '_blank', rel: 'noopener' }));

const img = document.querySelector('.avatar-img');
if (img) {
  img.onload = () => img.parentElement.classList.remove('fallback');
  img.onerror = () => img.parentElement.classList.add('fallback');
  if (img.complete) img.onload();
}

// 3. Splash & Generative Bio
const splash = document.getElementById('introSplash');
const type = () => {
  const b = document.querySelector('.bio');
  if (!b || b.dataset.t) return;

  const parts = b.textContent.trim().split(/(\s+)/);
  b.textContent = '';
  b.dataset.t = 1;

  const c = document.createElement('span');
  c.className = 'bio-cursor';
  b.append(c);

  (async () => {
    for (const p of parts) {
      b.insertBefore(document.createTextNode(p), c);
      await new Promise(r => setTimeout(r, /\s/.test(p) ? 15 : 50));
    }
    c.remove();
  })();
};

if (splash) {
  const kill = () => { splash.classList.add('hidden'); sessionStorage.setItem('seen', 1); type(); setTimeout(() => splash.remove(), 1000); };
  if (sessionStorage.getItem('seen')) { splash.remove(); type(); } 
  else {
    setTimeout(kill, 2200); splash.onclick = kill;
    onkeydown = e => ["Escape", "Enter", " "].includes(e.key) && kill();
  }
} else setTimeout(type, 100);

// 4. Lighting System
const els = document.querySelectorAll('.card, .social-btn, .nav-btn'),
      set = (el, x, y, r = el.getBoundingClientRect()) => { el.style.setProperty('--x', x - r.left + 'px'); el.style.setProperty('--y', y - r.top + 'px'); };
let raf;

if (matchMedia("(hover:hover)").matches) {
  onmousemove = e => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => els.forEach(el => set(el, e.clientX, e.clientY))); };
} else {
  let act;
  const clear = () => (act?.classList.remove('glass-active'), act = null);
  const touch = e => {
    const t = e.touches[0],
      el = document.elementFromPoint(t.clientX, t.clientY)?.closest('.card, .social-btn, .nav-btn');

    if (act && act !== el) act.classList.remove('glass-active');
    if (el) {
      set(el, t.clientX, t.clientY);
      el.classList.add('glass-active');
      act = el;
    }
  };

  ontouchstart = ontouchmove = touch;
  ontouchend = ontouchcancel = clear;
}

// 5. Navigation & Back Gesture
document.querySelectorAll('.nav-btn:not([target="_blank"])').forEach(l => l.onclick = e => {
  e.preventDefault(); document.body.classList.add('fade-out');
  setTimeout(() => l.getAttribute('aria-label') === 'Go Back' && document.referrer.includes(location.host) ? history.back() : location.assign(l.href), 800);
});

onpageshow = e => {
  if (e.persisted || document.body.classList.contains('fade-out')) document.body.classList.remove('fade-out');
  document.querySelectorAll('.glass-active').forEach(e => e.classList.remove('glass-active'));
  if (sessionStorage.getItem('seen')) document.getElementById('introSplash')?.remove();
};

// 6.Dropdown Menu
const mBtn = document.querySelector('.contact-trigger'), mWrap = document.querySelector('.nav-menu-wrap');
if (mBtn) {
  mBtn.onclick = e => (e.stopPropagation(), mWrap.classList.toggle('open'));
  onclick = () => mWrap.classList.remove('open');
  mWrap.onclick = e => e.stopPropagation();
}