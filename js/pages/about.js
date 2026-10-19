import { tr, safe } from '../ui.js';
import { settings, L, paras } from '../settings.js';
export async function mount(el){
  const s = await settings().catch(() => ({}));
  const def = tr('BAZ by Antoine Baz supplies car accessories and spare parts for cars, trucks and 4x4 from our showroom in Ain El Rihany, and delivers across Lebanon and Syria.\n\nWe also make our own seat covers in our workshop, and help entrepreneurs open and stock their own accessories shops.','تؤمّن BAZ من أنطوان باز إكسسوارات وقطع غيار للسيارات والشاحنات والدفع الرباعي من معرضنا في عين الريحاني، وتوصّل إلى لبنان وسوريا.\n\nكما نصنع أغطية المقاعد في ورشتنا، ونساعد أصحاب المشاريع على فتح متاجرهم وتجهيزها بالبضاعة.');
  el.innerHTML = `<section><h2>${tr('About BAZ','عن BAZ')}</h2>${paras(L(s,'about',def))}</section>`;
}
