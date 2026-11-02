const explorer=document.querySelector('#context-explorer');
const select=document.querySelector('#context-indicator');
const comparison=document.querySelector('#context-comparison');
const node=(tag,className,text)=>{const el=document.createElement(tag);el.className=className;if(text)el.textContent=text;return el;};
try {
  const response=await fetch('./context-data.json');
  if(!response.ok)throw new Error('Données indisponibles');
  const data=await response.json();
  function render(){
    const metric=data.metrics.find(m=>m.id===select.value);
    const fmt=value=>new Intl.NumberFormat('fr-FR',{minimumFractionDigits:metric.decimals,maximumFractionDigits:metric.decimals}).format(value);
    comparison.replaceChildren();
    comparison.append(node('h3','',metric.title),node('p','context-chart-meta',`${metric.period.replace('-Q',' · T')} · ${metric.unit}`));
    const values=metric.observations.map(o=>o.value);
    const minimum=Math.min(0,...values),maximum=Math.max(0,...values),span=maximum-minimum||1;
    const chart=node('div','context-bars');
    for(const country of data.countries){
      const point=metric.observations.find(o=>o.country===country.id);
      const row=node('div','context-bar-row');
      row.append(node('span','context-country',country.name));
      const track=node('div','context-bar-track');track.setAttribute('aria-hidden','true');
      const zero=node('span','context-zero');zero.style.left=`${100*(-minimum)/span}%`;
      const bar=node('span','context-bar');bar.style.background=country.color;
      bar.style.left=`${100*(Math.min(0,point.value)-minimum)/span}%`;
      bar.style.width=`${100*Math.abs(point.value)/span}%`;track.append(zero,bar);
      row.append(track,node('strong','context-value',`${fmt(point.value)}${point.flag?' '+point.flag:''}`));chart.append(row);
    }
    comparison.append(chart,node('p','context-chart-definition',metric.definition),node('p','context-chart-reading',metric.reading));
    const link=node('a','text-link','Définition complète et sources →');link.href=`#definition-${metric.id}`;comparison.append(link);
  }
  select.addEventListener('change',render);render();explorer.hidden=false;
} catch {
  // All comparisons, definitions and sources remain available in the static tables.
  explorer.hidden=true;
}
