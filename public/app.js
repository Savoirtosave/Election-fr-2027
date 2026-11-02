const labels = { radical: 'Gauche radicale / révolutionnaire', left: 'Gauche sociale-démocrate', green: 'Écologie politique', centre: 'Centre', right: 'Droite conservatrice / libérale', 'far-right': 'Droite radicale / extrême droite', unclassified: 'Classement non établi' };
const search = document.querySelector('#search');
const family = document.querySelector('#family');
const list = document.querySelector('#candidate-list');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty');
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
let candidates = [];
function render() {
  const term = normalize(search.value.trim());
  const matches = candidates.filter(c => normalize(`${c.name} ${c.party}`).includes(term) && (family.value === 'all' || c.family === family.value));
  list.replaceChildren();
  for (const c of matches) {
    const article = document.createElement('article'); article.className = 'candidate-card';
    const heading = document.createElement('h3'); heading.textContent = c.name;
    const party = document.createElement('p'); party.textContent = c.party;
    const classification = document.createElement('p'); classification.textContent = labels[c.family] || labels.unclassified;
    const reason = document.createElement('p'); reason.textContent = c.rationale;
    const date = document.createElement('p'); date.textContent = `Vérifié le ${new Intl.DateTimeFormat('fr-FR', {dateStyle: 'long', timeZone: 'UTC'}).format(new Date(c.verifiedAt))}`;
    article.append(heading, party, classification, reason, date);
    for (const s of c.sources) {
      const url = new URL(s.url); if (url.protocol !== 'https:') continue;
      const link = document.createElement('a'); link.href = url.href; link.textContent = `${s.label} ↗`; link.target = '_blank'; link.rel = 'noopener noreferrer';
      const p = document.createElement('p'); p.append(link); article.append(p);
    }
    list.append(article);
  }
  empty.hidden = matches.length > 0;
  if (!candidates.length) { count.textContent = 'Annuaire non encore renseigné · Aucun décompte de candidatures disponible'; return; }
  count.textContent = `${matches.length} candidature${matches.length > 1 ? 's' : ''} affichée${matches.length > 1 ? 's' : ''}`;
  empty.querySelector('h3').textContent = 'Aucun résultat pour ces filtres.';
  empty.querySelector('p').textContent = 'Essayez un autre nom ou sélectionnez toutes les familles politiques.';
  empty.querySelector('.muted').textContent = 'La recherche porte sur le nom et le parti.';
}
search.addEventListener('input', render); family.addEventListener('change', render);
try {
  const response = await fetch('/data.json');
  if (!response.ok) throw new Error('Données indisponibles');
  const data = await response.json();
  candidates = data.candidates;
  render();
} catch {
  count.textContent = 'Chargement impossible. Réessayez en actualisant la page.';
  empty.querySelector('h3').textContent = 'L’annuaire est temporairement indisponible.';
  empty.querySelector('p').textContent = 'Les données ne peuvent pas être chargées. La méthode et les références restent consultables.';
}
