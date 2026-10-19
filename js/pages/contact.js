import { wa } from '../core.js';
import { tr } from '../ui.js';
import { INSTAGRAM, EMAIL, MAP } from '../site.js';
import { settings, L, tel } from '../settings.js';
export async function mount(el){
  const s = await settings().catch(() => ({})), p1 = s.phone1 || '03/035 759', p2 = s.phone2 || '03/814 410', ig = s.instagram || INSTAGRAM, em = s.email || EMAIL, map = s.map || MAP;
  el.innerHTML = `<section><h2>${tr('Contact Us','اتصل بنا')}</h2><div class="why">
   <div><h3>📍 ${tr('Showroom','المعرض')}</h3><p>${L(s,'address',tr('Ain El Rihany, Main Road','عين الريحاني - الطريق العام'))}</p><a class="btn sm" href="${map}" target="_blank" rel="noopener">${tr('Open map','افتح الخريطة')}</a></div>
   <div><h3>📞 ${tr('Phone','الهاتف')}</h3><p><a href="tel:${tel(p1)}">${p1}</a><br><a href="tel:${tel(p2)}">${p2}</a></p><a class="btn sm" href="tel:${tel(p1)}">${tr('Call us','اتصل بنا')}</a></div>
   <div><h3>💬 WhatsApp</h3><p>03/035 759</p><a class="btn sm" href="${wa('Hello BAZ')}">${tr('Message us','راسلنا')}</a></div>
   <div><h3>📷 Instagram</h3><p>${tr('Follow our latest work','تابع آخر أعمالنا')}</p><a class="btn sm" href="${ig}" target="_blank" rel="noopener">${tr('Follow us','تابعنا')}</a></div>${em?`<div><h3>✉️ Email</h3><p>${em}</p></div>`:''}</div></section>`;
}
