insert into categories(slug,name_en,name_ar,sort) values
('fluids','Fluids & Maintenance','سوائل وصيانة',1),('electrical','Electrical & Power','كهرباء وطاقة',2),('exterior','Exterior','خارجي',3),
('interior','Interior & Comfort','داخلي وراحة',4),('electronics','Electronics & Sensors','إلكترونيات وحساسات',5),('spare','Spare Parts','قطع غيار',6);
insert into products(category_id,name_en,name_ar,desc_en,price,specs,featured) values
((select id from categories where slug='fluids'),'Synthetic Engine Oil 5W-30 (4L)','زيت محرك 5W-30','Full synthetic oil for petrol and diesel engines.',32,'{"Viscosity":"5W-30","Volume":"4 L","Type":"Full synthetic"}',true),
((select id from categories where slug='fluids'),'Long-Life Coolant (5L)','مياه رادياتور','Pre-mixed coolant, protects against boil-over and corrosion.',12,'{"Volume":"5 L","Color":"Green"}',false),
((select id from categories where slug='fluids'),'Octane Booster','محسن أوكتان','Cleans injectors and raises octane rating.',6,'{"Volume":"300 ml"}',false),
((select id from categories where slug='electrical'),'Car Battery 70Ah','بطارية سيارة 70 أمبير','Maintenance-free battery with high cold-crank power.',95,'{"Capacity":"70 Ah","Voltage":"12 V"}',true),
((select id from categories where slug='electrical'),'Jumper Cables 500A','أسلاك شحن','Heavy-duty copper clamps, 3 m.',18,'{"Rating":"500 A","Length":"3 m"}',false),
((select id from categories where slug='electrical'),'Portable Tire Inflator','منفاخ إطارات','12V digital inflator with auto shut-off.',28,'{"Power":"12 V","Max":"150 PSI"}',true),
((select id from categories where slug='electrical'),'LED Headlight Bulbs H7','لمبات LED','6000K white, plug-and-play.',35,'{"Fitment":"H7","Color":"6000K"}',false),
((select id from categories where slug='exterior'),'Wiper Blades (pair)','مساحات زجاج','Silicone all-weather blades.',14,'{"Sizes":"16-28 in"}',false),
((select id from categories where slug='exterior'),'Tire Hubcaps (set of 4)','أغطية جنوط','ABS, various sizes.',22,'{"Sizes":"13-16 in"}',false),
((select id from categories where slug='exterior'),'Waterproof Car Cover','غطاء سيارة','UV and rain protection, sizes S-XXL.',40,'{"Material":"Polyester"}',false),
((select id from categories where slug='interior'),'Universal Floor Mats (set)','دعاسات أرضية','Anti-slip rubber, trim-to-fit.',30,'{"Pieces":"4"}',true),
((select id from categories where slug='interior'),'Steering Wheel Cover','غطاء مقود','Leather-look, anti-slip.',10,'{"Size":"38 cm"}',false),
((select id from categories where slug='interior'),'Magnetic Phone Holder','حامل هاتف','Dashboard or vent mount.',8,'{}',false),
((select id from categories where slug='interior'),'Car Air Freshener','معطر سيارة','Long-lasting scents.',3,'{}',false),
((select id from categories where slug='electronics'),'Android Car Screen 9"','شاشة سيارة','Touch screen with GPS and Bluetooth.',150,'{"Size":"9 in","OS":"Android"}',true),
((select id from categories where slug='electronics'),'Parking Sensors (4)','حساسات ركن','Reverse parking sensors with buzzer.',25,'{"Count":"4"}',false),
((select id from categories where slug='electronics'),'Seatbelt Sensor (replacement)','حساس حزام أمان','Replacement sensor; confirm model before ordering.',12,'{}',false);
insert into inhouse_items(name_en,name_ar,desc_en,materials,colors,production_time,price_from) values
('BAZ Premium Seat Covers','أغطية مقاعد بريميوم','Made to measure in high-end, long-lasting material. Fitted, anti-slip design that stays in place.','Premium leather / nappa','{Black,Beige,Red,Grey,Brown,Blue}','7-10 days',180),
('BAZ Breathable Spring Seat Covers','أغطية مقاعد بنظام زنبرك','New spring (ressort) structure that lets air flow so your back does not sweat.','Spring mesh + fabric','{Black,Grey,Beige,Blue}','5-7 days',120),
('BAZ Truck & 4x4 Heavy-Duty Covers','أغطية للشاحنات والدفع الرباعي','Reinforced, easy-clean covers for trucks and 4x4.','Reinforced fabric','{Black,Grey,Khaki}','7-10 days',150);
