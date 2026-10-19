import { sb, pick, esc } from '../core.js';
import { tr, card, bindOrder } from '../ui.js';
export async function mount(el, params){
  const [c, p] = await Promise.all([ sb.from('categories').select('*').order('sort'), sb.from('products').select('*').eq('active',true).order('created_at') ]);
  if (c.error || p.error) throw (c.error || p.error);
  let cat = params.get('cat') || 'all', veh = 'all'; const q = (params.get('q') || '').toLowerCase();
  const draw = () => {
    const cid = cat==='all' ? null : c.data.find(k => k.slug===cat)?.id;
    const list = p.data.filter(x => (!cid || x.category_id===cid) && (veh==='all' || x.vehicle_types.includes(veh)) && (!q || `${x.name_en} ${x.name_ar||''} ${x.desc_en||''}`.toLowerCase().includes(q)));
    el.innerHTML = `<section><h2>${tr('Products','المنتجات')}</h2>${q?`<p class="mut">${tr('Results for','نتائج البحث عن')} "${esc(q)}" (${list.length})</p>`:''}
      <div class="chips">${[['all',tr('All','الكل')],...c.data.map(k=>[k.slug,pick(k,'name')])].map(([s,n])=>`<button class="chip ${s===cat?'on':''}" data-c="${esc(s)}">${esc(n)}</button>`).join('')}</div>
      <div class="chips">${['all','car','truck','4x4'].map(v=>`<button class="chip ${v===veh?'on':''}" data-v="${v}">${v==='all'?tr('All vehicles','كل المركبات'):v}</button>`).join('')}</div>
      <div class="grid">${list.map(card).join('') || `<p>${tr('No products found.','لا توجد منتجات.')}</p>`}</div></section>`;
    el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { cat = b.dataset.c; draw(); });
    el.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { veh = b.dataset.v; draw(); });
    bindOrder(el, p.data);
  };
  draw();
}
