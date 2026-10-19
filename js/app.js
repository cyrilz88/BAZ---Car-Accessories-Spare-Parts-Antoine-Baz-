import { applyLang, setLang, lang, sb, requireAuth } from './core.js';
import { tr } from './ui.js';
applyLang();
const PAGES = { home:['Home','الرئيسية'], products:['Products','المنتجات'], seatcovers:['Custom Seat Covers','أغطية مقاعد بالطلب'], partner:['Partner Program','برنامج الشركاء'], services:['Services','الخدمات'], about:['About Us','من نحن'], contact:['Contact Us','اتصل بنا'] };
const $ = s => document.querySelector(s), menu = $('#menu');
menu.innerHTML = Object.entries(PAGES).map(([k,v]) => `<a href="#/${k}" data-p="${k}">${tr(...v)}</a>`).join('');
document.querySelectorAll('[data-ar]').forEach(e => { if (lang==='ar') e.textContent = e.dataset.ar; });
$('#q').placeholder = tr('Search for accessories, parts...','ابحث عن إكسسوارات وقطع غيار...');
document.querySelectorAll('[data-l]').forEach(b => { b.classList.toggle('on', b.dataset.l===lang); b.onclick = () => b.dataset.l!==lang && setLang(b.dataset.l); });
$('#search').onsubmit = e => { e.preventDefault(); location.hash = '#/products?q=' + encodeURIComponent($('#q').value.trim()); };
async function route(){
  const [path, qs] = location.hash.slice(2).split('?'), p = PAGES[path] ? path : 'home', view = $('#view');
  menu.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.p===p));
  view.innerHTML = ''; scrollTo(0,0); document.title = `BAZ | ${tr(...PAGES[p])}`;
  try { const m = await import(`./pages/${p}.js`); await m.mount(view, new URLSearchParams(qs||'')); }   // each page is isolated
  catch (e) { console.error(`[page:${p}]`, e); view.innerHTML = `<section><div class="down"><p>${tr('This page is temporarily unavailable. Please try again shortly.','هذه الصفحة غير متاحة مؤقتاً. حاول لاحقاً.')}</p></div></section>`; }
}
addEventListener('hashchange', route); route();
sb.auth.getSession().then(({ data:{ session } }) => { const b = $('#acct'); b.textContent = session ? tr('Sign out','خروج') : tr('Sign in','تسجيل الدخول');
  b.onclick = async () => { if (session) { await sb.auth.signOut(); location.reload(); } else if (await requireAuth()) location.reload(); }; }).catch(()=>{});
