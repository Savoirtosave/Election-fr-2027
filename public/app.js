import { partyLogos } from './party-logos.js';
import { families } from './families.js';
const search = document.querySelector('#search');
const family = document.querySelector('#family');
const list = document.querySelector('#candidate-list');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty');
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const formatDate = value => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value));
function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}
let candidates = [];
function render() {
  const term = normalize(search.value.trim());
  const matches = candidates.filter(c => normalize(`${c.name} ${c.party}`).includes(term) && (family.value === 'all' || c.family === family.value));
  list.replaceChildren();
  for (const c of matches) {
    const article = document.createElement('article'); article.className = 'candidate-card';
    article.dataset.family = c.family;
    const portrait = element('div', 'candidate-portrait');
    const initials = element('span', 'candidate-initials', c.name.split(' ').map(part => part[0]).slice(0, 2).join(''));
    initials.setAttribute('aria-hidden', 'true');
    const photo = document.createElement('img');
    photo.src = c.photo.src;
    photo.alt = `Portrait de ${c.name}`;
    photo.width = 160; photo.height = 160;
    photo.loading = 'lazy'; photo.decoding = 'async';
    if (c.photo.position) photo.style.objectPosition = c.photo.position;
    if (c.photo.panel) portrait.classList.add(`portrait-panel-${c.photo.panel}`);
    photo.addEventListener('error', () => {
      photo.hidden = true;
      initials.hidden = false;
      portrait.setAttribute('role', 'img');
      portrait.setAttribute('aria-label', `Portrait indisponible : ${c.name}`);
    }, { once: true });
    initials.hidden = true;
    portrait.append(photo, initials);
    const badge = element('span', 'candidate-status', 'Candidature déclarée');
    const top = element('div', 'candidate-top'); top.append(portrait, badge);
    const heading = document.createElement('h3');
    const profileLink = element('a', 'candidate-profile-link', c.name);
    profileLink.href = `./candidat-${c.id}.html`; heading.append(profileLink);
    const portraitLink = element('a', 'candidate-portrait-link');
    portraitLink.href = profileLink.href; portraitLink.setAttribute('aria-label', `Profil de ${c.name}`);
    portraitLink.append(portrait); top.prepend(portraitLink);
    const party = element('div', 'candidate-party');
    const logos = element('div', 'candidate-logos');
    for (const id of c.logoIds) {
      const logo = partyLogos[id];
      const link = element('a', 'candidate-party-logo');
      link.href = logo.href;
      link.style.setProperty('--logo-background', logo.background);
      const image = document.createElement('img');
      image.src = logo.src; image.alt = `Logo : ${logo.name}`;
      image.width = 120; image.height = 64; image.loading = 'lazy'; image.decoding = 'async';
      link.append(image); logos.append(link);
    }
    party.append(logos, element('span', '', c.party));
    const classification = element('details', 'candidate-classification');
    const politicalFamily = families[c.family];
    const familySummary = element('summary', 'candidate-family', politicalFamily.label);
    familySummary.title = `Comprendre le classement de ${c.name}`;
    const explanation = element('div', 'classification-explanation');
    explanation.append(
      element('h4', '', politicalFamily.kind === 'family' ? 'Définition de la famille' : 'Définition du repère'),
      element('p', '', politicalFamily.definition),
      element('h4', '', `Pourquoi ce classement pour ${c.name} ?`),
      element('p', '', c.rationale),
      element('p', 'classification-note', 'Interprétation éditoriale fondée sur les sources de la fiche. Un repère principal ne résume pas toutes les positions du candidat.'),
    );
    const guideLink = element('a', 'text-link', 'Approfondir ce courant : histoire, idées et débats →');
    guideLink.href = `./famille-${c.family}.html`;
    explanation.append(guideLink);
    classification.append(familySummary, explanation);
    const biography = element('p', 'candidate-biography', c.biography);
    const declaration = element('p', 'candidate-declaration', `${c.declarationDateType === 'reported' ? 'Candidature rapportée le' : 'Déclaration le'} ${formatDate(c.declaredAt)}`);
    const details = document.createElement('details');
    details.className = 'candidate-evidence';
    const summary = document.createElement('summary'); summary.textContent = 'Sources et crédits des visuels';
    details.append(summary);
    for (const s of c.sources) {
      const url = new URL(s.url); if (url.protocol !== 'https:') continue;
      const link = document.createElement('a'); link.href = url.href; link.textContent = s.label; link.target = '_blank'; link.rel = 'noopener noreferrer';
      const p = document.createElement('p'); p.append(link); details.append(p);
    }
    const credit = element('p', 'photo-credit', `Photo : ${c.photo.credit} · `);
    const photoSource = element('a', '', c.photo.license);
    photoSource.href = c.photo.source; photoSource.target = '_blank'; photoSource.rel = 'noopener noreferrer';
    credit.append(photoSource);
    if (c.photo.licenseUrl) {
      const license = element('a', '', 'Conditions de réutilisation');
      license.href = c.photo.licenseUrl; license.target = '_blank'; license.rel = 'noopener noreferrer';
      credit.append(document.createTextNode(' · '), license);
    }
    details.append(credit);
    if (c.logoIds.length) {
      const logoCredit = element('p', 'logo-credit', 'Logos : ');
      for (const id of c.logoIds) {
        const link = element('a', '', partyLogos[id].name);
        link.href = partyLogos[id].source; link.target = '_blank'; link.rel = 'noopener noreferrer';
        logoCredit.append(link, document.createTextNode(' · '));
      }
      const provenance = element('a', '', 'Provenance des logos'); provenance.href = './sources.html#logos';
      logoCredit.append(provenance); details.append(logoCredit);
    }
    const programmeLink = element('a', 'candidate-programme-link', 'Profil et programme · ébauche →');
    programmeLink.href = `./candidat-${c.id}.html#programme`;
    article.append(top, heading, party, classification, biography, declaration, programmeLink, details);
    list.append(article);
  }
  empty.hidden = matches.length > 0;
  if (!candidates.length) { search.disabled = true; family.disabled = true; count.textContent = 'Annuaire non encore renseigné · Aucun décompte de candidatures disponible'; return; }
  count.textContent = `${matches.length} candidature${matches.length > 1 ? 's' : ''} affichée${matches.length > 1 ? 's' : ''}`;
  empty.querySelector('h3').textContent = 'Aucun résultat pour ces filtres.';
  empty.querySelector('p').textContent = 'Essayez un autre nom ou sélectionnez toutes les familles politiques.';
  empty.querySelector('.muted').textContent = 'La recherche porte sur le nom et le parti.';
}
search.addEventListener('input', render); family.addEventListener('change', render);
try {
  const response = await fetch('./data.json');
  if (!response.ok) throw new Error('Données indisponibles');
  const data = await response.json();
  candidates = data.candidates;
  const requestedFamily = new URLSearchParams(window.location.search).get('famille');
  if (requestedFamily && Object.hasOwn(families, requestedFamily)) family.value = requestedFamily;
  render();
} catch {
  count.textContent = 'Chargement impossible. Réessayez en actualisant la page.';
  empty.querySelector('h3').textContent = 'L’annuaire est temporairement indisponible.';
  empty.querySelector('p').textContent = 'Les données ne peuvent pas être chargées. La méthode et les références restent consultables.';
}
