import { wa } from '../core.js';
import { tr } from '../ui.js';
import { INSTAGRAM, EMAIL, MAP } from '../site.js';
export async function mount(el){
  el.innerHTML = `<section><h2>${tr('Contact Us','اتصل بنا')}</h2><div class="why">
   <div><h3>📍 ${tr('Showroom','المعرض')}</h3><p>${tr('Ain El Rihany, Main Road','عين الريحاني - الطريق العام')}</p><a class="btn sm" href="${MAP}" target="_blank" rel="noopener">${tr('Open map','افتح الخريطة')}</a></div>
   <div><h3>📞 ${tr('Phone','الهاتف')}</h3><p><a href="tel:+9613035759">03/035 759</a><br><a href="tel:+9613814410">03/814 410</a></p><a class="btn sm" href="tel:+9613035759">${tr('Call us','اتصل بنا')}</a></div>
   <div><h3>💬 WhatsApp</h3><p>03/035 759</p><a class="btn sm" href="${wa('Hello BAZ')}">${tr('Message us','راسلنا')}</a></div>
   <div><h3>📷 Instagram</h3><p>${tr('Follow our latest work','تابع آخر أعمالنا')}</p><a class="btn sm" href="${INSTAGRAM}" target="_blank" rel="noopener">${tr('Follow us','تابعنا')}</a></div>${EMAIL?`<div><h3>✉️ Email</h3><p>${EMAIL}</p></div>`:''}</div></section>`;
}
