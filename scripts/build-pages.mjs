import { renderFamilyPages } from './render-families.mjs';
import { renderContextPage } from './render-context.mjs';
import { renderCandidatePages } from './render-candidates.mjs';
import { partyLogos } from '../public/party-logos.js';
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
const navigation = [['candidats.html', 'Candidats'], ['partis.html', 'Partis'], ['familles.html', 'Familles politiques'], ['election.html', 'L’élection'], ['contexte.html', 'Contexte'], ['sources.html', 'Sources']];

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
const contextGateway = `<section class="party-home-link context-home-link"><div><p class="eyebrow">LE PAYS À LA VEILLE DU SCRUTIN</p><h2>Dette, emploi, école : les repères du débat.</h2><p>Des données officielles pour comparer la France, l’Allemagne, l’Espagne et l’Italie, avec leurs définitions et leurs sources.</p></div><a class="button" href="./contexte.html">Comprendre le contexte ${arrow}</a></section>`;
const partyGateway = `<section class="party-home-link"><div><p class="eyebrow">DERRIÈRE LES CANDIDATURES</p><h2>Des partis, des histoires et des idées.</h2><p>${parties.length} formations à explorer, des positions par sujet à comparer et des repères sur leur représentation à l’Assemblée nationale.</p></div><a class="button" href="./partis.html">Découvrir les partis ${arrow}</a></section>`;
pages.set('index.html', pages.get('index.html').replace('<aside class="next-step">', partyGateway + contextGateway + '<aside class="next-step">'));

const data = JSON.parse(await read('public/data.json'));
const candidatesIntro = intro('LES VISAGES DE L’ÉLECTION', 'Qui se présente en 2027 ?', `${data.candidates.length} candidatures déclarées sont documentées ici, avec leurs portraits et leurs sources. Ce suivi reste non exhaustif : une déclaration ne vaut pas validation officielle. Ouvrez un profil pour découvrir son parcours et l’ébauche de ses orientations ; son classement reste expliqué sur la fiche.`, '<p class="intro-links"><a href="./election.html#parrainages">Comprendre les 500 parrainages</a><a href="./sources.html">Notre méthode de vérification</a></p>');
pages.set('candidats.html', layout('candidats.html', 'Les candidatures déclarées', 'Découvrez les candidatures déclarées, leurs biographies, portraits et classements politiques expliqués et sourcés.', candidatesIntro + await read('site/candidates.html'), 'candidats.html', 'app.js'));

for (const [file, content] of renderFamilyPages({layout,intro,e,external,referenceLinks,candidates:data.candidates})) pages.set(file,content);

const electionIntro = intro('DE LA CANDIDATURE AU RÉSULTAT', 'Comment fonctionne la présidentielle ?', 'Les 500 parrainages d’élus, les deux tours, les suffrages exprimés et le rôle du Conseil constitutionnel : les étapes du scrutin expliquées à partir des textes officiels.', '<nav class="section-navigation" aria-label="Dans cette page"><a href="#candidature">Devenir candidat</a><a href="#parrainages">Les 500 parrainages</a><a href="#deux-tours">Les deux tours</a><a href="#voter">Voter et contrôler</a></nav>');
pages.set('election.html', layout('election.html', 'Comprendre l’élection présidentielle', 'Comment se déroule l’élection : 500 parrainages d’élus, 30 territoires, deux tours, majorité absolue et contrôle des résultats.', electionIntro + await read('site/election.html')));

const bibliography = Object.entries(academicReferences).map(([id, ref]) => `<article id="ref-${id}" class="bibliography-entry"><p class="reference-meta">${e(ref.authors)} · ${e(ref.year)}</p><h3><cite>${e(ref.title)}</cite></h3><p>${e(ref.publication)}</p>${ref.consultation ? `<p class="source-line">Consultation : ${e(ref.consultation)}</p>` : ''}<p><strong>Ce que cette référence apporte.</strong> ${e(ref.contribution)}</p><p>${external(ref.url, 'Notice, DOI ou documentation')}</p></article>`).join('');
const institutions = Object.entries(institutionalReferences).map(([id, ref]) => `<article id="institution-${id}" class="bibliography-entry"><p class="reference-meta">${e(ref.publisher)}</p><h3>${e(ref.title)}</h3><p>${e(ref.contribution)}</p><p>${external(ref.url, 'Consulter la source officielle')}</p></article>`).join('');
const sourcesPage = intro('UNE MÉTHODE VISIBLE', 'Des sources, et ce qu’on en fait.', 'Les travaux scientifiques définissent des concepts, la presse documente les candidatures et les textes officiels expliquent les règles électorales. Ces rôles sont complémentaires et restent distincts.', '<nav class="section-navigation" aria-label="Dans cette page"><a href="#methode">Méthode</a><a href="#bibliographie">Bibliographie scientifique</a><a href="#regles-officielles">Textes officiels</a></nav>') +
  await read('site/method.html') + `<section class="section reading-section" id="historiens"><p class="eyebrow">HISTOIRE POLITIQUE ET HISTOIRE DES IDÉES</p><h2>Des références majeures pour comprendre l’histoire politique française</h2><p>Les Droites en France (1982) et Les Droites aujourd’hui (2005) de René Rémond servent à penser la diversité et les recompositions des droites. Les Gauches françaises, 1762–2012 de Jacques Julliard éclaire les traditions libérale, jacobine, collectiviste et libertaire.</p><p>Ces ouvrages s’inscrivent dans une bibliographie plus large : de nombreux autres auteurs et travaux ont été consultés, notamment Philippe Nemo, Zeev Sternhell, Sheri Berman, Cas Mudde, Andrew Dobson, Bernard Manin et les enquêtes comparatives sur les partis. Leurs apports et leurs limites sont précisés dans la bibliographie ci-dessous.</p><p>Leurs modèles ne se superposent pas à notre annuaire : une tradition traverse plusieurs partis et un parti peut combiner plusieurs héritages. Les penseurs sont présentés dans ce cadre, sans leur prêter une influence revendiquée par chaque responsable contemporain. Les désaccords historiographiques, notamment avec Sternhell, restent visibles.</p><p>L’ouvrage de Philippe Nemo, <cite>Histoire des idées politiques aux Temps modernes et contemporains</cite>, complète cette approche par l’histoire de la souveraineté, de l’État de droit, du libéralisme et des socialismes. Les dossiers précisent les chapitres mobilisés et croisent cette perspective avec les autres références.</p>${referenceLinks(['remond','remond-actuel','julliard-gauches','julliard-pelloutier','nemo-modern'])}</section>` +
  `<section class="section reading-section"><h2>Un classement éditorial, pas un score scientifique</h2><p>Nous croisons les positions documentées, les parcours et les affiliations actuelles. Une ancienne appartenance ne suffit pas ; un score de parti ne devient pas un score personnel. Les définitions et les dossiers sont des synthèses de lecture, pas des citations littérales ni une prétention à épuiser les ouvrages.</p><p>Les désaccords entre auteurs et les évolutions historiques sont signalés. Certaines références sont accessibles intégralement, d’autres par leur résumé, notice d’éditeur ou documentation bibliographique ; leur présence ne signifie pas que tous leurs chapitres ont été consultés en ligne.</p><p>Les courants transversaux sont distingués des familles partisanes ; la catégorie personnelle hors axe n’a pas le statut d’une famille scientifique. Les raisons du classement de chaque candidat restent consultables sur sa fiche.</p></section>` +
  `<section class="section references" id="bibliographie"><p class="eyebrow">OUVRAGES, ARTICLES ET DONNÉES</p><h2>Une bibliographie pour comprendre les différences</h2><p class="section-intro">${Object.keys(academicReferences).length} références de recherche et de méthode. Les dossiers renvoient aux travaux qui éclairent directement leur sujet. Aucun de ces travaux n’est utilisé comme preuve automatique du classement individuel d’un candidat.</p><div class="bibliography-grid">${bibliography}</div></section>` +
  `<section class="section references section-soft" id="regles-officielles"><p class="eyebrow">LE DROIT ET LES INSTITUTIONS</p><h2>Les sources des règles électorales</h2><p class="section-intro">Les textes en vigueur priment sur les archives pédagogiques. Les anciens calendriers de 2022 ne sont pas transposés à 2027.</p><div class="bibliography-grid">${institutions}</div></section>` +
  `<section class="section reading-section"><h2>Sources de presse et portraits</h2><p>Chaque fiche de candidature conserve les articles qui documentent l’annonce, la biographie et le classement. Les sources sont accessibles dans « Sources et crédits des visuels » ; les crédits et les conditions de réutilisation des portraits y sont également indiqués.</p><a class="text-link" href="./candidats.html">Consulter les fiches et leurs sources →</a></section>`;
const logoSources = `<section class="section references" id="logos"><h2>Logos des partis et mouvements</h2><p>Visuels reproduits à des fins d’identification, sans modification de leur dessin. Les marques restent la propriété de leurs titulaires ; leur présence ne vaut pas soutien au site. Les fichiers sont conservés localement. Sources consultées le 2 novembre 2026.</p><ul>${Object.values(partyLogos).map(l=>`<li>${external(l.source,e(l.name))}${l.asset ? ' · '+external(l.asset,'Fichier original') : ' · SVG extrait de la page officielle'}</li>`).join('')}</ul></section>`;
pages.set('sources.html', layout('sources.html', 'Méthode et bibliographie', 'La méthode de classement, une bibliographie scientifique élargie et les textes officiels sur l’élection présidentielle.', sourcesPage + `<section class="section"><h2>Les données du contexte économique et social</h2><p>Eurostat, Insee et OCDE : les définitions, périodes, tableaux de comparaison et liens vers les séries figurent sur la page Contexte.</p><a class="text-link" href="./contexte.html#sources-contexte">Consulter les sources statistiques →</a></section>` + logoSources));

const international = JSON.parse(await read('public/international-data.json'));
const parliament = JSON.parse(await read('public/parliament.json'));
for (const [file, content] of renderPartyPages({ layout, intro, e, external, referenceLinks, parliament, international, candidates: data.candidates })) pages.set(file, content);

for (const [file, content] of renderCandidatePages({candidates: data.candidates, layout, intro, e, external, international})) pages.set(file, content);

const context = JSON.parse(await read('public/context-data.json'));
pages.set('contexte.html', renderContextPage({context,layout,intro,e,external}));

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
