import { tr, requestForm } from '../ui.js';
import { esc } from '../core.js';
import { settings, rows } from '../settings.js';
export async function mount(el){
  const s = await settings().catch(() => ({}));
  const steps = rows(s, 'steps', tr('Consultation|We study your area, budget and customers.\nStarter stock|We supply your first kit of proven items.\nRestocking|We refill orders and suggest the best-sellers.','استشارة|ندرس منطقتك وميزانيتك وزبائنك.\nبضاعة البداية|نجهّز لك أول مجموعة من المنتجات المجرَّبة.\nإعادة التعبئة|نعيد التعبئة ونقترح الأكثر مبيعاً.'));
  el.innerHTML = `<section><h2>${tr('BAZ Partner Program: Open Your Own Accessories Shop','برنامج شركاء BAZ: افتح متجرك الخاص للإكسسوارات')}</h2>
   <p class="mut">${tr('For Lebanon and Syria. We guide you from the idea to a stocked shop.','للبنان وسوريا. نرافقك من الفكرة حتى متجر مجهّز بالبضاعة.')}</p>
   <div class="why">${steps.map(([a,b],i)=>`<div><span style="font-size:1.8rem">${i+1}</span><h3>${esc(a)}</h3><p class="mut">${esc(b||'')}</p></div>`).join('')}</div>
   <h2 style="margin-top:2rem">${tr('Apply now','قدّم طلبك الآن')}</h2><div id="f"></div></section>`;
  requestForm(el.querySelector('#f'), 'partner', [tr('Small shop','متجر صغير'),tr('Medium shop','متجر متوسط'),tr('Large shop / wholesale','متجر كبير / جملة')]);
}
