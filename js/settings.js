import { sb, lang, esc } from './core.js';
let P;
export const settings = () => P ||= sb.from('settings').select('*').then(r => Object.fromEntries((r.data || []).map(x => [x.key, x.value])));
export const L = (s, k, def = '') => (lang === 'ar' ? s[k + '_ar'] : s[k + '_en']) || def;      // language-aware value, else default
export const rows = (s, k, def) => (L(s, k) || def).split('\n').map(l => l.split('|').map(x => x.trim())).filter(r => r[0]);
export const tel = p => '+961' + String(p).replace(/\D/g, '').replace(/^0/, '');
export const paras = t => t.split(/\n\s*\n/).map(x => `<p>${esc(x)}</p>`).join('');
