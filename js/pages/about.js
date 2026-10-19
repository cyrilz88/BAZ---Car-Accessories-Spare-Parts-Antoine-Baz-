import { tr } from '../ui.js';
export async function mount(el){
  el.innerHTML = `<section><h2>${tr('About BAZ','عن BAZ')}</h2>
   <p>${tr('BAZ by Antoine Baz supplies car accessories and spare parts for cars, trucks and 4x4 from our showroom in Ain El Rihany, and delivers across Lebanon and Syria.','تؤمّن BAZ من أنطوان باز إكسسوارات وقطع غيار للسيارات والشاحنات والدفع الرباعي من معرضنا في عين الريحاني، وتوصّل إلى لبنان وسوريا.')}</p>
   <p>${tr('We also make our own seat covers in our workshop, and help entrepreneurs open and stock their own accessories shops.','كما نصنع أغطية المقاعد في ورشتنا، ونساعد أصحاب المشاريع على فتح متاجرهم وتجهيزها بالبضاعة.')}</p></section>`;
}
