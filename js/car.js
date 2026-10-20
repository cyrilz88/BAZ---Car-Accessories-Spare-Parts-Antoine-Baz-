import { lang, pick } from './core.js';
import { tr } from './ui.js';
const LBL = { fluids:['Fluids & maintenance','سوائل وصيانة'], electrical:['Lights & electrical','إضاءة وكهرباء'], exterior:['Exterior & wheels','خارجي وجنوط'], interior:['Interior & comfort','داخلي وراحة'], electronics:['Screens & sensors','شاشات وحساسات'], spare:['Spare parts','قطع غيار'] };
const BASE = [ { slug:'fluids', p:[1.55,1.02,0], n:[0,1,0] }, { slug:'electrical', p:[2.4,.8,.62], n:[1,0,.4] }, { slug:'exterior', p:[1.45,.38,1.05], n:[0,0,1] },
  { slug:'interior', p:[-.1,1.3,.82], n:[0,0,1] }, { slug:'electronics', p:[.72,1.3,0], n:[.7,.6,0] }, { slug:'spare', p:[-2.4,.62,0], n:[-1,0,0] },
  { href:'#/seatcovers', p:[-.75,1.3,-.82], n:[0,0,-1], label:['Custom seat covers','أغطية مقاعد بالطلب'] } ];
export const spots = cats => BASE.map(h => { const c = (cats||[]).find(k => k.slug === h.slug);
  return { ...h, href: h.href || `#/products?cat=${h.slug}`, label: c ? pick(c,'name') : tr(...(h.label || LBL[h.slug])) }; });

export async function mountCar(box, list){
  const THREE = await import('three'), { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const cv = renderer.domElement; box.innerHTML = ''; box.append(cv);
  const scene = new THREE.Scene(); scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
  const cam = new THREE.PerspectiveCamera(32, 1, .1, 60), key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(4, 6, 5); scene.add(key);
  const paint = new THREE.MeshPhysicalMaterial({ color:0xdfe3ea, metalness:.7, roughness:.28, clearcoat:1, clearcoatRoughness:.08 });
  const glass = new THREE.MeshPhysicalMaterial({ color:0x0a111c, metalness:.9, roughness:.06 }), dark = new THREE.MeshStandardMaterial({ color:0x101318, roughness:.7 });
  const tireM = new THREE.MeshStandardMaterial({ color:0x15171b, roughness:.9 }), rimM = new THREE.MeshStandardMaterial({ color:0xd3d7de, metalness:1, roughness:.25 });
  const lamp = new THREE.MeshStandardMaterial({ color:0xffffff, emissive:0xffffff, emissiveIntensity:1.3 }), tail = new THREE.MeshStandardMaterial({ color:0xff2a2a, emissive:0xff1010, emissiveIntensity:1.1 });
  const car = new THREE.Group(); scene.add(car);
  const ext = (shape, depth, bev, mat) => { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled:true, bevelThickness:bev, bevelSize:bev, bevelSegments:4, curveSegments:18 }); g.translate(0, 0, -depth / 2); return new THREE.Mesh(g, mat); };
  const body = new THREE.Shape(); body.moveTo(-2.3,.32); body.lineTo(2.3,.32); body.lineTo(2.36,.55); body.quadraticCurveTo(2.4,.78,2.2,.84); body.quadraticCurveTo(1.6,.95,.95,1); body.lineTo(-1.45,1); body.quadraticCurveTo(-2.15,1,-2.34,.9); body.lineTo(-2.36,.55); body.closePath();
  car.add(ext(body, 1.64, .1, paint));
  const cab = new THREE.Shape(); cab.moveTo(.95,1.02); cab.quadraticCurveTo(.5,1.42,.25,1.5); cab.lineTo(-.85,1.5); cab.quadraticCurveTo(-1.2,1.35,-1.5,1.02); cab.closePath();
  car.add(ext(cab, 1.34, .05, glass));
  const box3 = (w,h,d,m,x,y,z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), m); b.position.set(x,y,z); car.add(b); return b; };
  box3(1.2,.05,1.46,paint,-.3,1.56,0); box3(4.5,.12,1.7,dark,0,.3,0); box3(.06,.2,.74,dark,2.42,.62,0); box3(.06,.1,.9,dark,2.4,.42,0);
  for (const s of [1,-1]) { box3(.14,.12,.42,lamp,2.38,.8,s*.62); box3(.08,.12,.44,tail,-2.4,.8,s*.62); box3(.1,.08,.18,paint,.85,1.06,s*.98);
    box3(.07,.5,.07,paint,-.3,1.25,s*.72); for (const x of [.62,-1.1]) box3(.012,.56,.012,dark,x,.68,s*.93);
    const arch = (x) => { const a = new THREE.Mesh(new THREE.CircleGeometry(.5,32), new THREE.MeshBasicMaterial({ color:0x07090c })); a.position.set(x,.38,s*.935); if (s < 0) a.rotation.y = Math.PI; car.add(a); }; arch(1.45); arch(-1.45); }
  for (const x of [1.45,-1.45]) for (const s of [1,-1]) { const w = new THREE.Group(), t = new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.28,36), tireM), r = new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,.3,28), rimM);
    t.rotation.x = r.rotation.x = Math.PI / 2; w.add(t, r);
    for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(.05,.5,.04), rimM); sp.rotation.z = i * Math.PI * 2 / 5; sp.position.z = s * .16; w.add(sp); }
    w.position.set(x,.38,s*.88); car.add(w); }
  const sc = document.createElement('canvas'); sc.width = sc.height = 256; const g2 = sc.getContext('2d'), gr = g2.createRadialGradient(128,128,10,128,128,128); gr.addColorStop(0,'rgba(0,0,0,.65)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g2.fillStyle = gr; g2.fillRect(0,0,256,256);
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(8,5), new THREE.MeshBasicMaterial({ map:new THREE.CanvasTexture(sc), transparent:true, depthWrite:false })); sh.rotation.x = -Math.PI / 2; sh.position.y = .01; scene.add(sh);
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.4,3.46,96), new THREE.MeshBasicMaterial({ color:0x4b7ff2, transparent:true, opacity:.55 })); ring.rotation.x = -Math.PI / 2; ring.position.y = .02; scene.add(ring);
  const els = list.map(s => { const a = document.createElement('a'); a.className = 'hs'; a.href = s.href; a.setAttribute('aria-label', s.label); a.innerHTML = `<em>${s.label.replace(/[<>&]/g,'')}</em>`; box.append(a); return a; });
  const hint = document.createElement('p'); hint.className = 'hint'; hint.textContent = tr('Drag to rotate · tap a dot to shop','اسحب للتدوير · اضغط على نقطة للتسوق'); box.append(hint);
  let yaw = -.55, vel = 0, drag = false, lx = 0, last = performance.now(); const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  cv.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; last = performance.now(); cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { if (!drag) return; vel = (e.clientX - lx) * .008; yaw += vel; lx = e.clientX; last = performance.now(); });
  const up = () => { drag = false; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  const size = () => { const w = box.clientWidth || 600, h = box.clientHeight || 480; renderer.setSize(w, h); cam.aspect = w / h; const d = 9.6 / Math.min(1, cam.aspect / 1.25); cam.position.set(0, d * .27, d); cam.lookAt(0, .7, 0); cam.updateProjectionMatrix(); };
  new ResizeObserver(size).observe(box); size();
  const v = new THREE.Vector3(), n = new THREE.Vector3(), c = new THREE.Vector3();
  (function frame(){
    if (!box.isConnected) { renderer.dispose(); return; }
    if (!drag) { if (performance.now() - last > 2500 && !calm) yaw += .004; else { yaw += vel; vel *= .94; } }
    car.rotation.y = yaw; car.updateMatrixWorld(); renderer.render(scene, cam);
    const w = box.clientWidth, h = box.clientHeight;
    list.forEach((s, i) => { v.set(...s.p).applyMatrix4(car.matrixWorld); n.set(...s.n).normalize().applyQuaternion(car.quaternion); c.copy(cam.position).sub(v).normalize();
      const p = v.clone().project(cam); els[i].style.transform = `translate(${(p.x * .5 + .5) * w}px,${(-p.y * .5 + .5) * h}px) translate(-50%,-50%)`; els[i].classList.toggle('off', n.dot(c) < .12); });
    requestAnimationFrame(frame);
  })();
}
