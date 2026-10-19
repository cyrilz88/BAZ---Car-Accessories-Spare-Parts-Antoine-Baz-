import { sb, t, pick, esc, wa, requireAuth } from '../core.js';
export async function mount(el){
  const [c, p] = await Promise.all([ sb.from('categories').select('*').order('sort'), sb.from('products').select('*').eq('active',true).order('created_at') ]);
  if (c.error || p.error) throw (c.error || p.error);
  let cat = 'all', veh = 'all';
  const draw = () => {
    const list = p.data.filter(x => (cat==='all'||x.category_id===cat) && (veh==='all'||x.vehicle_types.includes(veh)));
    el.innerHTML = `<h2>${t('shop','Shop')}</h2>
      <div class="chips">${[['all',t('all','All')],...c.data.map(k=>[k.id,pick(k,'name')])].map(([id,n])=>`<button class="chip ${id===cat?'on':''}" data-c="${id}">${esc(n)}</button>`).join('')}</div>
      <div class="chips">${['all','car','truck','4x4'].map(v=>`<button class="chip ${v===veh?'on':''}" data-v="${v}">${v==='all'?t('all','All vehicles'):v}</button>`).join('')}</div>
      <div class="grid">${list.map(x=>`<article class="card"><div class="ph">${x.images[0]?`<img loading="lazy" src="${esc(x.images[0])}" alt="${esc(pick(x,'name'))}">`:'BAZ'}</div>
        <h3>${esc(pick(x,'name'))}</h3><p class="mut">${esc(pick(x,'desc'))}</p>
        <table>${Object.entries(x.specs||{}).map(([k,v])=>`<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>
        <div class="buy"><b>$${x.price}</b><button class="btn" data-o="${x.id}">${t('order','Order')}</button></div></article>`).join('') || '<p>No products here yet.</p>'}</div>`;
    el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{cat=b.dataset.c==='all'?'all':+b.dataset.c;draw();});
    el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{veh=b.dataset.v;draw();});
    el.querySelectorAll('[data-o]').forEach(b=>b.onclick=async()=>{
      const u = await requireAuth(); if(!u) return; const x = p.data.find(i=>i.id===b.dataset.o);
      const { error } = await sb.from('orders').insert({ items:[{id:x.id,name:x.name_en,qty:1,price:x.price}], total:x.price, payment_method:'cod' });
      if (error) return alert('Could not place the order: '+error.message);
      location.href = wa(`Hello BAZ, I'd like to order: ${x.name_en} ($${x.price})`);
    });
  };
  draw();
}
