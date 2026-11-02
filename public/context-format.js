export function observationNote(point){
  const notes=[];
  for(const [code,text]of[['p','Donnée provisoire'],['e','Valeur estimée'],['b','Rupture de série'],['d','Différence de définition signalée par Eurostat : consulter les métadonnées de la série']])if(point.flag?.includes(code))notes.push(text);
  if(point.reason)notes.push(point.reason);
  if(point.note)notes.push(point.note);
  return notes.join(' ; ');
}
export function formatValue(point,metric){
  return point.value===null?'—':new Intl.NumberFormat('fr-FR',{minimumFractionDigits:metric.decimals,maximumFractionDigits:metric.decimals}).format(point.value);
}
