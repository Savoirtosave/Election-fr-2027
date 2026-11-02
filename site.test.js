import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { server } from './server.js';
import { families } from './public/families.js';
import { academicReferences, institutionalReferences } from './public/references.js';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { parties, partyTopics } from './public/parties.js';

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
after(() => server.close());
const pages = ['index.html', 'candidats.html', 'familles.html', 'election.html', 'sources.html', 'partis.html', ...parties.map(p => `parti-${p.id}.html`), ...Object.keys(families).map(key => `famille-${key}.html`)];

test('les pages sont générées de façon reproductible sans dépendance', () => {
  const result = execFileSync(process.execPath, ['scripts/build-pages.mjs', '--check'], { cwd: new URL('.', import.meta.url), encoding: 'utf8' });
  assert.match(result, /pages statiques vérifiées/);
});
test('chaque rubrique est une vraie page HTML avec sa navigation', async () => {
  for (const path of pages) {
    const res = await fetch(base + '/' + path); assert.equal(res.status, 200, path);
    assert.match(res.headers.get('content-type'), /text\/html/);
    const html = await res.text();
    assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1, path);
    const nav = html.match(/<nav aria-label="Navigation principale">([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav, path);
    for (const file of ['candidats.html','partis.html','familles.html','election.html','sources.html']) assert.ok(nav.includes(`href="./${file}"`), path);
    if (path !== 'index.html') assert.match(nav, /aria-current="(?:page|location)"/);
  }
  const home = await (await fetch(base)).text();
  assert.doesNotMatch(home, /id="candidate-list"|id="methode"|id="bibliographie"/);
  const candidates = await (await fetch(base + '/candidats.html')).text();
  assert.match(candidates, /id="candidate-list"/);
  assert.match(candidates, /non exhaustif/);
});
test('les liens entre pages et les citations internes aboutissent à une cible réelle', async () => {
  const documents = new Map();
  for (const file of pages) documents.set('/' + file, await (await fetch(base + '/' + file)).text());
  for (const [path, html] of documents) {
    for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const url = new URL(href.replaceAll('&amp;', '&'), base + path);
      if (url.origin !== base) continue;
      const target = documents.get(url.pathname);
      assert.ok(target, `${path} → ${url.pathname}`);
      if (url.hash) assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path} → ${url.pathname}${url.hash}`);
    }
  }
});
test('les dossiers développent les familles et renvoient aux références scientifiques', async () => {
  const bibliography = await (await fetch(base + '/sources.html')).text();
  assert.ok(Object.keys(academicReferences).length >= 12);
  for (const [id, reference] of Object.entries(academicReferences)) {
    assert.ok(reference.authors && reference.year && reference.title && reference.publication && reference.contribution);
    assert.equal(new URL(reference.url).protocol, 'https:');
    assert.ok(bibliography.includes(`id="ref-${id}"`));
  }
  for (const [key, family] of Object.entries(families)) {
    assert.ok(family.history.length >= 2 && family.dimensions.length === 3 && family.debate);
    const html = await (await fetch(base + `/famille-${key}.html`)).text();
    for (const id of family.references) {
      assert.ok(Object.hasOwn(academicReferences, id));
      assert.ok(html.includes(`./sources.html#ref-${id}`));
    }
    assert.ok(html.includes(`./candidats.html?famille=${key}`));
  }
});
test('la page électorale explique les seuils, les deux tours et cite les textes officiels', async () => {
  const html = await (await fetch(base + '/election.html')).text();
  for (const term of ['500', '30 départements', '50', 'quatorze jours', 'majorité absolue', 'votes blancs', 'Conseil constitutionnel', 'CNCCFP']) assert.ok(html.includes(term), term);
  for (const id of ['constitution','loi-1962','parrainages','candidature','vote','cnccfp']) assert.ok(html.includes(`./sources.html#institution-${id}`), id);
  assert.match(html, /archives/);
  assert.doesNotMatch(html, /avril 2022|avril 2027/);
});
test('les ressources locales sont servies avec le bon type', async () => {
  for (const [path, type] of [['/app.js','javascript'], ['/parties-app.js','javascript'], ['/parties.js','javascript'], ['/parliament.json','json'], ['/families.js','javascript'], ['/references.js','javascript'], ['/navigation.js','javascript'], ['/style.css','css'], ['/data.json','json']]) {
    const res = await fetch(base + path); assert.equal(res.status,200); assert.ok(res.headers.get('content-type').includes(type));
  }
});
test('les fiches documentées ont une biographie, des dates et des sources', async () => {
  const data = await (await fetch(base + '/data.json')).json();
  const names = new Set();
  for (const c of data.candidates) {
    assert.ok(!names.has(c.name), `Fiche en double : ${c.name}`); names.add(c.name);
    assert.ok(Object.hasOwn(families, c.family), `Classement absent : ${c.name}`);
    assert.ok(families[c.family].definition.length > 80);
    assert.ok(['announced', 'reported'].includes(c.declarationDateType));
    assert.ok(c.declaredAt <= c.verifiedAt);
    assert.ok(c.verifiedAt <= data.verifiedAt);
    assert.ok(c.name && c.party && c.rationale && c.verifiedAt && c.biography && c.declaredAt);
    assert.ok(Number.isFinite(Date.parse(c.declaredAt)));
    assert.ok(Number.isFinite(Date.parse(c.verifiedAt)));
    assert.ok(c.sources.length >= 2);
    for (const source of c.sources) {
      assert.ok(source.label);
      assert.equal(new URL(source.url).protocol, 'https:');
    }
    assert.ok(c.sources.some(s => !new URL(s.url).hostname.endsWith('wikipedia.org')), 'Une source de presse est nécessaire');
  }
  assert.ok(data.candidates.length > 0, 'L’annuaire doit contenir des candidatures documentées');
  assert.equal(data.coverage, 'partial');
  assert.match(data.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
});
test('chaque portrait local est servi avec son type image et sa provenance', async () => {
  const data = await (await fetch(base + '/data.json')).json();
  for (const c of data.candidates) {
    assert.match(c.photo.src, /^\.\/portraits\/[a-z-]+\.(jpg|png)$/);
    assert.ok(c.photo.credit && c.photo.license);
    assert.equal(new URL(c.photo.source).protocol, 'https:');
    const res = await fetch(new URL(c.photo.src, base + '/'));
    assert.equal(res.status, 200, c.name);
    const bytes = new Uint8Array(await res.arrayBuffer());
    const png = c.photo.src.endsWith('.png');
    assert.equal(res.headers.get('content-type'), png ? 'image/png' : 'image/jpeg');
    assert.deepEqual([...bytes.slice(0, png ? 8 : 3)], png ? [137,80,78,71,13,10,26,10] : [255,216,255]);
  }
});
test('tous les repères politiques proposés sont définis et filtrables', async () => {
  const html = await (await fetch(base + '/candidats.html')).text();
  for (const [key, value] of Object.entries(families)) {
    assert.ok(value.label && value.definition && value.kind);
    assert.ok(html.includes(`<option value="${key}">`), `Filtre manquant : ${key}`);
  }
  assert.doesNotMatch(html, /value="unclassified"/);
});
test('fichiers privés et chemins hors du site restent inaccessibles', async () => {
  assert.equal((await fetch(base + '/package.json')).status,404);
  assert.equal((await fetch(base + '/..%2fpackage.json')).status,403);
  assert.equal((await fetch(base + '/absent')).status,404);
});

test('les partis ont une histoire, quatre thèmes sourcés et des lectures historiques', async () => {
  const chamber = JSON.parse(await readFile(new URL('./public/parliament.json', import.meta.url), 'utf8'));
  const ids = new Set();
  assert.equal(parties.length, 25);
  for (const party of parties) {
    assert.ok(!ids.has(party.id)); ids.add(party.id);
    assert.ok(families[party.family]);
    assert.ok(party.history.length >= 2 && party.ideology.length > 100);
    assert.ok(party.academicRefs.length >= 2);
    for (const id of party.academicRefs) assert.ok(academicReferences[id], `${party.id}/${id}`);
    assert.ok(!Object.hasOwn(party, 'seats'), 'Ne pas assimiler un total de groupe à un effectif de parti');
    for (const group of party.assemblyGroups) assert.ok(chamber.groups.some(g => g.id === group));
    for (const source of party.sources) assert.equal(new URL(source.url).protocol, 'https:');
    for (const key of Object.keys(partyTopics)) {
      assert.ok(party.issues[key].text.length > 50);
      for (const sourceId of party.issues[key].sourceIds) assert.ok(party.sources.some(s => s.id === sourceId));
    }
    const html = await (await fetch(base + `/parti-${party.id}.html`)).text();
    for (const id of ['positions','representation','sources-parti']) assert.ok(html.includes(`id="${id}"`));
    for (const label of Object.values(partyTopics)) assert.ok(html.includes(label));
  }
});
test('le relevé parlementaire et le schéma comptent chaque siège une seule fois', async () => {
  const chamber = await (await fetch(base + '/parliament.json')).json();
  assert.equal(chamber.capacity, 577); assert.equal(chamber.occupied, 574); assert.equal(chamber.vacant, 3);
  assert.equal(chamber.groups.length, 11);
  assert.equal(new Set(chamber.groups.map(g => g.id)).size, chamber.groups.length);
  for (const group of chamber.groups) assert.equal(group.members + group.associated, group.seats);
  assert.equal(chamber.groups.reduce((n, g) => n + g.seats, 0) + chamber.nonAttached, chamber.occupied);
  assert.equal(chamber.occupied + chamber.vacant, chamber.capacity);
  assert.equal(new URL(chamber.source.url).hostname, 'www2.assemblee-nationale.fr');
  const html = await (await fetch(base + '/partis.html')).text();
  assert.equal((html.match(/<circle /g) || []).length, chamber.capacity);
  assert.equal((html.match(/class="party-card"/g) || []).length, parties.length);
  assert.ok(html.includes('Un parti n’est pas un groupe parlementaire'));
  assert.ok(html.includes('2 novembre 2026'));
});
test('chaque courant présente ses influences sans inventer une filiation personnelle', async () => {
  for (const [key, family] of Object.entries(families)) {
    const philosophy = family.philosophy;
    assert.ok(philosophy.frame && philosophy.caution && philosophy.references.length >= 2);
    for (const id of philosophy.references) assert.ok(academicReferences[id]);
    if (key === 'personal') assert.equal(philosophy.thinkers.length, 0);
    else assert.ok(philosophy.thinkers.length >= 2);
    const html = await (await fetch(base + `/famille-${key}.html`)).text();
    assert.ok(html.includes('Influences philosophiques et grands penseurs'));
    for (const [name] of philosophy.thinkers) assert.ok(html.includes(name));
  }
  const sources = await (await fetch(base + '/sources.html')).text();
  for (const key of ['remond','remond-actuel','julliard-gauches']) assert.ok(sources.includes(`id="ref-${key}"`));
});
