import { readFile, writeFile } from 'node:fs/promises';
import { families } from '../public/families.js';
import { academicReferences, institutionalReferences } from '../public/references.js';
import { parties } from '../public/parties.js';
import { renderPartyPages } from './render-parties.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const e = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const arrow = '<svg class="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const external = (url, text) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(text)} ${arrow}</a>`;
const pages = new Map();
const navigation = [['candidats.html', 'Candidats'], ['partis.html', 'Partis'], ['familles.html', 'Familles politiques'], ['election.html', 'L’élection'], ['sources.html', 'Sources']];

function layout(file, title, description, content, active = file, script = '') {
  const links = navigation.map(([href, label]) => `<a href="./${href}"${active === href ? ` aria-current="${file === href ? 'page' : 'location'}"` : ''}>${label}</a>`).join('');
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${e(description)}"><meta name="theme-color" content="#142b54">
  <title>${e(title)} — Repères 2027</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23142b54'/%3E%3Cpath d='M9 23V9h8a5 5 0 0 1 0 10h-8m8 0 6 5' stroke='white' fill='none' stroke-width='3'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="./style.css">${script ? `<script src="./${script}" type="module"></script>` : ''}
</head>
<body>
  <a class="skip" href="#contenu">Aller au contenu</a>
  <header><a class="brand" href="./index.html" aria-label="Repères 2027, accueil"${file === 'index.html' ? ' aria-current="page"' : ''}><span class="brand-icon" aria-hidden="true"><i></i><i></i><i></i></span><span>repères<span class="year">2027</span></span></a><nav aria-label="Navigation principale">${links}</nav><a class="header-action" href="./election.html">Comprendre le vote ${arrow}</a></header>
  <main id="contenu">${content}</main>
  <footer><a class="brand" href="./index.html">repères<span class="year">2027</span></a><p>Projet indépendant, sans affiliation à un candidat ou à un parti.<br>Suivi des candidatures non exhaustif · Classements éditoriaux expliqués.</p><a href="./sources.html">Méthode & sources ${arrow}</a></footer>
</body></html>
`;
}
const intro = (eyebrow, title, text, extra = '') => `<section class="page-intro"><p class="eyebrow">${e(eyebrow)}</p><h1>${e(title)}</h1><p>${e(text)}</p>${extra}</section>`;
const referenceLinks = ids => `<ul class="reading-list">${ids.map(id => {
  const ref = academicReferences[id];
  if (!ref) throw new Error(`Référence inconnue : ${id}`);
  return `<li><a href="./sources.html#ref-${id}">${e(ref.authors)} (${e(ref.year)}), <cite>${e(ref.title)}</cite></a></li>`;
}).join('')}</ul>`;

let home = await read('site/home.html');
// Add an explicit route to the election explainer alongside the existing three routes.
const quickEnd = home.indexOf('</section>', home.indexOf('class="quick-links"'));
if (quickEnd < 0) throw new Error('Navigation d’accueil introuvable');
home = home.slice(0, quickEnd) + `<a href="./election.html"><span class="quick-icon mint" aria-hidden="true">04</span><span><strong>Comment se déroule le vote ?</strong><small>Parrainages, deux tours, résultats</small></span>${arrow}</a>` + home.slice(quickEnd);
pages.set('index.html', layout('index.html', 'Comprendre avant de choisir', 'Candidatures, familles politiques et règles de l’élection présidentielle française : des repères indépendants et sourcés.', home, 'index.html', 'navigation.js'));
const partyGateway = `<section class="party-home-link"><div><p class="eyebrow">DERRIÈRE LES CANDIDATURES</p><h2>Des partis, des histoires et des idées.</h2><p>${parties.length} formations à explorer, quatre grands sujets à comparer et des repères sur leur représentation à l’Assemblée nationale.</p></div><a class="button" href="./partis.html">Découvrir les partis ${arrow}</a></section>`;
pages.set('index.html', pages.get('index.html').replace('<aside class="next-step">', partyGateway + '<aside class="next-step">'));

const data = JSON.parse(await read('public/data.json'));
const candidatesIntro = intro('LES VISAGES DE L’ÉLECTION', 'Qui se présente en 2027 ?', `${data.candidates.length} candidatures déclarées sont documentées ici, avec leurs portraits et leurs sources. Ce suivi reste non exhaustif : une déclaration ne vaut pas validation officielle. Cliquez sur le classement d’une fiche pour lire sa définition et les raisons de son attribution.`, '<p class="intro-links"><a href="./election.html#parrainages">Comprendre les 500 présentations</a><a href="./sources.html">Notre méthode de vérification</a></p>');
pages.set('candidats.html', layout('candidats.html', 'Les candidatures déclarées', 'Découvrez les candidatures déclarées, leurs biographies, portraits et classements politiques expliqués et sourcés.', candidatesIntro + await read('site/candidates.html'), 'candidats.html', 'app.js'));

function familyCard([key, family]) {
  return `<article class="family-directory-card" data-family="${key}"><span class="family-type">${family.kind === 'family' ? 'Famille politique' : 'Repère transversal'}</span><h3><a href="./famille-${key}.html">${e(family.label)}</a></h3><p>${e(family.definition)}</p><a class="text-link" href="./famille-${key}.html">Histoire, idées et débats →</a></article>`;
}
const classic = Object.entries(families).filter(([, f]) => f.kind === 'family');
const transversal = Object.entries(families).filter(([, f]) => f.kind === 'transversal');
const historicalLenses = `<section class="section historical-lenses"><p class="eyebrow">DEUX LECTURES HISTORIQUES CENTRALES</p><h2>Rémond et Julliard : comprendre des traditions, pas distribuer des étiquettes.</h2><div class="historian-grid"><article><h3>René Rémond · les droites au pluriel</h3><p>Les traditions légitimiste, orléaniste et bonapartiste distinguent des rapports à l’autorité, aux libertés et à la nation. Les Droites aujourd’hui prolonge et discute cette lecture.</p><ul><li><strong>Légitimiste :</strong> contre-révolution, tradition et ordre hérité.</li><li><strong>Orléaniste :</strong> libéralisme, représentation et place des élites.</li><li><strong>Bonapartiste :</strong> autorité du chef, État et appel au peuple.</li></ul><a href="./sources.html#ref-remond">Les Droites en France</a> · <a href="./sources.html#ref-remond-actuel">Les Droites aujourd’hui</a></article><article><h3>Jacques Julliard · quatre traditions de gauche</h3><p>Les gauches libérale, jacobine, collectiviste et libertaire traversent les organisations et les époques. Elles éclairent des tensions sur l’État, la liberté, l’égalité et le mouvement social.</p><ul><li><strong>Libérale :</strong> libertés, droits et émancipation.</li><li><strong>Jacobine :</strong> République, souveraineté populaire et État.</li><li><strong>Collectiviste :</strong> travail, propriété et transformation sociale.</li><li><strong>Libertaire :</strong> autonomie et critique de la domination.</li></ul><a href="./sources.html#ref-julliard-gauches">Les Gauches françaises, 1762–2012</a></article></div><p class="source-line">Ces typologies sont des interprétations historiques discutées. Leurs catégories ne sont ni des partis de 2026 ni des filiations exclusives. Chaque dossier explique ses influences philosophiques et leurs limites.</p></section>`;
const familiesPage = intro('DES TRADITIONS, DES DÉSACCORDS', 'Les familles politiques, au-delà des étiquettes.', 'Chaque dossier présente les origines, les influences philosophiques, les principaux penseurs, les débats et une bibliographie. Rémond et Julliard nous aident à comprendre des traditions qui se croisent.') + historicalLenses +
  `<section class="section family-directory"><h2>Six grandes familles pour se repérer</h2><p class="section-intro">Ces familles sont une synthèse éditoriale de traditions historiques et de travaux comparatifs. Elles ne constituent pas une échelle chiffrée.</p><div class="family-directory-grid">${classic.map(familyCard).join('')}</div></section>` +
  `<section class="section section-soft family-directory"><h2>Des courants qui traversent l’axe gauche–droite</h2><p class="section-intro">Le souverainisme, la participation citoyenne et l’animalisme désignent des priorités qui peuvent croiser plusieurs familles. Leur présence ici ne signifie pas qu’ils forment trois camps homogènes.</p><div class="family-directory-grid">${transversal.map(familyCard).join('')}</div></section>` +
  `<section class="section reading-section"><h2>Et quand une famille ne peut pas être établie ?</h2><p>Une démarche personnelle ésotérique ne devient pas une famille politique reconnue parce qu’elle apparaît dans un annuaire. Nous distinguons le contenu attesté d’une déclaration et les positions qu’on ne peut pas en déduire.</p><a class="text-link" href="./famille-personal.html">Lire le dossier sur cette limite du classement →</a></section>`;
pages.set('familles.html', layout('familles.html', 'Les familles politiques', 'Explorez les traditions de gauche, d’écologie, du centre et de droite, ainsi que les courants transversaux, avec leurs références scientifiques.', familiesPage));

for (const [key, family] of Object.entries(families)) {
  const file = `famille-${key}.html`;
  const philosophy = `<section class="philosophical-influences"><h2>Influences philosophiques et grands penseurs</h2><p>${e(family.philosophy.frame)}</p>${family.philosophy.thinkers.length ? `<dl class="thinker-list">${family.philosophy.thinkers.map(([name, contribution])=>`<div><dt>${e(name)}</dt><dd>${e(contribution)}</dd></div>`).join('')}</dl>` : '<p class="reading-note">Aucune filiation philosophique établie pour ce repère personnel.</p>'}<p class="reading-note">${e(family.philosophy.caution)}</p><h3>Sources de cette lecture</h3>${referenceLinks(family.philosophy.references)}</section>`;
  const content = `<nav class="breadcrumb" aria-label="Fil d’Ariane"><a href="./index.html">Accueil</a><span aria-hidden="true">/</span><a href="./familles.html">Familles politiques</a><span aria-hidden="true">/</span><span>${e(family.label)}</span></nav>` +
    intro(family.kind === 'family' ? 'DOSSIER · FAMILLE POLITIQUE' : family.kind === 'transversal' ? 'DOSSIER · REPÈRE TRANSVERSAL' : 'DOSSIER · LIMITE DU CLASSEMENT', family.label, family.definition) +
    `<article class="section family-guide" data-family="${key}"><div class="guide-layout"><div class="guide-body"><p class="eyebrow">LA QUESTION CENTRALE</p><h2>${e(family.question)}</h2>${family.history.map(p => `<p>${e(p)}</p>`).join('')}${philosophy}<h2>Trois dimensions à examiner</h2><dl class="dimension-list">${family.dimensions.map(([title, text]) => `<div><dt>${e(title)}</dt><dd>${e(text)}</dd></div>`).join('')}</dl><aside class="reading-note"><h3>Une frontière à discuter</h3><p>${e(family.debate)}</p></aside></div><aside class="guide-sidebar"><h2>Pour approfondir</h2>${referenceLinks(family.references)}<p>Ces travaux éclairent les concepts. Ils ne classent pas les candidats de 2027 à notre place.</p><a class="text-link" href="./candidats.html?famille=${key}">Voir les candidatures rattachées à ce repère →</a>${parties.some(p=>p.family===key)?`<a class="text-link" href="./partis.html?famille=${key}">Voir les partis rattachés à ce repère →</a>`:''}<a class="text-link" href="./sources.html">Comment nous classons et vérifions →</a></aside></div></article>`;
  pages.set(file, layout(file, family.label, family.question + ' Un dossier de lecture avec des références scientifiques et des distinctions expliquées.', content, 'familles.html'));
}

const electionIntro = intro('DE LA CANDIDATURE AU RÉSULTAT', 'Comment fonctionne la présidentielle ?', 'Les 500 présentations d’élus, les deux tours, les suffrages exprimés et le rôle du Conseil constitutionnel : les étapes du scrutin expliquées à partir des textes officiels.', '<nav class="section-navigation" aria-label="Dans cette page"><a href="#candidature">Devenir candidat</a><a href="#parrainages">Les 500 présentations</a><a href="#deux-tours">Les deux tours</a><a href="#voter">Voter et contrôler</a></nav>');
pages.set('election.html', layout('election.html', 'Comprendre l’élection présidentielle', 'Comment se déroule l’élection : 500 présentations d’élus, 30 territoires, deux tours, majorité absolue et contrôle des résultats.', electionIntro + await read('site/election.html')));

const bibliography = Object.entries(academicReferences).map(([id, ref]) => `<article id="ref-${id}" class="bibliography-entry"><p class="reference-meta">${e(ref.authors)} · ${e(ref.year)}</p><h3><cite>${e(ref.title)}</cite></h3><p>${e(ref.publication)}</p><p><strong>Ce que cette référence apporte.</strong> ${e(ref.contribution)}</p><p>${external(ref.url, 'Notice, DOI ou documentation')}</p></article>`).join('');
const institutions = Object.entries(institutionalReferences).map(([id, ref]) => `<article id="institution-${id}" class="bibliography-entry"><p class="reference-meta">${e(ref.publisher)}</p><h3>${e(ref.title)}</h3><p>${e(ref.contribution)}</p><p>${external(ref.url, 'Consulter la source officielle')}</p></article>`).join('');
const sourcesPage = intro('UNE MÉTHODE VISIBLE', 'Des sources, et ce qu’on en fait.', 'Les travaux scientifiques définissent des concepts, la presse documente les candidatures et les textes officiels expliquent les règles électorales. Ces rôles sont complémentaires et restent distincts.', '<nav class="section-navigation" aria-label="Dans cette page"><a href="#methode">Méthode</a><a href="#bibliographie">Bibliographie scientifique</a><a href="#regles-officielles">Textes officiels</a></nav>') +
  await read('site/method.html') + `<section class="section reading-section" id="historiens"><p class="eyebrow">RÉMOND ET JULLIARD</p><h2>Nos principaux fils de lecture de l’histoire française</h2><p>Les Droites en France (1982) et Les Droites aujourd’hui (2005) de René Rémond servent à penser la diversité et les recompositions des droites. Les Gauches françaises, 1762–2012 de Jacques Julliard éclaire les traditions libérale, jacobine, collectiviste et libertaire.</p><p>Leurs modèles ne se superposent pas à notre annuaire : une tradition traverse plusieurs partis et un parti peut combiner plusieurs héritages. Les penseurs sont présentés dans ce cadre, sans leur prêter une influence revendiquée par chaque responsable contemporain. Les désaccords historiographiques, notamment avec Sternhell, restent visibles.</p>${referenceLinks(['remond','remond-actuel','julliard-gauches','julliard-pelloutier'])}</section>` +
  `<section class="section reading-section"><h2>Un classement éditorial, pas un score scientifique</h2><p>Nous croisons les positions documentées, les parcours et les affiliations actuelles. Une ancienne appartenance ne suffit pas ; un score de parti ne devient pas un score personnel. Les définitions et les dossiers sont des synthèses de lecture, pas des citations littérales ni une prétention à épuiser les ouvrages.</p><p>Les désaccords entre auteurs et les évolutions historiques sont signalés. Certaines références sont accessibles intégralement, d’autres par leur résumé, notice d’éditeur ou documentation bibliographique ; leur présence ne signifie pas que tous leurs chapitres ont été consultés en ligne.</p><p>Les courants transversaux sont distingués des familles partisanes ; la catégorie personnelle hors axe n’a pas le statut d’une famille scientifique. Les raisons du classement de chaque candidat restent consultables sur sa fiche.</p></section>` +
  `<section class="section references" id="bibliographie"><p class="eyebrow">OUVRAGES, ARTICLES ET DONNÉES</p><h2>Une bibliographie pour comprendre les différences</h2><p class="section-intro">${Object.keys(academicReferences).length} références de recherche et de méthode. Les dossiers renvoient aux travaux qui éclairent directement leur sujet. Aucun de ces travaux n’est utilisé comme preuve automatique du classement individuel d’un candidat.</p><div class="bibliography-grid">${bibliography}</div></section>` +
  `<section class="section references section-soft" id="regles-officielles"><p class="eyebrow">LE DROIT ET LES INSTITUTIONS</p><h2>Les sources des règles électorales</h2><p class="section-intro">Les textes en vigueur priment sur les archives pédagogiques. Les anciens calendriers de 2022 ne sont pas transposés à 2027.</p><div class="bibliography-grid">${institutions}</div></section>` +
  `<section class="section reading-section"><h2>Sources de presse et portraits</h2><p>Chaque fiche de candidature conserve les articles qui documentent l’annonce, la biographie et le classement. Les sources sont accessibles dans « Sources et crédit photo » ; les crédits et les conditions de réutilisation des portraits y sont également indiqués.</p><a class="text-link" href="./candidats.html">Consulter les fiches et leurs sources →</a></section>`;
pages.set('sources.html', layout('sources.html', 'Méthode et bibliographie', 'La méthode de classement, une bibliographie scientifique élargie et les textes officiels sur l’élection présidentielle.', sourcesPage));

const parliament = JSON.parse(await read('public/parliament.json'));
for (const [file, content] of renderPartyPages({ layout, intro, e, external, referenceLinks, parliament })) pages.set(file, content);

let stale = false;
for (const [file, content] of pages) {
  const target = new URL(`public/${file}`, root);
  if (process.argv.includes('--check')) {
    const saved = await readFile(target, 'utf8').catch(() => '');
    if (saved !== content) { console.error(`Page à régénérer : ${file}`); stale = true; }
  } else await writeFile(target, content);
}
if (stale) process.exitCode = 1;
else console.log(`${pages.size} pages statiques ${process.argv.includes('--check') ? 'vérifiées' : 'générées'}.`);
