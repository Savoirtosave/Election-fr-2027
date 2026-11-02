import { academicReferences } from '../public/references.js';
export function bibliographyScope({compact=false}={}){
  const count=Object.keys(academicReferences).length;
  return `<aside class="bibliography-scope${compact?' is-compact':''}" aria-label="Une bibliographie plus large que trois auteurs"><p class="eyebrow">UNE BIBLIOGRAPHIE PLURIELLE · ${count} RÉFÉRENCES</p><h2>Rémond, Nemo, Julliard, et beaucoup d’autres...</h2><p>De nombreux autres ouvrages et travaux sont également consultés : histoire politique, philosophie, recherches sur les partis et enquêtes comparatives. Les trois auteurs mis en avant ne résument pas les sources du site.</p>${compact?'':'<p class="bibliography-examples">Zeev Sternhell · Sheri Berman · Cas Mudde · Andrew Dobson · Bernard Manin · Carole Pateman · Michael Freeden…</p>'}<a href="./sources.html#bibliographie">Explorer les ${count} références et leurs apports <span aria-hidden="true">→</span></a></aside>`;
}
