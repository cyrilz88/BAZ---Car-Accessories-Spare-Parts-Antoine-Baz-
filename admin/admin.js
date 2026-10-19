import { sb, esc } from '../js/core.js';
const app = document.getElementById('app');
const STOCK = 'sel:in_stock,low_stock,out_of_stock';
const CFG = {
  site:{ title:'Site content (home, about, contact...)' },
  products:{ title:'Products', label:'name_en', fields:[['category_id','Category','cat'],['name_en','Name (English)','text'],['name_ar','Name (Arabic)','text'],['desc_en','Description (English)','area'],['desc_ar','Description (Arabic)','area'],['price','Price (USD)','num'],['stock','Stock',STOCK],['vehicle_types','Vehicle types (comma separated: car,truck,4x4)','list'],['specs','Specs (one per line, Name: value)','specs'],['images','Photo links (one per line)','img'],['featured','Featured on top','bool'],['active','Visible on site','bool']] },
  inhouse_items:{ title:'Seat covers (in-house)', label:'name_en', fields:[['name_en','Name (English)','text'],['name_ar','Name (Arabic)','text'],['desc_en','Description (English)','area'],['desc_ar','Description (Arabic)','area'],['materials','Materials','text'],['colors','Colors (comma separated)','list'],['production_time','Production time','text'],['price_from','Price from (USD)','num'],['images','Photo links (one per line)','img'],['active','Visible on site','bool']] },
  categories:{ title:'Categories', label:'name_en', fields:[['name_en','Name (English)','text'],['name_ar','Name (Arabic)','text'],['slug','Short code (no spaces)','text'],['sort','Order number','num'],['image','Tile photo (home page)','pic']] },
  orders:{ title:'Orders', status:['new','confirmed','shipped','delivered','cancelled'] },
  requests:{ title:'Requests', status:['new','in_progress','done','cancelled'] }
};
let cats = [];
const ok = async () => { const { data:{ session } } = await sb.auth.getSession(); if (!session) return 'Please sign in on the main site first, then reopen this page.';
  const { data } = await sb.from('profiles').select('role').eq('id', session.user.id).single(); return data?.role==='admin' ? null : 'This account is not an admin.'; };
const bad = await ok();
if (bad) app.innerHTML = `<div class="down"><p>${bad}</p><a class="btn" href="../">Back to site</a></div>`; else { cats = (await sb.from('categories').select('*').order('sort')).data || []; show('site'); }

async function show(t){
  if (t==='site') return showSite();
  const c = CFG[t], { data, error } = await sb.from(t).select('*').order('created_at', { ascending:false, nullsFirst:false });
  const rows = error ? (await sb.from(t).select('*')).data || [] : data;
  app.innerHTML = `<h2>Admin</h2><div class="tabs">${Object.entries(CFG).map(([k,v])=>`<button class="chip ${k===t?'on':''}" data-t="${k}">${v.title}</button>`).join('')}</div>
   ${c.fields?`<button class="btn" id="add">+ Add new</button>`:''}<div>${rows.map(r=>c.fields?
    `<div class="row2"><div><b>${esc(r[c.label])}</b><br><small>${r.price?'$'+r.price+' · ':''}${r.active===false?'Hidden':''}</small></div><div><button class="btn sm" data-e="${r.id}">Edit</button> <button class="btn sm danger" data-d="${r.id}">Delete</button></div></div>`:
    `<div class="row2"><div><b>${new Date(r.created_at).toLocaleString()}</b>${r.total?` · $${r.total}`:''}<pre>${esc(JSON.stringify(r.items||r.details,null,1))}</pre></div>
     <select data-s="${r.id}">${c.status.map(s=>`<option ${s===r.status?'selected':''}>${s}</option>`).join('')}</select></div>`).join('')||'<p class="mut">Nothing here yet.</p>'}</div>`;
  app.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>show(b.dataset.t));
  app.querySelector('#add')?.addEventListener('click',()=>edit(t,{}));
  app.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>edit(t,rows.find(r=>r.id==b.dataset.e)));
  app.querySelectorAll('[data-d]').forEach(b=>b.onclick=async()=>{ if(!confirm('Delete this permanently?')) return; const {error}=await sb.from(t).delete().eq('id',b.dataset.d); error?alert(error.message):show(t); });
  app.querySelectorAll('[data-s]').forEach(s=>s.onchange=async()=>{ const {error}=await sb.from(t).update({status:s.value}).eq('id',s.dataset.s); if(error) alert(error.message); });
}
function edit(t, r){
  const d = document.createElement('dialog'); d.className='ed';
  const inp = ([k,l,ty]) => { const v = r[k]; let h;
    if (ty==='area') h=`<textarea name="${k}" rows="3">${esc(v)}</textarea>`;
    else if (ty==='num') h=`<input name="${k}" type="number" step="0.01" value="${esc(v)}">`;
    else if (ty==='bool') h=`<input name="${k}" type="checkbox" ${(v??(k==='active'))?'checked':''}>`;
    else if (ty==='cat') h=`<select name="${k}">${cats.map(c=>`<option value="${c.id}" ${c.id===v?'selected':''}>${esc(c.name_en)}</option>`).join('')}</select>`;
    else if (ty.startsWith('sel:')) h=`<select name="${k}">${ty.slice(4).split(',').map(o=>`<option ${o===(v||'in_stock')?'selected':''}>${o}</option>`).join('')}</select>`;
    else if (ty==='list') h=`<input name="${k}" value="${esc((v||(k==='vehicle_types'?['car','truck','4x4']:[])).join(', '))}">`;
    else if (ty==='specs') h=`<textarea name="${k}" rows="4">${esc(Object.entries(v||{}).map(([a,b])=>`${a}: ${b}`).join('\n'))}</textarea>`;
    else if (ty==='img') h=`<textarea name="${k}" rows="3">${esc((v||[]).join('\n'))}</textarea><input type="file" name="files" accept="image/*" multiple>`;
    else if (ty==='pic') h=`<input name="${k}" value="${esc(v)}" placeholder="Photo link"><input type="file" name="${k}_file" accept="image/*">`;
    else h=`<input name="${k}" value="${esc(v)}">`;
    return `<div class="f"><label>${l}</label>${h}</div>`; };
  d.innerHTML = `<form><h3>${r.id?'Edit':'Add'}</h3>${CFG[t].fields.map(inp).join('')}<p class="err"></p><div class="row"><button class="btn">Save</button><button type="button" class="btn ghost" id="x">Cancel</button></div></form>`;
  document.body.append(d); d.showModal(); d.querySelector('#x').onclick=()=>{d.remove();};
  d.querySelector('form').onsubmit = async e => { e.preventDefault(); const f=new FormData(e.target), o={}, err=d.querySelector('.err'); err.textContent='Saving...';
    try {
      for (const [k,,ty] of CFG[t].fields) { const v=f.get(k);
        if (ty==='bool') o[k]=e.target.elements[k].checked; else if (ty==='num'||ty==='cat') o[k]=v===''?null:+v;
        else if (ty==='list') o[k]=v.split(',').map(s=>s.trim()).filter(Boolean);
        else if (ty==='specs') o[k]=Object.fromEntries(v.split('\n').map(l=>l.split(/:(.+)/).map(s=>s?.trim())).filter(p=>p[0]&&p[1]));
        else if (ty==='img') { o[k]=v.split('\n').map(s=>s.trim()).filter(Boolean);
          for (const file of f.getAll('files')) { if(!file.name) continue; const p=`${t}/${Date.now()}-${file.name.replace(/[^\w.-]/g,'_')}`;
            const up=await sb.storage.from('media').upload(p,file); if(up.error) throw up.error; o[k].push(sb.storage.from('media').getPublicUrl(p).data.publicUrl); } }
        else if (ty==='pic') { o[k]=v||null; const file=f.get(k+'_file'); if (file&&file.name) { const p=`${t}/${Date.now()}-${file.name.replace(/[^\w.-]/g,'_')}`; const up=await sb.storage.from('media').upload(p,file); if(up.error) throw up.error; o[k]=sb.storage.from('media').getPublicUrl(p).data.publicUrl; } }
        else o[k]=v; }
      const q = r.id ? sb.from(t).update(o).eq('id',r.id) : sb.from(t).insert(o); const {error}=await q; if(error) throw error;
      d.remove(); show(t);
    } catch(x){ err.textContent=x.message; } };
}

const SITE = [
 ['Logo and footer', [['logo_image','Logo / banner (header and footer)','img'],['footer_en','Footer text (English)','area'],['footer_ar','Footer text (Arabic)','area']]],
 ['Home page: main banner', [['hero_image','Main banner photo','img'],['hero_title_en','Title (English)','text'],['hero_title_ar','Title (Arabic)','text'],['hero_sub_en','Subtitle (English)','text'],['hero_sub_ar','Subtitle (Arabic)','text']]],
 ['Home page: seat covers band', [['seatband_title_en','Title (English)','text'],['seatband_title_ar','Title (Arabic)','text'],['seatband_text_en','Text (English)','area'],['seatband_text_ar','Text (Arabic)','area']]],
 ['Home page: partner band', [['pband_title_en','Title (English)','text'],['pband_title_ar','Title (Arabic)','text'],['pband_text_en','Text (English)','area'],['pband_text_ar','Text (Arabic)','area']]],
 ['Home page: info boxes (one per line: icon | title | text)', [['why_en','English','area'],['why_ar','Arabic','area']]],
 ['Seat covers page: feature boxes (icon | title | text)', [['seatfeat_en','English','area'],['seatfeat_ar','Arabic','area']]],
 ['Partner program: steps (title | text)', [['steps_en','English','area'],['steps_ar','Arabic','area']]],
 ['Services page: cards (icon | title | text)', [['services_en','English','area'],['services_ar','Arabic','area']]],
 ['About us page (blank line = new paragraph)', [['about_en','English','area'],['about_ar','Arabic','area']]],
 ['Contact details (WhatsApp ordering number is set in js/config.js)', [['phone1','Phone 1','text'],['phone2','Phone 2','text'],['address_en','Address (English)','text'],['address_ar','Address (Arabic)','text'],['instagram','Instagram page link','text'],['email','Email (optional)','text'],['map','Google Maps link (optional)','text']]]
];
async function showSite(){
  const { data } = await sb.from('settings').select('*'), s = Object.fromEntries((data||[]).map(x => [x.key, x.value]));
  app.innerHTML = `<h2>Admin</h2><div class="tabs">${Object.entries(CFG).map(([k,v])=>`<button class="chip ${k==='site'?'on':''}" data-t="${k}">${v.title}</button>`).join('')}</div>
   <p class="mut">Leave a field empty to use the default text. Changes appear on the site after saving (reload with Ctrl+F5).</p>
   <form id="sf">${SITE.map(([g,fs])=>`<h3 style="margin-top:1.5rem">${g}</h3>${fs.map(([k,l,ty])=>`<div class="f"><label>${l}</label>${ty==='area'?`<textarea name="${k}" rows="3">${esc(s[k])}</textarea>`:ty==='img'?`<input name="${k}" value="${esc(s[k])}" placeholder="Photo link"><input type="file" name="${k}__file" accept="image/*">${s[k]?`<img src="${esc(s[k])}" alt="" style="max-width:220px;border-radius:8px">`:''}`:`<input name="${k}" value="${esc(s[k])}">`}</div>`).join('')}`).join('')}
   <p class="err"></p><button class="btn">Save all</button></form>`;
  app.querySelectorAll('[data-t]').forEach(b => b.onclick = () => show(b.dataset.t));
  app.querySelector('#sf').onsubmit = async e => { e.preventDefault(); const f = new FormData(e.target), out = [], err = app.querySelector('.err'); err.textContent = 'Saving...';
    try { for (const [, fs] of SITE) for (const [k,,ty] of fs) { let v = f.get(k) || '';
        if (ty==='img') { const file = f.get(k+'__file'); if (file && file.name) { const p = `site/${Date.now()}-${file.name.replace(/[^\w.-]/g,'_')}`; const up = await sb.storage.from('media').upload(p, file); if (up.error) throw up.error; v = sb.storage.from('media').getPublicUrl(p).data.publicUrl; } }
        out.push({ key:k, value:v }); }
      const { error } = await sb.from('settings').upsert(out); if (error) throw error; err.textContent = 'Saved. Open the site and press Ctrl+F5.'; showSite.keep = 1;
    } catch (x) { err.textContent = x.message; } };
}
