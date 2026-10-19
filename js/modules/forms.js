import { sb, wa, requireAuth, esc } from '../core.js';
// Shared by "Open your shop" and "Special requests". Same module = one place to fix.
export async function mount(el){
  const kind = el.dataset.kind, opts = JSON.parse(el.dataset.opts);
  el.innerHTML = `<h2>${esc(el.dataset.title)}</h2><p class="mut">${esc(el.dataset.intro)}</p>
   <form class="req"><select name="type">${opts.map(o=>`<option>${esc(o)}</option>`).join('')}</select>
   <input name="city" placeholder="City / location" required><textarea name="msg" placeholder="Tell us what you need" required></textarea>
   <button class="btn">Send request</button></form>`;
  el.querySelector('form').onsubmit = async e => {
    e.preventDefault(); const u = await requireAuth(); if(!u) return; const d = Object.fromEntries(new FormData(e.target));
    const { error } = await sb.from('requests').insert({ kind, details:d }); if (error) return alert(error.message);
    location.href = wa(`BAZ ${kind} request: ${d.type} | ${d.city} | ${d.msg}`);
  };
}
