const labels = { radical: 'Gauche radicale / révolutionnaire', left: 'Gauche sociale-démocrate', green: 'Écologie politique', centre: 'Centre', right: 'Droite conservatrice / libérale', 'far-right': 'Droite radicale / extrême droite', unclassified: 'Classement non établi' };
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
const navLinks = [...document.querySelectorAll('header nav a')];
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    for (const link of navLinks) {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
}, { rootMargin: '-10% 0px -65% 0px' });
for (const id of ['candidats', 'familles', 'methode']) observer.observe(document.getElementById(id));
function render() {
  const term = normalize(search.value.trim());
  const matches = candidates.filter(c => normalize(`${c.name} ${c.party}`).includes(term) && (family.value === 'all' || c.family === family.value));
  list.replaceChildren();
  for (const c of matches) {
    const article = document.createElement('article'); article.className = 'candidate-card';
    article.dataset.family = c.family;
    const portrait = element('div', 'candidate-initials', c.name.split(' ').map(part => part[0]).slice(0, 2).join(''));
    portrait.setAttribute('aria-hidden', 'true');
    const badge = element('span', 'candidate-status', 'Candidature déclarée');
    const top = element('div', 'candidate-top'); top.append(portrait, badge);
    const heading = document.createElement('h3'); heading.textContent = c.name;
    const party = element('p', 'candidate-party', c.party);
    const classification = element('p', 'candidate-family', labels[c.family] || labels.unclassified);
    const biography = element('p', 'candidate-biography', c.biography);
    const declaration = element('p', 'candidate-declaration', `Déclaration : ${formatDate(c.declaredAt)}`);
    const details = document.createElement('details');
    details.className = 'candidate-evidence';
    const summary = document.createElement('summary'); summary.textContent = 'Classement et sources';
    const reason = document.createElement('p'); reason.textContent = c.rationale;
    const date = element('p', 'candidate-verification', `Fiche vérifiée le ${formatDate(c.verifiedAt)}`);
    details.append(summary, reason);
    for (const s of c.sources) {
      const url = new URL(s.url); if (url.protocol !== 'https:') continue;
      const link = document.createElement('a'); link.href = url.href; link.textContent = s.label; link.target = '_blank'; link.rel = 'noopener noreferrer';
      const p = document.createElement('p'); p.append(link); details.append(p);
    }
    article.append(top, heading, party, classification, biography, declaration, details, date);
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
  render();
} catch {
  count.textContent = 'Chargement impossible. Réessayez en actualisant la page.';
  empty.querySelector('h3').textContent = 'L’annuaire est temporairement indisponible.';
  empty.querySelector('p').textContent = 'Les données ne peuvent pas être chargées. La méthode et les références restent consultables.';
}
