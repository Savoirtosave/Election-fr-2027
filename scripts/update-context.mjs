// Rebuild from reviewed official snapshots; the site and build need no network access.
import { readFile,writeFile } from 'node:fs/promises';
import { observationNote } from '../public/context-format.js';
const root=new URL('../',import.meta.url);
const read=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const sources=await read('data/context/sources.json'),pisa=await read('data/context/pisa.json');
const specifications=await read('data/context/indicator-specs.json');
export function decodeEurostat(data){
  const categories=data.id.map(id=>Object.entries(data.dimension[id].category.index).sort((a,b)=>a[1]-b[1]).map(([code])=>code));
  return Object.entries(data.value).filter(([,v])=>v!==null).map(([index,value])=>{
    let flat=Number(index);const row={value,flag:data.status?.[index]||''};
    for(let i=data.id.length-1;i>=0;i--){row[data.id[i]]=categories[i][flat%data.size[i]];flat=Math.floor(flat/data.size[i]);}return row;
  });
}
const countries=[{id:'FR',name:'France',color:'#244de7'},{id:'DE',name:'Allemagne',color:'#7750a0'},{id:'ES',name:'Espagne',color:'#bf6728'},{id:'IT',name:'Italie',color:'#208365'},{id:'BE',name:'Belgique',color:'#b03d50'},{id:'DK',name:'Danemark',color:'#83712b'},{id:'NL',name:'Pays-Bas',color:'#228b9b'}];
const raw=Object.fromEntries(await Promise.all(Object.keys(sources).filter(id=>sources[id].dataset).map(async id=>[id,decodeEurostat(await read(`data/context/eurostat/${id}.json`))])));
function metric(spec){
  const selected=raw[spec.sourceId].filter(row=>Object.entries(spec.filters).every(([key,value])=>row[key]===value));
  const series=Object.fromEntries(countries.map(c=>[c.id,selected.filter(r=>r.geo===c.id).map(r=>({period:r.time,value:r.value/(spec.divisor||1),flag:r.flag})).sort((a,b)=>a.period.localeCompare(b.period))]));
  const observations=countries.map(c=>{
    const points=series[c.id].filter(r=>r.period===spec.period);
    if(spec.missing?.[c.id]){if(points.some(p=>p.value!==null))throw new Error(`Valeur inattendue pour un minimum non applicable : ${c.id}`);return {country:c.id,period:spec.period,value:null,flag:'',status:'not-applicable',reason:spec.missing[c.id]};}
    if(points.length!==1)throw new Error(`Observation ambiguë ou absente : ${spec.id}/${c.id}/${spec.period} (${points.length})`);
    return {country:c.id,...points[0]};
  });
  const {sourceId,filters,missing,divisor,...content}=spec;
  return {...content,decimals:spec.decimals??1,sourceIds:[sourceId],observations,series};
}
const metrics=specifications.map(metric);
const get=id=>metrics.find(m=>m.id===id),point=(id,c)=>get(id).observations.find(o=>o.country===c);
const mergeFlags=(...flags)=>[...new Set(flags.join(''))].join('');
const reduced=countries.map(c=>{const before=point('poverty-before',c.id),after=point('poverty',c.id);return {country:c.id,period:'2025',value:before.value-after.value,flag:mergeFlags(before.flag,after.flag),components:{before:before.value,after:after.value}};});
metrics.push({id:'transfer-gap',group:'inequality',title:'Écart de pauvreté avant / après transferts, hors pensions',period:'2025',unit:'points de pourcentage',decimals:1,definition:'Différence entre le taux de pauvreté avant transferts autres que pensions et le taux après transferts, au seuil de 60 % du revenu médian national. Les deux séries utilisent EU-SILC 2025, revenus généralement de 2024.',reading:'Écart comptable, sans interprétation causale : ce n’est pas la réduction totale des inégalités par tous les impôts et prestations. Les pensions sont conservées comme revenu dans la série avant transferts.',sourceIds:['poverty-before','poverty'],observations:reduced,series:{}});
function publicComponents(c,period){
 const find=code=>{const a=raw['public-oldage'].filter(r=>r.geo===c&&r.time===period&&r.cofog99===code);if(a.length!==1)throw new Error(`Donnée COFOG absente ${c}/${period}/${code}`);return a[0];};
 return {oldage:find('GF1002'),survivors:find('GF1003'),total:find('TOTAL')};
}
for(const share of[false,true]){
 const series=Object.fromEntries(countries.map(c=>[c.id,[...new Set(raw['public-oldage'].map(r=>r.time))].sort().map(period=>{const x=publicComponents(c.id,period),value=x.oldage.value+x.survivors.value;return {period,value:share?100*value/x.total.value:value,flag:mergeFlags(x.oldage.flag,x.survivors.flag,x.total.flag)};})]));
 metrics.push({id:share?'public-oldage-share':'public-oldage-gdp',group:'retirement',title:share?'Vieillesse et soutien aux proches après un décès dans les dépenses publiques':'Dépenses publiques de vieillesse et de soutien aux proches après un décès',period:'2024',unit:share?'% des dépenses publiques':'% du PIB',decimals:1,definition:'Somme des fonctions COFOG vieillesse (GF1002) et survivants (GF1003) des administrations publiques S13.'+(share?' Cette somme est rapportée à toutes leurs dépenses (TOTAL).':''),reading:'Ce périmètre budgétaire est plus large que les seules retraites de vieillesse et n’inclut pas tous les versements de pensions privées. Il ne faut pas l’assimiler au total ESSPROS ni au périmètre des projections de pensions du rapport européen.',sourceIds:['public-oldage'],observations:countries.map(c=>({country:c.id,...series[c.id].find(o=>o.period==='2024'),components:{oldage:publicComponents(c.id,'2024').oldage.value,survivors:publicComponents(c.id,'2024').survivors.value,total:publicComponents(c.id,'2024').total.value}})),series});
}
const shares=countries.map(c=>{
 const find=(item,sector)=>raw.corporations.find(r=>r.geo===c.id&&r.time==='2025'&&r.direct==='PAID'&&r.na_item===item&&r.sector===sector);
 const components=['S11','S12'].map(sector=>({sector,compensation:find('D1',sector).value,netValueAdded:find('B1N',sector).value}));
 const numerator=components.reduce((n,x)=>n+x.compensation,0),denominator=components.reduce((n,x)=>n+x.netValueAdded,0);
 return {country:c.id,period:'2025',value:100*numerator/denominator,flag:mergeFlags(...['S11','S12'].flatMap(s=>[find('D1',s).flag,find('B1N',s).flag])),numerator,denominator,components};
});
metrics.push({id:'labour-share',group:'sharing',title:'Rémunération des salariés / valeur ajoutée nette des sociétés',period:'2025',unit:'% de la valeur ajoutée nette',decimals:1,definition:'100 × rémunération D1 payée par S11 + S12 / leur valeur ajoutée nette B1N. S11 désigne les sociétés non financières, S12 les sociétés financières ; D1 inclut les cotisations patronales et B1N retranche l’usure économique du capital.',reading:'Ce ratio n’est ni la part des salaires nets dans le PIB ni une mesure du pouvoir d’achat. Les secteurs couverts et le caractère net de la valeur ajoutée sont essentiels.',sourceIds:['corporations','dor'],observations:shares,series:{}});
for(const[subject,label,average]of[['maths','Mathématiques',463],['reading','Compréhension de l’écrit',461],['science','Sciences',482]]){
 const observations=countries.map(c=>({country:c.id,period:'2025',value:pisa[c.id][subject],flag:''}));
 for(const p of observations)p.panelRank=1+observations.filter(o=>o.value>p.value).length;
 metrics.push({id:'pisa-'+subject,group:'education',title:'PISA · '+label,period:'2025',unit:'points PISA',decimals:0,oecdAverage:average,definition:'Score moyen des élèves de 15 ans, soumis à une incertitude statistique. Ce n’est ni un pourcentage de réussite ni un classement général du système éducatif.',reading:'Le rang porte uniquement sur les sept pays du comparatif. Le résultat belge est national, pas celui d’une seule communauté. Les scores 2022 sont reconstitués à partir des valeurs et variations arrondies publiées dans les profils 2025.',sourceIds:countries.map(c=>'pisa-'+c.id),observations,series:subject==='maths'?Object.fromEntries(countries.map(c=>[c.id,[{period:'2022',value:pisa[c.id].maths2022,flag:''},{period:'2025',value:pisa[c.id].maths,flag:''}]])):{}});
}
const projection=await read('data/context/pension-projections.json');
for(const horizon of[2045,2070]){
 const series=Object.fromEntries(countries.map(c=>[c.id,projection.horizons.map((year,i)=>({period:String(year),value:projection.values[c.id][i],flag:'',note:year>projection.baseYear?'Projection du scénario de référence publié en 2024':'Année de base du scénario 2024'}))]));
 metrics.push({id:'pension-projection-'+horizon,group:'retirement',title:'Pensions publiques en '+horizon+' · scénario 2024',period:String(horizon),unit:'% du PIB',decimals:1,isProjection:true,projectionPublished:2024,definition:'Dépenses publiques brutes de pensions selon le scénario de référence du 2024 Ageing Report, base 2022, tableau I.1.6. Hypothèses démographiques, économiques et législation retenues pour ce rapport.',reading:'Projection conditionnelle, pas prévision actualisée de 2026. Les réformes ultérieures ne sont pas automatiquement intégrées. Le périmètre diffère de COFOG vieillesse/soutien aux proches après un décès et des pensions publiques et privées ESSPROS.',sourceIds:['ageing-report'],observations:countries.map(c=>({country:c.id,...series[c.id].find(o=>o.period===String(horizon))})),series});
}
const result={asOf:'2026-11-02',countries,sources,metrics,franceNotes:{unemployment:{value:8.3,period:'2026-Q2',sourceId:'insee-unemployment'},activity:{value:75.4,period:'2026-Q2',sourceId:'insee-unemployment'}}};
const quote=v=>'"'+String(v).replaceAll('"','""')+'"';
const rows=[['Indicateur','Période','Pays','Valeur','Unité','Note','Sources'],...metrics.flatMap(m=>m.observations.map(o=>[m.title,m.period,countries.find(c=>c.id===o.country).name,o.value===null?'':String(o.value).replace('.',','),m.unit,observationNote(o),m.sourceIds.map(id=>sources[id].url).join(' | ')]))];
const csv='\uFEFF'+rows.map(row=>row.map(quote).join(';')).join('\n')+'\n';
for(const[file,content]of[['public/context-data.json',JSON.stringify(result,null,2)+'\n'],['public/contexte.csv',csv]]){
 if(process.argv.includes('--check')){if(await readFile(new URL(file,root),'utf8')!==content)throw new Error(`Données à régénérer : ${file}`);}else await writeFile(new URL(file,root),content);
}
console.log(`${metrics.length} indicateurs de contexte ${process.argv.includes('--check')?'vérifiés':'recalculés'} pour ${countries.length} pays depuis les sources archivées.`);
