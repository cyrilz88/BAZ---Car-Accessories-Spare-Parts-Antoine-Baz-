import { SUPABASE_URL, SUPABASE_ANON_KEY, WHATSAPP } from './config.js';
export const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const T = { ar:{shop:'تسوق',inhouse:'صناعتنا',partner:'افتح متجرك',services:'خدمات',order:'اطلب الآن',call:'اتصل بنا',signin:'تسجيل الدخول',out:'خروج',signinFirst:'سجّل الدخول للمتابعة',unavailable:'هذا القسم غير متاح مؤقتاً. حاول لاحقاً.',from:'ابتداءً من',all:'الكل'} };
export let lang = localStorage.lang || 'en';
export const t = (k, en) => (lang==='ar' && T.ar[k]) || en;
export const pick = (o, f) => (lang==='ar' && o[f+'_ar']) || o[f+'_en'] || o[f];
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function setLang(l){ localStorage.lang=l; location.reload(); }
export function applyLang(){ document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr'; }
export const wa = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

// Sign-in gate: guests browse freely; call await requireAuth() before ordering/forms.
export async function requireAuth(){
  const { data:{ session } } = await sb.auth.getSession();
  if (session) return session.user;
  return new Promise(res => {
    const d = document.createElement('dialog'); d.className='auth';
    d.innerHTML = `<form method="dialog"><h3>${t('signinFirst','Sign in to continue')}</h3>
      <input name="name" placeholder="Full name (new accounts)"><input name="email" type="email" placeholder="Email" required>
      <input name="pw" type="password" placeholder="Password (min 6)" minlength="6" required><p class="err"></p>
      <div class="row"><button value="in" class="btn">Sign in</button><button value="up" class="btn ghost">Create account</button></div></form>`;
    document.body.append(d); d.showModal();
    d.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault(); const f = new FormData(e.target), mode = e.submitter.value;
      const cred = { email:f.get('email'), password:f.get('pw') };
      const r = mode==='up' ? await sb.auth.signUp({ ...cred, options:{ data:{ full_name:f.get('name') } } }) : await sb.auth.signInWithPassword(cred);
      if (r.error) return d.querySelector('.err').textContent = r.error.message;
      if (!r.data.session) return d.querySelector('.err').textContent = 'Check your email to confirm, then sign in.';
      d.close(); d.remove(); res(r.data.user);
    });
    d.addEventListener('cancel', () => { d.remove(); res(null); });
  });
}
