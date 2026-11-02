import { partyTopics } from '../public/parties.js';

export const draftNotice = 'Ébauche évolutive : les programmes présidentiels complets pour 2027 ne sont pas tous disponibles. Cette page rassemble les orientations et propositions déjà documentées ; elle sera étoffée et vérifiée à mesure des publications de campagne, avec leurs sources, leur date et leur chiffrage lorsqu’il existe.';

export function renderIssues(party, { e, sourcePrefix = '', internationalCard = null, omitInternational = false }) {
  const documented = Object.keys(partyTopics).filter(key=>key!=='international' && party.issues[key]?.status!=='pending').map(key=>[key,party.issues[key]]);
  const pending = Object.entries(party.issues).filter(([key, issue]) => key !== 'international' && issue.status === 'pending');
  const gateway = `<article class="policy-card international-gateway" id="position-international"><p class="policy-topic">${e(partyTopics.international)}</p><h3>OTAN, Ukraine, Russie, Chine, Israël / Palestine</h3><p>Une grille dédiée distingue les positions publiées des dossiers encore à documenter.</p><a class="text-link" href="${sourcePrefix}#international">Lire l’encart international →</a></article>`;
  return `<div class="policy-grid">${documented.map(([key, issue]) => `<article class="policy-card" id="position-${key}"><p class="policy-topic">${e(partyTopics[key])}</p><h3>${e(issue.summary)}</h3><details><summary>Détails et sources</summary><p>${e(issue.text)}</p><p class="source-line">${issue.sourceIds.map(id => `<a href="${sourcePrefix}#source-${id}">${e(party.sources.find(s => s.id === id).title)}</a>`).join(' · ')}</p></details></article>`).join('')}${omitInternational?'':internationalCard ?? gateway}</div>${pending.length ? `<aside class="pending-topics"><h3>Sujets restant à documenter</h3><p>${pending.map(([key]) => e(partyTopics[key])).join(' · ')}</p><p>Les textes retenus ne permettent pas encore de résumer ces positions avec assez de précision. Cela ne signifie pas que le parti n’a aucune position sur ces sujets.</p></aside>` : ''}`;
}

export function candidatePreview(c, { e }) {
  return `<article class="candidate-preview"><a class="candidate-preview-portrait${c.photo.panel ? ' portrait-panel-'+c.photo.panel : ''}" href="./candidat-${c.id}.html"><img src="${c.photo.src}" alt="Portrait de ${e(c.name)}" loading="lazy" width="80" height="80"${c.photo.position ? ` style="object-position:${e(c.photo.position)}"` : ''}></a><div><p class="party-kicker">${e(c.party)}</p><h3><a href="./candidat-${c.id}.html">${e(c.name)}</a></h3><p>${e(c.biography.split('. ')[0])}.</p><a class="text-link" href="./candidat-${c.id}.html">Profil et programme · ébauche →</a></div></article>`;
}

export function renderOutsideCandidates(candidates, ctx) {
  const independent = candidates.filter(c => c.affiliationKind === 'independent');
  const others = candidates.filter(c => c.affiliationKind === 'movement' || c.affiliationKind === 'support');
  return `<section class="section" id="sans-parti"><p class="eyebrow">EN DEHORS DES PARTIS DE L’ANNUAIRE</p><h2>Les candidats sans parti</h2><p class="section-intro">Candidats sans étiquette ou sans affiliation partisane actuelle établie par les sources retenues. Une ancienne appartenance n’est pas présentée comme une adhésion actuelle.</p><div class="candidate-preview-grid">${independent.map(c => candidatePreview(c, ctx)).join('')}</div><h2 class="outside-heading">D’autres mouvements et soutiens</h2><p class="section-intro">Ces candidatures ont un mouvement ou un soutien identifié, qui ne dispose pas encore d’un dossier dans l’annuaire ci-dessus. Elles ne sont pas assimilées aux candidatures sans parti.</p><div class="candidate-preview-grid">${others.map(c => candidatePreview(c, ctx)).join('')}</div></section>`;
}
