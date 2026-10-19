import { tr, requestForm } from '../ui.js';
export async function mount(el){
  const steps = [[tr('Consultation','استشارة'),tr('We study your area, budget and customers.','ندرس منطقتك وميزانيتك وزبائنك.')],[tr('Starter stock','بضاعة البداية'),tr('We supply your first kit of proven items.','نجهّز لك أول مجموعة من المنتجات المجرَّبة.')],[tr('Restocking','إعادة التعبئة'),tr('We refill orders and suggest the best-sellers.','نعيد التعبئة ونقترح الأكثر مبيعاً.')]];
  el.innerHTML = `<section><h2>${tr('BAZ Partner Program: Open Your Own Accessories Shop','برنامج شركاء BAZ: افتح متجرك الخاص للإكسسوارات')}</h2>
   <p class="mut">${tr('For Lebanon and Syria. We guide you from the idea to a stocked shop.','للبنان وسوريا. نرافقك من الفكرة حتى متجر مجهّز بالبضاعة.')}</p>
   <div class="why">${steps.map(([a,b],i)=>`<div><span style="font-size:1.8rem">${i+1}</span><h3>${a}</h3><p class="mut">${b}</p></div>`).join('')}</div>
   <h2 style="margin-top:2rem">${tr('Apply now','قدّم طلبك الآن')}</h2><div id="f"></div></section>`;
  requestForm(el.querySelector('#f'), 'partner', [tr('Small shop','متجر صغير'),tr('Medium shop','متجر متوسط'),tr('Large shop / wholesale','متجر كبير / جملة')]);
}
