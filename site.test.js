import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { server } from './server.js';
import { families } from './public/families.js';

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
after(() => server.close());
test('le site sert la navigation, les familles et la méthode', async () => {
  const res = await fetch(base); assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
  const html = await res.text();
  for (const id of ['candidats', 'familles', 'methode', 'references']) assert.ok(html.includes(`id="${id}"`));
  assert.match(html, /Lipset/); assert.match(html, /Mudde/); assert.match(html, /Suivi non exhaustif/);
  assert.doesNotMatch(html, /Aucun nom publié à ce stade|Annuaire non encore vérifié/);
});
test('les ressources locales sont servies avec le bon type', async () => {
  for (const [path, type] of [['/app.js','javascript'], ['/style.css','css'], ['/data.json','json']]) {
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
  const html = await (await fetch(base)).text();
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
