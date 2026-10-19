import { tr, requestForm } from '../ui.js';
import { esc } from '../core.js';
import { settings, rows } from '../settings.js';
export async function mount(el){
  const s = await settings().catch(() => ({}));
  const cards = rows(s, 'services', tr('🎨|Custom painting & wraps|Colors and finishes for your vehicle.\n📍|GPS trackers|We recommend and install the right tracker.\n🔧|Other car services|Tell us what you need.','🎨|دهان وتغليف مخصص|ألوان وتشطيبات لمركبتك.\n📍|أجهزة تتبع GPS|نقترح ونركّب الجهاز المناسب.\n🔧|خدمات أخرى|أخبرنا بما تحتاجه.'));
  el.innerHTML = `<section><h2>${tr('Special Requests & Services','طلبات خاصة وخدمات')}</h2><div class="why">${cards.map(([i,a,b])=>`<div><span style="font-size:1.8rem">${esc(i)}</span><h3>${esc(a)}</h3><p class="mut">${esc(b||'')}</p></div>`).join('')}</div>
   <h2 style="margin-top:2rem">${tr('Send a request','أرسل طلباً')}</h2><div id="f"></div></section>`;
  requestForm(el.querySelector('#f'), 'service', [tr('Custom painting / wrap','دهان / تغليف مخصص'),tr('GPS tracker','جهاز تتبع GPS'),tr('Other car service','خدمة أخرى')]);
}
