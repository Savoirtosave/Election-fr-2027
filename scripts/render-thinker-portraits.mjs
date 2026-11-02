import { thinkerPortraits,thinkerPortraitGroups } from '../public/thinker-portraits.js';
export function renderThinkerPortraits(name,{e}){
  const people=thinkerPortraitGroups[name];
  if(!people?.length)throw new Error(`Portraits non renseignés pour ${name}`);
  return `<div class="thinker-portraits">${people.map(person=>{const p=thinkerPortraits[person];if(!p)throw new Error(`Portrait absent : ${person}`);return `<figure><div class="thinker-photo-frame"><img class="thinker-photo" src="${p.src}" alt="Portrait de ${e(person)}" loading="lazy" decoding="async" width="160" height="200" style="--portrait-position:${p.position};--portrait-zoom:${p.zoom||1}"></div><figcaption>${e(person)}<span>${e(p.kind)}</span></figcaption></figure>`;}).join('')}</div>`;
}
export function renderThinkerCredits(name,{e,external}){
  return `<details class="thinker-credits"><summary>Sources et crédits des portraits</summary><p>Noir et blanc et cadrage appliqués à l’affichage ; les fichiers sources sont conservés sans modification.</p><ul>${thinkerPortraitGroups[name].map(person=>{const p=thinkerPortraits[person];return `<li><strong>${e(person)}</strong> — ${e(p.credit)}. ${external(p.source,p.license)}${p.licenseUrl?' · '+external(p.licenseUrl,'Conditions de réutilisation'):''}.</li>`;}).join('')}</ul></details>`;
}
