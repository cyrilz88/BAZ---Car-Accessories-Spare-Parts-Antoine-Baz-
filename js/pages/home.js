import { sb, pick, esc } from '../core.js';
import { tr, safe, card, bindOrder } from '../ui.js';
const ICON = { fluids:'🛢️', electrical:'🔋', exterior:'🚘', interior:'💺', electronics:'📟', spare:'⚙️' };
export async function mount(el){
  el.innerHTML = `<section><div class="hero3"><div><h1>${tr('Car Accessories','إكسسوارات السيارات')}</h1><p>${tr('Find the best accessories for your car','اعثر على أفضل إكسسوارات سيارتك')}</p><a class="btn" href="#/products">${tr('SHOP NOW','تسوق الآن')}</a></div></div></section>
   <section id="h-cat"></section><section id="h-feat"></section>
   <section><div class="band"><div><h2>${tr('Made in our own workshop','صناعة ورشتنا')}</h2><p>${tr('Premium and breathable spring seat covers, made to measure for any vehicle, in many colors.','أغطية مقاعد فاخرة وبنظام زنبرك للتهوية، مفصّلة على قياس سيارتك وبألوان متعددة.')}</p></div><a class="btn" href="#/seatcovers">${tr('Explore seat covers','اكتشف الأغطية')}</a></div></section>
   <section><div class="why">${[['🚚',tr('Delivery to Lebanon & Syria','توصيل إلى لبنان وسوريا'),tr('Cash on delivery, OMT or Whish','الدفع عند الاستلام أو OMT أو Whish')],['💬',tr('Order on WhatsApp','اطلب عبر واتساب'),'03/035 759'],['🏭',tr('Our own workshop','ورشتنا الخاصة'),tr('Seat covers made to measure','أغطية مقاعد على القياس')],['🏪',tr('Visit our showroom','زر معرضنا'),tr('Ain El Rihany, Main Road','عين الريحاني - الطريق العام')]].map(([i,a,b])=>`<div><span style="font-size:1.8rem">${i}</span><h3>${a}</h3><p class="mut">${b}</p></div>`).join('')}</div></section>
   <section><div class="band"><div><h2>${tr('Want to open your own accessories shop?','تريد فتح متجر إكسسوارات خاص بك؟')}</h2><p>${tr('We advise you, supply your first stock and refill it with best-sellers.','نقدّم لك الاستشارة، ونجهّز بضاعتك الأولى ونعيد التعبئة بالأكثر مبيعاً.')}</p></div><a class="btn" href="#/partner">${tr('Become a partner','كن شريكاً')}</a></div></section>`;
  await Promise.all([
    safe(el.querySelector('#h-cat'), async s => { const { data, error } = await sb.from('categories').select('*').order('sort'); if (error) throw error;
      s.innerHTML = `<h2>${tr('Shop by category','تسوق حسب الفئة')}</h2><div class="tiles">${data.map(c=>`<a class="tile" href="#/products?cat=${esc(c.slug)}" ${c.image?`style="--img:url('${esc(c.image)}')"`:''}>${c.image?'':`<span>${ICON[c.slug]||'🔧'}</span>`}<b>${esc(pick(c,'name'))}</b><i>${tr('SHOP NOW','تسوق الآن')}</i></a>`).join('')}</div>`; }),
    safe(el.querySelector('#h-feat'), async s => { const { data, error } = await sb.from('products').select('*').eq('active',true).eq('featured',true).limit(8); if (error) throw error;
      s.innerHTML = `<h2>${tr('Featured products','منتجات مميزة')}</h2><div class="grid">${data.map(card).join('')||'<p class="mut">—</p>'}</div>`; bindOrder(s, data); })
  ]);
}
