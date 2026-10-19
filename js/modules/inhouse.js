import { sb, t, pick, esc, wa, requireAuth } from '../core.js';
export async function mount(el){
  const { data, error } = await sb.from('inhouse_items').select('*').eq('active',true); if (error) throw error;
  el.innerHTML = `<h2>${t('inhouse','Made by BAZ: Seat Covers')}</h2><p class="mut">Built in our own workshop for cars, trucks, 4x4 and vans.</p>
   <div class="grid">${data.map(x=>`<article class="card"><div class="ph">BAZ</div><h3>${esc(pick(x,'name'))}</h3><p class="mut">${esc(pick(x,'desc'))}</p>
    <p><b>Material:</b> ${esc(x.materials)}<br><b>Production:</b> ${esc(x.production_time)}</p>
    <div class="chips">${(x.colors||[]).map(c=>`<span class="chip">${esc(c)}</span>`).join('')}</div>
    <div class="buy"><b>${t('from','From')} $${x.price_from}</b><button class="btn" data-r="${x.id}">Request a custom set</button></div></article>`).join('')}</div>`;
  el.querySelectorAll('[data-r]').forEach(b=>b.onclick=async()=>{
    const u = await requireAuth(); if(!u) return; const x = data.find(i=>i.id===b.dataset.r);
    const car = prompt('Vehicle make, model and year?'); if(!car) return;
    const color = prompt('Preferred color?') || '';
    const { error } = await sb.from('requests').insert({ kind:'custom_seat', details:{ item:x.name_en, car, color } });
    if (error) return alert(error.message);
    location.href = wa(`Hello BAZ, custom seat cover request: ${x.name_en}, vehicle: ${car}, color: ${color}`);
  });
}
