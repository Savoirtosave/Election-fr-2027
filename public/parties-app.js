const search = document.querySelector('#party-search');
const family = document.querySelector('#party-family');
const group = document.querySelector('#party-group');
const sort = document.querySelector('#party-sort');
const grid = document.querySelector('#party-cards');
const count = document.querySelector('#party-count');
const empty = document.querySelector('#party-empty');
const cards = [...grid.querySelectorAll('.party-card')];
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function render() {
  const term = normalize(search.value.trim());
  const ordered = [...cards].sort((a, b) => {
    const difference = Number(a.dataset.founded) - Number(b.dataset.founded);
    if (difference && sort.value !== 'name') return sort.value === 'recent' ? -difference : difference;
    return a.dataset.name.localeCompare(b.dataset.name, 'fr');
  });
  let matches = 0;
  for (const card of ordered) {
    const groups = card.dataset.groups.split(' ').filter(Boolean);
    const shown = normalize(card.dataset.search).includes(term)
      && (family.value === 'all' || card.dataset.family === family.value)
      && (group.value === 'all' || (group.value === 'none' ? !groups.length : groups.includes(group.value)));
    card.hidden = !shown;
    if (shown) matches++;
    grid.append(card);
  }
  count.textContent = `${matches} parti${matches > 1 ? 's' : ''} affiché${matches > 1 ? 's' : ''} sur ${cards.length}`;
  empty.hidden = matches > 0;
}
search.addEventListener('input', render);
for (const control of [family, group, sort]) control.addEventListener('change', render);
document.querySelector('#party-reset').addEventListener('click', () => {
  search.value = ''; family.value = 'all'; group.value = 'all'; sort.value = 'name';
  render(); search.focus();
});
const requested = new URLSearchParams(window.location.search).get('famille');
if ([...family.options].some(option => option.value === requested)) family.value = requested;
render();

const gridView = document.querySelector('#party-grid-view');
const listView = document.querySelector('#party-list-view');
function setView(list) {
  grid.classList.toggle('is-list', list);
  gridView.setAttribute('aria-pressed', String(!list));
  listView.setAttribute('aria-pressed', String(list));
}
gridView.addEventListener('click', () => setView(false));
listView.addEventListener('click', () => setView(true));

// Progressive enhancement: both sections remain readable without JavaScript.
const tabs = [...document.querySelectorAll('.party-tabs [role="tab"]')];
const panes = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
document.querySelector('.party-tabs').hidden = false;
function activate(index, changeAddress = false) {
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    panes[i].hidden = i !== index;
  });
  if (changeAddress) history.replaceState(null, '', `#${panes[index].id}`);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(index, true));
  tab.addEventListener('keydown', event => {
    const targets = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
    if (!Object.hasOwn(targets, event.key)) return;
    event.preventDefault();
    const target = targets[event.key];
    activate(target, true); tabs[target].focus();
  });
});
const syncHash = () => activate(window.location.hash === '#hemicycle' ? 1 : 0);
window.addEventListener('hashchange', syncHash);
syncHash();
