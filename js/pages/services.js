import { tr, requestForm } from '../ui.js';
export async function mount(el){
  const s = [['🎨',tr('Custom painting & wraps','دهان وتغليف مخصص'),tr('Colors and finishes for your vehicle.','ألوان وتشطيبات لمركبتك.')],['📍',tr('GPS trackers','أجهزة تتبع GPS'),tr('We recommend and install the right tracker.','نقترح ونركّب الجهاز المناسب.')],['🔧',tr('Other car services','خدمات أخرى'),tr('Tell us what you need.','أخبرنا بما تحتاجه.')]];
  el.innerHTML = `<section><h2>${tr('Special Requests & Services','طلبات خاصة وخدمات')}</h2><div class="why">${s.map(([i,a,b])=>`<div><span style="font-size:1.8rem">${i}</span><h3>${a}</h3><p class="mut">${b}</p></div>`).join('')}</div>
   <h2 style="margin-top:2rem">${tr('Send a request','أرسل طلباً')}</h2><div id="f"></div></section>`;
  requestForm(el.querySelector('#f'), 'service', [tr('Custom painting / wrap','دهان / تغليف مخصص'),tr('GPS tracker','جهاز تتبع GPS'),tr('Other car service','خدمة أخرى')]);
}
