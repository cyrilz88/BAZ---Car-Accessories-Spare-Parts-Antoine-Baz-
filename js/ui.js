import { sb, lang, pick, esc, wa, requireAuth } from './core.js';
export const tr = (en, ar) => lang==='ar' ? ar : en;
export const safe = async (el, fn) => { try { await fn(el); } catch (e) { console.error(e); el.innerHTML = `<div class="down"><p>${tr('This section is temporarily unavailable. Please try again shortly.','هذا القسم غير متاح مؤقتاً. حاول لاحقاً.')}</p></div>`; } };
const iconFor = n => /oil|coolant|octane|spray/i.test(n) ? '🛢️' : /battery|jumper|inflator|led/i.test(n) ? '🔋' : /screen|sensor/i.test(n) ? '📟' : /seat|steering|key|fresh|holder|mat/i.test(n) ? '💺' : '🚘';
export const card = x => `<article class="card"><h3>${esc(pick(x,'name'))}</h3>
  <div class="ph">${x.images?.[0]?`<img loading="lazy" src="${esc(x.images[0])}" alt="${esc(pick(x,'name'))}">`:`<span>${iconFor(x.name_en)}</span>`}</div>
  <div class="cf"><b class="pr">$${x.price}</b><button class="btn" data-o="${x.id}">${tr('Order now','اطلب الآن')}</button></div>
  <details><summary>${tr('Details','التفاصيل')}</summary><p class="mut">${esc(pick(x,'desc'))}</p><table>${Object.entries(x.specs||{}).map(([k,v])=>`<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table></details></article>`;
export function bindOrder(el, list){
  el.querySelectorAll('[data-o]').forEach(b => b.onclick = async () => {
    const u = await requireAuth(); if (!u) return; const x = list.find(i => i.id === b.dataset.o);
    const { error } = await sb.from('orders').insert({ items:[{ id:x.id, name:x.name_en, qty:1, price:x.price }], total:x.price, payment_method:'cod' });
    if (error) return alert('Could not place the order: ' + error.message);
    location.href = wa(`Hello BAZ, I'd like to order: ${x.name_en} ($${x.price})`);
  });
}
export function requestForm(el, kind, opts){
  el.innerHTML = `<form class="req"><select name="type">${opts.map(o=>`<option>${esc(o)}</option>`).join('')}</select>
   <input name="city" placeholder="${tr('City / location','المدينة / الموقع')}" required><textarea name="msg" rows="4" placeholder="${tr('Tell us what you need','أخبرنا بما تحتاجه')}" required></textarea>
   <button class="btn">${tr('Send request','إرسال الطلب')}</button></form>`;
  el.querySelector('form').onsubmit = async e => { e.preventDefault(); const u = await requireAuth(); if (!u) return;
    const d = Object.fromEntries(new FormData(e.target)); const { error } = await sb.from('requests').insert({ kind, details:d });
    if (error) return alert(error.message); location.href = wa(`BAZ ${kind} request: ${d.type} | ${d.city} | ${d.msg}`); };
}
