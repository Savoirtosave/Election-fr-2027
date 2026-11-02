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
const candidateData = JSON.parse(await readFile(new URL('./public/data.json', import.meta.url), 'utf8'));
const pages = [...candidateData.candidates.map(c => `candidat-${c.id}.html`), 'index.html', 'candidats.html', 'familles.html', 'election.html', 'sources.html', 'partis.html', 'contexte.html', ...parties.map(p => `parti-${p.id}.html`), ...Object.keys(families).map(key => `famille-${key}.html`)];

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
    for (const file of ['candidats.html','partis.html','familles.html','election.html','contexte.html','sources.html']) assert.ok(nav.includes(`href="./${file}"`), path);
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
      if (['/context-data.json','/contexte.csv'].includes(url.pathname)) {
        const asset = await fetch(url.href); assert.equal(asset.status, 200, url.pathname); continue;
      }
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

test('les partis ont une histoire, des thèmes sourcés et des lectures historiques', async () => {
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
      assert.ok(party.issues[key].summary);
      assert.equal(party.issues[key].status === 'pending', party.issues[key].sourceIds.length === 0);
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

test('les logos locaux couvrent les partis et respectent les affiliations actuelles', async () => {
  const { partyLogos } = await import('./public/party-logos.js');
  for (const party of parties) assert.ok(partyLogos[party.id], party.id);
  for (const [id, logo] of Object.entries(partyLogos)) {
    assert.match(logo.source, /^https:\/\//, id);
    assert.match(logo.src, /^\.\/logos\/[a-z-]+\.(svg|png|webp)$/, id);
    const response = await fetch(base + '/' + logo.src.slice(2));
    assert.equal(response.status, 200, id);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.ok(bytes.length > 100, id);
    if (logo.src.endsWith('.svg')) {
      assert.match(bytes.toString(), /<svg\b/);
      assert.doesNotMatch(bytes.toString(), /<script\b|<foreignObject\b|(?:href|src)=["']https?:/i);
    } else if (logo.src.endsWith('.png')) assert.equal(bytes.subarray(1,4).toString(), 'PNG');
    else assert.equal(bytes.subarray(8,12).toString(), 'WEBP');
  }
  const data = JSON.parse(await readFile(new URL('./public/data.json', import.meta.url), 'utf8'));
  for (const c of data.candidates) for (const id of c.logoIds) assert.ok(partyLogos[id], c.name);
  assert.deepEqual(data.candidates.find(c => c.name === 'Olivier Becht').logoIds, []);
  assert.deepEqual(data.candidates.find(c => c.name === 'Selma Labib').logoIds, ['npa-r']);
  assert.deepEqual(data.candidates.find(c => c.name === 'Xavier Bertrand').logoIds, ['nous-france', 'lr']);
});


test('les profils individuels distinguent l’ébauche personnelle des positions du parti', async () => {
  const { candidateDrafts } = await import('./public/candidate-programmes.js');
  const ids = new Set();
  for (const c of candidateData.candidates) {
    assert.match(c.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(!ids.has(c.id)); ids.add(c.id);
    assert.ok(candidateDrafts[c.id]);
    assert.ok(c.sources[candidateDrafts[c.id].sourceIndex]);
    const html = await (await fetch(base + `/candidat-${c.id}.html`)).text();
    for (const anchor of ['profil', 'programme', 'sources-candidat']) assert.ok(html.includes(`id="${anchor}"`));
    assert.ok(html.includes('Ébauche évolutive'));
    for (const id of c.partyIds) {
      assert.ok(parties.some(p => p.id === id));
      assert.ok(html.includes(`./parti-${id}.html`));
      assert.ok(html.includes('pas automatiquement des engagements personnels'));
    }
    if (c.affiliationKind === 'independent') assert.equal(c.partyIds.length, 0);
  }
  const directory = await (await fetch(base + '/partis.html')).text();
  assert.ok(directory.includes('id="sans-parti"'));
  for (const c of candidateData.candidates) assert.ok(directory.includes(`./candidat-${c.id}.html`), c.name);
  for (const p of parties) {
    const html = await (await fetch(base + `/parti-${p.id}.html`)).text();
    assert.ok(html.includes('id="candidats-parti"'));
    assert.doesNotMatch(html, /Rémond|Julliard/);
    assert.match(html, /representation-compact/);
    for (const c of candidateData.candidates.filter(c => c.partyIds.includes(p.id))) assert.ok(html.includes(`./candidat-${c.id}.html`));
  }
  const noParty = candidateData.candidates.filter(c => c.affiliationKind === 'independent');
  assert.ok(noParty.some(c => c.name === 'Olivier Becht'));
  assert.ok(!noParty.some(c => c.name === 'Bernard Cazeneuve' || c.name === 'Francis Lalanne'));
});


test('le contexte conserve les définitions, périodes, sources et calculs officiels', async () => {
  const context = await (await fetch(base + '/context-data.json')).json();
  assert.equal(context.asOf, '2026-11-02');
  assert.deepEqual(context.countries.map(c=>c.id), ['FR','DE','ES','IT']);
  assert.equal(context.metrics.length,17);
  assert.equal(new Set(context.metrics.map(m=>m.id)).size,17);
  const html = await (await fetch(base + '/contexte.html')).text();
  for(const id of ['comparer','finances','emploi','croissance','ecole','population','partage','sources-contexte']) assert.ok(html.includes(`id="${id}"`));
  for(const metric of context.metrics){
    assert.equal(metric.observations.length,4,metric.id);
    assert.ok(metric.definition && metric.reading && metric.unit && metric.period);
    assert.ok(html.includes(`id="definition-${metric.id}"`));
    for(const point of metric.observations){
      assert.ok(Number.isFinite(point.value));
      assert.equal(point.period,metric.period);
      assert.ok(context.countries.some(c=>c.id===point.country));
    }
    for(const id of metric.sourceIds){
      const source=context.sources[id];assert.ok(source,id);
      assert.equal(new URL(source.url).protocol,'https:');
      if(source.updated)assert.ok(source.updated.slice(0,10)<=context.asOf);
    }
  }
  const shares=context.metrics.find(m=>m.id==='labour-share');
  for(const o of shares.observations){
    assert.equal(o.components.length,2);
    assert.equal(o.numerator,o.components.reduce((n,c)=>n+c.compensation,0));
    assert.equal(o.denominator,o.components.reduce((n,c)=>n+c.netValueAdded,0));
    assert.ok(Math.abs(o.value-100*o.numerator/o.denominator)<1e-10);
  }
  assert.equal(Number(shares.observations.find(o=>o.country==='FR').value.toFixed(1)),81.6);
  assert.ok(context.metrics.find(m=>m.id==='balance').observations.find(o=>o.country==='FR').value<0);
  assert.ok(html.includes('pas un classement mondial'));
  assert.ok(html.includes('cotisations sociales imputées'));
  const csv=await fetch(base+'/contexte.csv');assert.match(csv.headers.get('content-type'),/text\/csv/);
  const csvLines=(await csv.text()).trim().split(/\r?\n/);
  assert.equal(csvLines.length,69);
  const exported=csvLines.slice(1).map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:;|$)/g)].map(match=>match[1].replaceAll('""','"')));
  for(const metric of context.metrics) for(const point of metric.observations){
    const country=context.countries.find(c=>c.id===point.country).name;
    const row=exported.find(row=>row[0]===metric.title && row[2]===country);
    assert.ok(row,metric.id+'/'+country);assert.equal(row[1],metric.period);
    assert.equal(Number(row[3].replace(',','.')),point.value);assert.equal(row[4],metric.unit);assert.equal(row[5],point.flag);
  }
  const verified=execFileSync(process.execPath,['scripts/update-context.mjs','--check'],{cwd:new URL('.',import.meta.url),encoding:'utf8'});
  assert.match(verified,/17 indicateurs de contexte vérifiés/);
});

test('chaque parti et candidat possède les six dossiers internationaux sans transfert implicite',async()=>{
  const data=JSON.parse(await readFile(new URL('./public/international-data.json',import.meta.url),'utf8'));
  assert.equal(Object.keys(data.parties).length,25);assert.equal(Object.keys(data.candidates).length,31);
  assert.equal(Object.keys(data.topics).length,6);
  for(const [kind,entities] of Object.entries({parties:data.parties,candidates:data.candidates})){
    for(const [id,entity] of Object.entries(entities)){
      const path=kind==='parties'?`parti-${id}.html`:`candidat-${id}.html`;
      const html=await(await fetch(base+'/'+path)).text();
      assert.equal((html.match(/id="international"/g)||[]).length,1,path);
      for(const topic of Object.keys(data.topics))assert.ok(html.includes(`id="intl-${topic}"`),path+'/'+topic);
      for(const [topic,position] of Object.entries(entity.positions)){
        assert.ok(data.topics[topic]);assert.ok(position.summary && position.text && position.sourceIds.length);
        for(const sid of position.sourceIds){assert.ok(data.sources[sid]);assert.equal(new URL(data.sources[sid].url).protocol,'https:');}
      }
      assert.ok(entity.reviewedSourceIds.length);
      for(const sid of entity.reviewedSourceIds)assert.ok(data.sources[sid]);
    }
  }
  assert.ok(data.parties.lfi.positions.nato.summary.includes('Sortir'));
  assert.ok(data.parties.dlf.positions.nato.summary.includes('commandement intégré'));
  assert.ok(data.candidates['bruno-retailleau'].positions.nato.summary.includes('Rester'));
  assert.ok(!data.candidates['xavier-bertrand'].positions.nato,'Ne pas copier la position de LR sur un autre candidat');
  assert.ok(!data.candidates['marine-tondelier'].positions.china,'Ne pas attribuer automatiquement le programme collectif');
});


test('les repères parlementaires individuels décrivent le scrutin et sa portée',async()=>{
  const audit=JSON.parse(await readFile(new URL('./data/international/vote3461.json',import.meta.url),'utf8'));
  const international=JSON.parse(await readFile(new URL('./public/international-data.json',import.meta.url),'utf8'));
  assert.equal(audit.uid,'VTANR5L16V3461');assert.equal(audit.votes.length,6);
  for(const vote of audit.votes){
    const item=international.candidates[vote.candidateId].positions.ukraine;
    assert.equal(item.status,'dated');assert.ok(item.sourceIds.includes('assemblee-3461'));
    assert.match(item.text,/12 mars 2024/);
    assert.match(item.text,/ne permet pas de déduire/);
  }
  assert.ok(international.candidates['olivier-becht'].positions.ukraine.summary.includes('Vote pour'));
  assert.ok(international.candidates['marine-le-pen'].positions.ukraine.summary.includes('Abstention'));
  assert.ok(international.candidates['francois-ruffin'].positions.ukraine.summary.includes('Vote contre'));
});

test('les familles disposent de repères visuels, de dossiers reliés et de sources explicites',async()=>{
  const { familyVisuals }=await import('./public/family-visuals.js');
  const directory=await(await fetch(base+'/familles.html')).text();
  assert.equal((directory.match(/class="family-browser-card"/g)||[]).length,10);
  assert.ok(directory.includes('families-app.js'));
  for(const id of ['family-search','family-kind','family-sort','family-grid-view','family-list-view'])assert.ok(directory.includes(`id="${id}"`));
  for(const [key,f]of Object.entries(families)){
    assert.ok(familyVisuals[key]?.paths && familyVisuals[key]?.motif);
    const html=await(await fetch(base+`/famille-${key}.html`)).text();
    for(const anchor of ['idees','histoire','penseurs','partis','candidatures','sources-famille'])assert.ok(html.includes(`id="${anchor}"`));
    for(const p of parties.filter(p=>p.family===key))assert.ok(html.includes(`./parti-${p.id}.html`));
    for(const c of candidateData.candidates.filter(c=>c.family===key))assert.ok(html.includes(`./candidat-${c.id}.html`));
  }
  assert.ok(directory.includes('pas des emblèmes officiels'));
});

test('Nemo est cité lorsque ses repères sont utilisés, sans attribution automatique aux partis',async()=>{
  const { nemoReadings,nemoChapters }=await import('./public/nemo-readings.js');
  const ref=academicReferences['nemo-modern'];
  assert.match(ref.title,/Histoire des idées politiques aux Temps modernes et contemporains/);
  assert.match(ref.publication,/978-2-13-062733-3/);
  assert.match(ref.consultation,/accès conditionnel/);
  for(const [key,reading]of Object.entries(nemoReadings)){
    assert.ok(families[key].references.includes('nemo-modern'));
    for(const chapter of reading.chapters)assert.ok(nemoChapters[chapter]);
    const html=await(await fetch(base+`/famille-${key}.html`)).text();
    assert.ok(html.includes('id="lecture-nemo"'));
    assert.ok(html.includes('./sources.html#ref-nemo-modern'));
  }
  for(const p of parties.filter(p=>nemoReadings[p.family])){
    assert.ok(p.academicRefs.includes('nemo-modern'));
    const html=await(await fetch(base+`/parti-${p.id}.html`)).text();
    assert.ok(html.includes('./sources.html#ref-nemo-modern'));
    assert.ok(html.includes('ne prouvent pas une filiation revendiquée'));
  }
  assert.ok(!nemoReadings.personal && !nemoReadings.animalist && !nemoReadings.green);
});

test('tous les penseurs ont des portraits identifiés, locaux et crédités',async()=>{
  const {thinkerPortraits,thinkerPortraitGroups}=await import('./public/thinker-portraits.js');
  assert.equal(Object.keys(thinkerPortraits).length,38);
  for(const family of Object.values(families)) for(const [name]of family.philosophy.thinkers){
    const group=thinkerPortraitGroups[name];assert.ok(group?.length,name);
    for(const person of group)assert.ok(thinkerPortraits[person],person);
  }
  for(const p of Object.values(thinkerPortraits)){
    assert.ok(p.credit&&p.license&&p.kind,p.name);
    assert.equal(new URL(p.source).protocol,'https:');
    if(p.license.startsWith('CC '))assert.match(p.licenseUrl,/^https:\/\//);
    const response=await fetch(base+'/'+p.src.slice(2));assert.equal(response.status,200,p.name);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(p.src.endsWith('.png'))assert.equal(bytes.subarray(1,4).toString(),'PNG');
    else assert.equal(bytes.readUInt16BE(0),0xffd8,p.name);
  }
  const source=thinkerPortraits['Sue Donaldson'].source;
  assert.ok(source.includes('writersunion.ca'),'Ne pas confondre l’autrice avec l’élue de Seattle');
  const rosa=thinkerPortraits['Rosa Luxemburg'];assert.ok(rosa.credit.includes('183-14077-006'));
  assert.ok(thinkerPortraits['Hans Jonas'].credit.includes('Regina Kühne'));
  for(const [key,f]of Object.entries(families)){
    const html=await(await fetch(base+`/famille-${key}.html`)).text();
    const names=new Set(f.philosophy.thinkers.flatMap(([name])=>thinkerPortraitGroups[name]));
    assert.equal((html.match(/class="thinker-photo"/g)||[]).length,names.size);
    for(const name of names)assert.ok(html.includes(thinkerPortraits[name].src));
  }
});

test('les symboles sont légendés et la diversité bibliographique est mise en avant',async()=>{
  const {familyVisuals}=await import('./public/family-visuals.js');
  const directory=await(await fetch(base+'/familles.html')).text();
  for(const visual of Object.values(familyVisuals))assert.ok(directory.includes(visual.label));
  for(const file of ['sources.html','familles.html',...Object.keys(families).map(key=>`famille-${key}.html`)]){
    const html=await(await fetch(base+'/'+file)).text();
    assert.match(html,/class="bibliography-scope/);
    assert.ok(html.includes('Nemo, Julliard et Rémond ne sont qu’une partie des auteurs mobilisés.'));
  }
});
