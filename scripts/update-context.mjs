// Rebuild the published figures from the official snapshots committed in data/context.
// To refresh: retrieve the source API URLs, review dates/units/flags, replace snapshots,
// then run this script, npm run build and npm test. No network access during the build.
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = async p => JSON.parse(await readFile(new URL(p,root),'utf8'));
const sources = await read('data/context/sources.json');
const pisa = await read('data/context/pisa.json');
export function decodeEurostat(data) {
  const categories = data.id.map(id => Object.entries(data.dimension[id].category.index).sort((a,b)=>a[1]-b[1]).map(([code])=>code));
  return Object.entries(data.value).filter(([,value])=>value!==null).map(([index,value])=>{
    let flat = Number(index); const row = {value,flag:data.status?.[index] || ''};
    for(let i=data.id.length-1;i>=0;i--){row[data.id[i]]=categories[i][flat % data.size[i]];flat=Math.floor(flat/data.size[i]);}
    return row;
  });
}
const countries = [{id:'FR',name:'France',color:'#244de7'},{id:'DE',name:'Allemagne',color:'#7750a0'},{id:'ES',name:'Espagne',color:'#bf6728'},{id:'IT',name:'Italie',color:'#208365'}];
const raw = Object.fromEntries(await Promise.all(Object.keys(sources).filter(id=>sources[id].dataset).map(async id=>[id,decodeEurostat(await read(`data/context/eurostat/${id}.json`))])));
const specs = [
 ['debt','finances','Dette publique','2026-Q2','% du PIB','debt-quarterly',{unit:'PC_GDP'},'Stock de dette brute consolidée des administrations publiques au sens de Maastricht. Le ratio trimestriel rapporte ce stock au PIB des quatre derniers trimestres.','La France est plus endettée que l’Allemagne et l’Espagne dans ce panel, mais moins que l’Italie. Le ratio dépend aussi du niveau du PIB.'],
 ['debt-amount','finances','Dette publique en euros','2026-Q2','Md€','debt-quarterly',{unit:'MIO_EUR'},'Même dette publique, exprimée en milliards d’euros courants (millions Eurostat divisés par 1 000).','Un montant absolu dépend de la taille de l’économie ; le ratio au PIB est plus pertinent pour comparer les pays.',1000],
 ['debt-annual','finances','Dette publique annuelle','2025','% du PIB','public-finance',{na_item:'GD'},'Dette brute consolidée en fin d’année. Série annuelle permettant de suivre l’évolution depuis 2015.','Dette et déficit ne sont pas interchangeables : la dette est un stock, le déficit un flux annuel.'],
 ['balance','finances','Solde public','2025','% du PIB','public-finance',{na_item:'B9'},'Recettes moins dépenses de l’ensemble des administrations publiques. Un chiffre négatif indique un déficit.','Le déficit français atteint 5,1 % du PIB en 2025. Il comprend les intérêts ; il n’explique pas à lui seul toute la variation du stock de dette.'],
 ['interest','finances','Intérêts de la dette publique','2025','% du PIB','interest',{na_item:'D41PAY'},'Intérêts payés par l’ensemble des administrations publiques en comptabilité nationale (D41). Hors remboursement du principal.','Le coût dépend des taux, de l’inflation, des maturités et du refinancement. Ce périmètre dépasse le seul budget de l’État.'],
 ['interest-amount','finances','Intérêts en euros','2025','Md€','interest-eur',{},'Intérêts de toutes les administrations publiques, en milliards d’euros courants.','À comparer au PIB et aux recettes : le montant ne mesure ni le principal à rembourser ni les seules émissions de l’année.',1000],
 ['levies','finances','Impôts et cotisations sociales','2025','% du PIB','levies',{},'Recettes fiscales et cotisations sociales nettes, y compris cotisations sociales imputées, déduction faite des montants non recouvrables.','Ce périmètre Eurostat n’est pas strictement celui des « prélèvements obligatoires » de l’Insee ni celui de toutes les séries OCDE. Il ne mesure pas le taux d’impôt d’un ménage.'],
 ['growth','economy','Croissance annuelle du PIB réel','2025','%','gdp',{},'Variation annuelle du PIB en volume, corrigée de l’effet des prix.','L’Espagne croît plus vite dans ce panel en 2025. Une croissance du PIB n’est pas une mesure complète du niveau de vie ni du PIB par habitant.'],
 ['growth-quarterly','economy','Croissance trimestrielle du PIB réel','2026-Q3','%','gdp-quarterly',{},'Variation par rapport au trimestre précédent, en volume, corrigée des variations saisonnières et calendaires.','La première estimation française indique −0,1 % au troisième trimestre 2026. Ce taux trimestriel ne doit pas être confondu avec une croissance annuelle.'],
 ['unemployment','work','Taux de chômage','2026-09','% des actifs','unemployment',{age:'TOTAL'},'Personnes de 15 à 74 ans sans emploi, disponibles et en recherche active, en proportion de la population active. Série harmonisée, corrigée des variations saisonnières.','L’Italie a un chômage plus faible que la France, mais aussi un taux d’activité nettement plus bas : il faut lire les deux indicateurs ensemble.'],
 ['youth-unemployment','work','Chômage des moins de 25 ans','2026-09','% des actifs de 15–24 ans','unemployment',{age:'Y_LT25'},'Chômeurs de 15 à 24 ans rapportés aux jeunes actifs, et non à tous les jeunes. Les étudiants sans emploi qui ne cherchent pas de travail ne sont pas au dénominateur.','Un taux de 21,9 % ne signifie pas que 21,9 % de tous les jeunes Français sont au chômage.'],
 ['activity','work','Taux d’activité des 15–64 ans','2025','% de la population de 15–64 ans','activity',{},'Personnes en emploi ou au chômage, rapportées à toute la population de 15 à 64 ans. Moyenne annuelle ; les inactifs ne sont ni en emploi ni au chômage.','Un faible chômage peut coexister avec une faible participation au marché du travail. Le taux d’activité n’est pas le taux d’emploi.'],
 ['ageing','population','Population de 65 ans ou plus','2025','% de la population','ageing',{},'Part des résidents âgés de 65 ans ou plus au 1er janvier de l’année.','Le vieillissement touche les quatre pays, davantage l’Italie dans ce panel. Son effet sur les retraites et les soins dépend aussi de l’emploi, de la productivité et des règles collectives.']
];
const metrics = specs.map(([id,group,title,period,unit,sourceId,filter,definition,reading,divisor=1])=>{
  const selected=raw[sourceId].filter(row=>Object.entries(filter).every(([key,value])=>row[key]===value));
  const series=Object.fromEntries(countries.map(c=>[c.id,selected.filter(row=>row.geo===c.id).map(row=>({period:row.time,value:row.value/divisor,flag:row.flag})).sort((a,b)=>a.period.localeCompare(b.period))]));
  const observations=countries.map(c=>{const point=series[c.id].find(row=>row.period===period);if(!point)throw new Error(`Observation absente : ${id}/${c.id}/${period}`);return {country:c.id,...point};});
  return {id,group,title,period,unit,decimals:1,definition,reading,sourceIds:[sourceId],observations,series};
});
const shares = countries.map(c=>{
  const find=(item,sector)=>raw.corporations.find(row=>row.geo===c.id&&row.time==='2025'&&row.direct==='PAID'&&row.na_item===item&&row.sector===sector);
  const components=['S11','S12'].map(sector=>({sector,compensation:find('D1',sector).value,netValueAdded:find('B1N',sector).value}));
  const numerator=components.reduce((n,x)=>n+x.compensation,0),denominator=components.reduce((n,x)=>n+x.netValueAdded,0);
  return {country:c.id,period:'2025',value:100*numerator/denominator,flag:raw.corporations.some(row=>row.geo===c.id&&row.time==='2025'&&row.flag.includes('p'))?'p':'',numerator,denominator,components};
});
metrics.push({id:'labour-share',group:'sharing',title:'Rémunération des salariés / valeur ajoutée nette des sociétés',period:'2025',unit:'% de la valeur ajoutée nette',decimals:1,definition:'Calcul : 100 × (D1 payé par S11 + D1 payé par S12) / (B1N de S11 + B1N de S12). S11 désigne les sociétés non financières et S12 les sociétés financières. D1 inclut salaires et cotisations sociales patronales ; B1N exclut la consommation de capital fixe.',reading:'La France est en tête des quatre pays comparés sur ce ratio, autour de 81,6 %, comme dans la capture. Ce calcul ne suffit pas à établir son rang dans toute l’UE ; il ne représente ni la part des salaires nets dans le PIB ni le pouvoir d’achat.',sourceIds:['corporations','dor'],observations:shares,series:{}});
for(const [subject,label,average] of [['maths','Mathématiques',463],['reading','Compréhension de l’écrit',461],['science','Sciences',482]]){
 const observations=countries.map(c=>({country:c.id,period:'2025',value:pisa[c.id][subject],flag:''}));
 const sorted=[...observations].sort((a,b)=>b.value-a.value);
 for(const point of observations)point.panelRank=1+sorted.filter(p=>p.value>point.value).length;
 metrics.push({id:'pisa-'+subject,group:'education',title:'PISA · '+label,period:'2025',unit:'points PISA',decimals:0,oecdAverage:average,definition:'Score moyen des élèves de 15 ans dans le domaine évalué. Ce ne sont ni des pourcentages de réussite ni un classement global du système éducatif.',reading:'Les petits écarts doivent être lus avec l’incertitude d’échantillonnage. Le rang affiché est calculé parmi les quatre pays de ce comparatif, pas parmi tous les participants à PISA.',sourceIds:countries.map(c=>'pisa-'+c.id),observations,series:subject==='maths'?Object.fromEntries(countries.map(c=>[c.id,[{period:'2022',value:pisa[c.id].maths2022,flag:''},{period:'2025',value:pisa[c.id].maths,flag:''}]])):{}});
}
const result={asOf:'2026-11-02',countries,sources,metrics,franceNotes:{unemployment:{value:8.3,period:'2026-Q2',sourceId:'insee-unemployment'},activity:{value:75.4,period:'2026-Q2',sourceId:'insee-unemployment'}}};
const output=JSON.stringify(result,null,2)+'\n';
const quote=value=>'"'+String(value).replaceAll('"','""')+'"';
const rows=[['Indicateur','Période','Pays','Valeur','Unité','Drapeau','Sources'],...metrics.flatMap(m=>m.observations.map(o=>[m.title,m.period,countries.find(c=>c.id===o.country).name,String(o.value).replace('.',','),m.unit,o.flag,m.sourceIds.map(id=>sources[id].url).join(' | ')]))];
const csv='\uFEFF'+rows.map(row=>row.map(quote).join(';')).join('\n')+'\n';
for(const [file,content] of [['public/context-data.json',output],['public/contexte.csv',csv]]){
  if(process.argv.includes('--check')){if(await readFile(new URL(file,root),'utf8')!==content)throw new Error(`Données à régénérer : ${file}`);}
  else await writeFile(new URL(file,root),content);
}
console.log(`${metrics.length} indicateurs de contexte ${process.argv.includes('--check')?'vérifiés':'recalculés'} depuis les sources archivées.`);
