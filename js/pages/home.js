import { sb, pick, esc } from '../core.js';
import { tr, safe, card, bindOrder } from '../ui.js';
import { settings, L, rows } from '../settings.js';
const PIC = { interior:'images/cat-interior.jpg', fluids:'images/cat-fluids.jpg', electrical:'images/cat-electrical.jpg' };
const img = c => c.image || PIC[c.slug];
const ICON = { fluids:'🛢️', electrical:'🔋', exterior:'🚘', interior:'💺', electronics:'📟', spare:'⚙️' };
export async function mount(el){
  const s = await settings().catch(() => ({}));
  const why = rows(s, 'why', tr('🚚|Delivery to Lebanon & Syria|Cash on delivery, OMT or Whish\n💬|Order on WhatsApp|03/035 759\n🏭|Our own workshop|Seat covers made to measure\n🏪|Visit our showroom|Ain El Rihany, Main Road','🚚|توصيل إلى لبنان وسوريا|الدفع عند الاستلام أو OMT أو Whish\n💬|اطلب عبر واتساب|03/035 759\n🏭|ورشتنا الخاصة|أغطية مقاعد على القياس\n🏪|زر معرضنا|عين الريحاني - الطريق العام'));
  const band = (k, t1, t2, link, label) => `<section><div class="band"><div><h2>${esc(L(s,k+'_title',t1))}</h2><p>${esc(L(s,k+'_text',t2))}</p></div><a class="btn" href="${link}">${label}</a></div></section>`;
  el.innerHTML = `<section><div class="hero3" ${s.hero_image?`style="background-image:linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.55)),url('${esc(s.hero_image)}')"`:''}><div><h1>${esc(L(s,'hero_title',tr('Car Accessories','إكسسوارات السيارات')))}</h1><p>${esc(L(s,'hero_sub',tr('Find the best accessories for your car','اعثر على أفضل إكسسوارات سيارتك')))}</p><a class="btn" href="#/products">${tr('SHOP NOW','تسوق الآن')}</a></div></div></section>
   <section id="h-cat"></section><section id="h-feat"></section>
   ${band('seatband',tr('Made in our own workshop','صناعة ورشتنا'),tr('Premium and breathable spring seat covers, made to measure for any vehicle, in many colors.','أغطية مقاعد فاخرة وبنظام زنبرك للتهوية، مفصّلة على قياس سيارتك وبألوان متعددة.'),'#/seatcovers',tr('Explore seat covers','اكتشف الأغطية'))}
   <section><div class="why">${why.map(([i,a,b])=>`<div><span style="font-size:1.8rem">${esc(i)}</span><h3>${esc(a)}</h3><p class="mut">${esc(b||'')}</p></div>`).join('')}</div></section>
   ${band('pband',tr('Want to open your own accessories shop?','تريد فتح متجر إكسسوارات خاص بك؟'),tr('We advise you, supply your first stock and refill it with best-sellers.','نقدّم لك الاستشارة، ونجهّز بضاعتك الأولى ونعيد التعبئة بالأكثر مبيعاً.'),'#/partner',tr('Become a partner','كن شريكاً'))}`;
  await Promise.all([
    safe(el.querySelector('#h-cat'), async x => { const { data, error } = await sb.from('categories').select('*').order('sort'); if (error) throw error;
      x.innerHTML = `<h2>${tr('Shop by category','تسوق حسب الفئة')}</h2><div class="tiles">${data.map(c=>`<a class="tile" href="#/products?cat=${esc(c.slug)}" ${img(c)?`style="--img:url('${esc(img(c))}')"`:''}>${img(c)?'':`<span>${ICON[c.slug]||'🔧'}</span>`}<b>${esc(pick(c,'name'))}</b><i>${tr('SHOP NOW','تسوق الآن')}</i></a>`).join('')}</div>`; }),
    safe(el.querySelector('#h-feat'), async x => { const { data, error } = await sb.from('products').select('*').eq('active',true).eq('featured',true).limit(8); if (error) throw error;
      x.innerHTML = `<h2>${tr('Featured products','منتجات مميزة')}</h2><div class="grid">${data.map(card).join('')||'<p class="mut">—</p>'}</div>`; bindOrder(x, data); })
  ]);
}
