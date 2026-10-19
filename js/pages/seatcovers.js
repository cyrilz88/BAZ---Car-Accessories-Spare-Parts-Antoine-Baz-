import { sb, pick, esc, wa, requireAuth } from '../core.js';
import { tr } from '../ui.js';
export async function mount(el){
  const { data, error } = await sb.from('inhouse_items').select('*').eq('active',true); if (error) throw error;
  el.innerHTML = `<section><h2>${tr('BAZ Custom Seat Covers: Made to Measure in Our Workshop','أغطية مقاعد BAZ: مفصّلة على قياس سيارتك في ورشتنا')}</h2>
   <p class="mut">${tr('Designed and sewn by BAZ for cars, trucks, 4x4 and vans.','تصميم وخياطة BAZ للسيارات والشاحنات والدفع الرباعي والفانات.')}</p>
   <div class="why">${[['🧵',tr('Premium materials','خامات فاخرة'),tr('High-end and long-lasting','عالية الجودة وطويلة الأمد')],['📐',tr('Fitted, never slips','محكمة لا تتحرك'),tr('Stays firmly in place','تثبت بقوة في مكانها')],['🌬️',tr('Breathable spring design','نظام زنبرك للتهوية'),tr('Keeps your back from sweating','يمنع تعرّق الظهر')],['🎨',tr('Many colors','ألوان متعددة'),tr('Choose your own style','اختر ما يناسب ذوقك')]].map(([i,a,b])=>`<div><span style="font-size:1.8rem">${i}</span><h3>${a}</h3><p class="mut">${b}</p></div>`).join('')}</div>
   <div class="grid">${data.map(x=>`<article class="card"><div class="ph">${x.images?.[0]?`<img loading="lazy" src="${esc(x.images[0])}" alt="${esc(pick(x,'name'))}">`:'BAZ'}</div><h3>${esc(pick(x,'name'))}</h3><p class="mut">${esc(pick(x,'desc'))}</p>
    <p><b>${tr('Material','الخامة')}:</b> ${esc(x.materials)}<br><b>${tr('Production time','مدة التنفيذ')}:</b> ${esc(x.production_time)}</p>
    <div class="chips">${(x.colors||[]).map(c=>`<span class="chip">${esc(c)}</span>`).join('')}</div>
    <div class="buy"><b>${tr('From','ابتداءً من')} $${x.price_from}</b><button class="btn" data-r="${x.id}">${tr('Request a set','اطلب طقماً')}</button></div></article>`).join('')}</div></section>`;
  el.querySelectorAll('[data-r]').forEach(b => b.onclick = async () => {
    const u = await requireAuth(); if (!u) return; const x = data.find(i => i.id===b.dataset.r);
    const car = prompt(tr('Vehicle make, model and year?','نوع السيارة وموديلها وسنة الصنع؟')); if (!car) return; const color = prompt(tr('Preferred color?','اللون المفضل؟')) || '';
    const { error } = await sb.from('requests').insert({ kind:'custom_seat', details:{ item:x.name_en, car, color } }); if (error) return alert(error.message);
    location.href = wa(`Hello BAZ, custom seat cover request: ${x.name_en}, vehicle: ${car}, color: ${color}`);
  });
}
