import { applyLang, setLang, lang, t, sb, requireAuth } from './core.js';
applyLang();
document.querySelector('#lang').onclick = () => setLang(lang==='en'?'ar':'en');
document.querySelector('#lang').textContent = lang==='en' ? 'العربية' : 'English';
// Fault isolation: every module mounts independently. One failure never affects the others.
document.querySelectorAll('[data-module]').forEach(async el => {
  const name = el.dataset.module;
  try { const m = await import(`./modules/${name}.js`); await m.mount(el); }
  catch (e) { console.error(`[module:${name}]`, e); el.innerHTML = `<div class="down"><p>${t('unavailable','This section is temporarily unavailable. Please try again shortly.')}</p></div>`; }
});
sb.auth.getSession().then(({data:{session}})=>{
  const b = document.querySelector('#acct'); b.textContent = session ? t('out','Sign out') : t('signin','Sign in');
  b.onclick = async()=>{ if(session){ await sb.auth.signOut(); location.reload(); } else if(await requireAuth()) location.reload(); };
}).catch(()=>{});
