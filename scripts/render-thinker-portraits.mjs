import { thinkerPortraits,thinkerPortraitGroups } from '../public/thinker-portraits.js';
export function portraitGeometry(p){
  const ratio=(p.width/p.height)/(.8),zoom=p.zoom||1;
  const width=100*Math.max(1,ratio)*zoom,height=100*Math.max(1,1/ratio)*zoom;
  const [x,y]=p.focus;
  return {width,height,left:Math.max(100-width,Math.min(0,50-x*width)),top:Math.max(100-height,Math.min(0,35-y*height))};
}
export function renderThinkerPortraits(name,{e}){
  const people=thinkerPortraitGroups[name];
  if(!people?.length)throw new Error(`Portraits non renseignés pour ${name}`);
  return `<div class="thinker-portraits">${people.map(person=>{const p=thinkerPortraits[person];if(!p)throw new Error(`Portrait absent : ${person}`);const g=portraitGeometry(p);return `<figure><div class="thinker-photo-frame"><img class="thinker-photo" src="${p.src}" alt="Portrait de ${e(person)}" loading="lazy" decoding="async" width="160" height="200" style="width:${g.width.toFixed(4)}%;height:${g.height.toFixed(4)}%;left:${g.left.toFixed(4)}%;top:${g.top.toFixed(4)}%"></div><figcaption>${e(person)}<span>${e(p.kind)}</span></figcaption></figure>`;}).join('')}</div>`;
}
export function renderThinkerCredits(name,{e,external}){
  return `<details class="thinker-credits"><summary>Sources et crédits des portraits</summary><p>Noir et blanc et cadrage appliqués à l’affichage ; les fichiers sources sont conservés sans modification.</p><ul>${thinkerPortraitGroups[name].map(person=>{const p=thinkerPortraits[person];return `<li><strong>${e(person)}</strong> — ${e(p.credit)}. ${external(p.source,p.license)}${p.licenseUrl?' · '+external(p.licenseUrl,'Conditions de réutilisation'):''}.</li>`;}).join('')}</ul></details>`;
}
