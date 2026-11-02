import { indicatorHelp } from './context-help.js';
import { observationNote,formatValue } from './context-format.js';
const explorer=document.querySelector('#context-explorer'),select=document.querySelector('#context-indicator'),comparison=document.querySelector('#context-comparison');
const node=(tag,className,text)=>{const el=document.createElement(tag);el.className=className;if(text)el.textContent=text;return el;};
try {
 const response=await fetch('./context-data.json');if(!response.ok)throw new Error('Données indisponibles');const data=await response.json();
 function render(){
  const metric=data.metrics.find(m=>m.id===select.value);comparison.replaceChildren();
  const title=node('div','context-indicator-title'),help=node('details','indicator-help'),summary=node('summary','');summary.setAttribute('aria-label',`Comprendre : ${metric.title}`);const mark=node('span','','?');mark.setAttribute('aria-hidden','true');summary.append(mark);const content=node('div','indicator-help-content'),[meaning,method]=indicatorHelp[metric.id];content.append(node('p','',meaning),node('p','',method));const more=node('a','','Définition complète et sources →');more.href=`#definition-${metric.id}`;content.append(more);help.append(summary,content);title.append(node('h3','',metric.title),help);
  comparison.append(title,node('p','context-chart-meta',`${metric.period.replace('-Q',' · T')} · ${metric.unit}`));
  const values=metric.observations.filter(o=>o.value!==null).map(o=>o.value),minimum=Math.min(0,...values),maximum=Math.max(0,...values),span=maximum-minimum||1,chart=node('div','context-bars'),notes=[];
  for(const country of data.countries){
   const point=metric.observations.find(o=>o.country===country.id),note=observationNote(point),row=node('div','context-bar-row');row.append(node('span','context-country',country.name));
   const track=node('div','context-bar-track');track.setAttribute('aria-hidden','true');
   if(point.value!==null){const zero=node('span','context-zero');zero.style.left=`${100*(-minimum)/span}%`;const bar=node('span','context-bar');bar.style.background=country.color;bar.style.left=`${100*(Math.min(0,point.value)-minimum)/span}%`;bar.style.width=`${100*Math.abs(point.value)/span}%`;track.append(zero,bar);}
   const value=node('strong','context-value',formatValue(point,metric));if(note){const sup=node('sup',''),link=node('a','','*');link.href='#context-comparison-notes';link.setAttribute('aria-label','Lire la précision');sup.append(link);value.append(sup);notes.push(`${country.name} : ${note}.`);}row.append(track,value);chart.append(row);
  }
  comparison.append(chart);if(notes.length){const box=node('aside','context-footnotes');box.id='context-comparison-notes';box.append(node('strong','','* Précisions sur les données'));const ul=node('ul','');notes.forEach(n=>ul.append(node('li','',n)));box.append(ul);comparison.append(box);}
  comparison.append(node('p','context-chart-definition',metric.definition),node('p','context-chart-reading',metric.reading));const link=node('a','text-link','Définition complète et sources →');link.href=`#definition-${metric.id}`;comparison.append(link);
 }
 select.addEventListener('change',render);render();explorer.hidden=false;
}catch{explorer.hidden=true;}

// Les aides restent des éléments natifs, utilisables même sans le comparateur.
document.addEventListener('keydown',event=>{
 if(event.key!=='Escape')return;
 const help=event.target.closest('.indicator-help[open]');
 if(help){help.open=false;help.querySelector('summary').focus();}
});
document.addEventListener('click',event=>{
 const link=event.target.closest('.indicator-help a[href^="#definition-"]');
 if(link){const target=document.getElementById(link.hash.slice(1));if(target)target.open=true;}
});
