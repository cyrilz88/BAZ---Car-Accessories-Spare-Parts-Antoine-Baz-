import { sb, pick, esc, wa, requireAuth } from '../core.js';
import { tr } from '../ui.js';
import { settings, rows } from '../settings.js';
export async function mount(el){
  const { data, error } = await sb.from('inhouse_items').select('*').eq('active',true); if (error) throw error;
  const s = await settings().catch(() => ({}));
  const FEAT = rows(s, 'seatfeat', tr('🧵|Premium materials|High-end and long-lasting\n📐|Fitted, never slips|Stays firmly in place\n🌬️|Breathable spring design|Keeps your back from sweating\n🎨|Many colors|Choose your own style','🧵|خامات فاخرة|عالية الجودة وطويلة الأمد\n📐|محكمة لا تتحرك|تثبت بقوة في مكانها\n🌬️|نظام زنبرك للتهوية|يمنع تعرّق الظهر\n🎨|ألوان متعددة|اختر ما يناسب ذوقك'));
  el.innerHTML = `<section><h2>${tr('BAZ Custom Seat Covers: Made to Measure in Our Workshop','أغطية مقاعد BAZ: مفصّلة على قياس سيارتك في ورشتنا')}</h2>
   <p class="mut">${tr('Designed and sewn by BAZ for cars, trucks, 4x4 and vans.','تصميم وخياطة BAZ للسيارات والشاحنات والدفع الرباعي والفانات.')}</p>
   <div class="why">${FEAT.map(([i,a,b])=>`<div><span style="font-size:1.8rem">${i}</span><h3>${a}</h3><p class="mut">${b}</p></div>`).join('')}</div>
   <div class="grid">${data.map(x=>`<article class="card"><div class="ph">${x.images?.[0]?`<img loading="lazy" src="${esc(x.images[0])}" alt="${esc(pick(x,'name'))}">`:'<span>💺</span>'}</div><h3>${esc(pick(x,'name'))}</h3><p class="mut">${esc(pick(x,'desc'))}</p>
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
