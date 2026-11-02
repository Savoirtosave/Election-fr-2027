# Repères 2027

Site indépendant d’information sur l’élection présidentielle française de 2027. Interface en français, responsive, sans requêtes externes au chargement, cookies, suivi ou collecte de données.

## Démarrage

Node.js 22 ou ultérieur. Aucune dépendance à installer.

```sh
cd /workspace/Election-fr-2027
npm start
```

Le serveur utilise le port 3000 (`PORT` permet de le modifier). `npm test` lance les contrôles de génération, de navigation, de références, de contenu et de ressources HTTP. Les pages HTML sont déjà générées et versionnées : aucune compilation n’est nécessaire pour lancer le site ou utiliser Live Server sur `public/index.html`. Les fichiers de `public/` peuvent être hébergés sur un hébergeur statique.

## Pages et édition

- `public/index.html` : accueil, avec des liens vers les rubriques.
- `public/candidats.html` : annuaire et filtres ; les explications ouvrent aussi les dossiers de lecture.
- `public/partis.html` et `public/parti-*.html` : annuaire de 25 formations et fiches détaillées (histoire, fondements, quatre thèmes, sources et contexte parlementaire).
- `public/familles.html` : panorama des six familles et des courants transversaux.
- `public/famille-*.html` : dix dossiers autonomes (origines, dimensions, débats et références), dont un dossier explicitement consacré aux limites de la catégorie personnelle hors axe.
- `public/election.html` : fonctionnement du scrutin, parrainages d’élus, deux tours, suffrages exprimés, campagne et contrôles.
- `public/sources.html` : méthode, 27 références scientifiques ou de recherche et sept sources institutionnelles.

Les contenus des dossiers sont dans `public/families.js`, la bibliographie et les références officielles dans `public/references.js`, les fragments éditoriaux dans `site/`. Les fiches des partis sont décrites dans `public/parties.js` et l’instantané officiel des groupes dans `public/parliament.json`. Le gabarit commun et la génération des 41 pages sont dans `scripts/build-pages.mjs` et `scripts/render-parties.mjs`. Après modification de ces sources ou du nombre de candidatures :

```sh
npm run build
npm test
```

Versionner les sources et les HTML générés ensemble. Les tests utilisent aussi `node scripts/build-pages.mjs --check` pour détecter des pages périmées. Cette génération utilise uniquement les modules natifs de Node.js. Les pages de lecture et les sources restent consultables sans JavaScript ; l’annuaire interactif nécessite JavaScript. Les anciens favoris `index.html#candidats`, `#familles`, `#methode` et `#references` sont redirigés vers les nouvelles pages.

Les références scientifiques éclairent des traditions et des concepts, sans établir à elles seules le classement d’un candidat. Les références institutionnelles distinguent les textes en vigueur et les archives pédagogiques de 2022 : les anciennes dates de scrutin ne sont pas réutilisées pour 2027.

## État éditorial

L’annuaire contient **31 candidatures déclarées documentées au 2 novembre 2026**, avec un portrait local, une présentation factuelle, les sources consultées et un classement expliqué. Cliquer sur l’étiquette politique d’une fiche ouvre sa définition et la justification propre au candidat, également accessible au clavier avec Entrée ou Espace. Ce suivi reste **non exhaustif** et ne constitue pas la liste officielle du Conseil constitutionnel. Les annonces, investitures de parti et validations officielles sont des étapes distinctes.

Les articles de RTL, franceinfo, BFMTV, du Figaro, du HuffPost, du Point, de RMC et de la presse régionale servent de sources de presse. Wikipédia a servi au repérage et au croisement des déclarations. Certains articles sont partiellement accessibles ou bloqués ; les fiches ne citent pas leur contenu inaccessible comme s’il avait été lu. Pour Bernard Cazeneuve, la date de l’annonce formelle est recoupée dans la synthèse Wikipédia ; l’extrait du Figaro accessible documente sa démarche antérieure et son parcours. Sa fiche rend cette limite explicite.

Quand la date exacte de déclaration n’a pas pu être confirmée, `declarationDateType: "reported"` signale que `declaredAt` est la date de l’article attestant la candidature, affichée comme « Candidature rapportée le ». `verifiedAt` est la date du contrôle documentaire, pas une garantie d’exhaustivité ou d’admission au scrutin. `coverage: "partial"` rend cette limite explicite. Les candidatures à une primaire ne sont pas automatiquement assimilées à des candidatures maintenues à la présidentielle.

Avant toute actualisation, contrôler les retraits, nouvelles investitures et décisions d’éligibilité. Les familles sont une synthèse éditoriale ; elles ne correspondent pas à une échelle scientifique mesurée. Les six familles classiques sont complétées par des repères souverainiste, citoyen/constituant, animaliste et personnel hors axe. Ces derniers ne sont pas présentés comme des familles scientifiques ni comme des positions univoques à gauche ou à droite. Chaque candidature a un repère principal et une justification individualisée. Les définitions communes se trouvent dans `public/families.js`.

## Ajouter une fiche vérifiée

Modifier `public/data.json`. `verifiedAt` global est la date du dernier contrôle de l’ensemble de la liste ; ne le renseigner qu’après ce contrôle documentaire et conserver `coverage: "partial"` tant que l’exhaustivité n’est pas établie. Chaque entrée de `candidates` doit contenir :

- `name`, `party`, `family` : l’une de `radical`, `left`, `green`, `centre`, `right`, `far-right`, `sovereign`, `democracy`, `animalist`, `personal` ;
- `rationale` : justification spécifique, nuancée et sourcée du classement ;
- `biography` : présentation factuelle de quelques lignes (parcours et fonctions, sans argumentaire électoral), étayée par les sources ;
- `declaredAt` : date ISO de l’annonce explicite de candidature ; si seul un article confirme la candidature sans dater précisément l’annonce, utiliser sa date et ajouter `declarationDateType: "reported"` ;
- `verifiedAt` : date ISO du contrôle ;
- `sources` : objets `{ "label": "Titre, éditeur et date", "url": "https://…" }`, incluant annonce explicite, confirmation journalistique et références du classement.

N’inclure dans cette liste que des candidatures déclarées encore actives, vérifiées. Les candidatures retirées et les hypothèses ne doivent pas être comptées comme actives. Ne pas attribuer automatiquement à une personne le score de son parti. Après vérification, adapter aussi les mentions éditoriales dans les sources de `site/` et le gabarit, puis exécuter `npm run build` pour refléter précisément la couverture obtenue ; ne jamais annoncer l’exhaustivité sans contrôle.

## Portraits et crédits

Les 31 portraits sont servis depuis `public/portraits/` : aucune requête vers un service d’images externe n’est nécessaire à l’affichage. `photo` dans `public/data.json` conserve le fichier local, la page source, l’auteur/crédit, le statut de licence, le lien de licence lorsqu’il existe et l’URL du fichier d’origine. Les crédits sont accessibles dans « Sources et crédit photo » sur chaque fiche et dans `public/portraits/CREDITS.md`.

Une partie des images provient de Wikimedia Commons sous la licence indiquée ; d’autres proviennent de sites de campagne ou d’articles de presse et restent sous droits réservés. Un crédit ne les place pas sous licence libre. Les images de presse ne doivent pas être présumées librement réutilisables pour d’autres usages. Les portraits sont redimensionnés pour l’affichage ; les cadrages de Selma Labib et Benoît Mathieu sont réalisés en CSS à partir du visuel source identifié. Les originaux sont référencés pour conserver la provenance et les conditions applicables.

La date de contrôle documentaire reste dans les données ; elle n’est plus affichée au bas de chaque fiche. `npm test` vérifie notamment les portraits servis et les définitions de classification, en plus des contrôles HTTP et documentaires.

## Partis, groupes et courants intellectuels

L’annuaire des partis reprend les principes de mise en page du modèle indiqué (recherche, indicateurs, onglets, tri, cartes et liste), avec les logos des formations et les couleurs du site ; il ne réutilise pas ses logos, ses données brésiliennes ou ses numéros de partis. La sélection de 25 formations françaises est un panorama non exhaustif. Les sources officielles des partis décrivent leurs propres orientations et sont distinguées des ouvrages de recherche et des articles de presse. Huit thèmes structurent la comparaison : économie, sécurité, immigration, écologie, fiscalité, logement, international et laïcité. Les thèmes non documentés sont indiqués explicitement. Les synthèses courtes et compléments sourcés se trouvent dans `public/party-positions.js`.

Les effectifs parlementaires proviennent du tableau officiel de l’Assemblée nationale, relevé le **2 novembre 2026** : **574 sièges pourvus**, dont **563 dans 11 groupes** et **11 non-inscrits**, plus **3 sièges vacants**, soit **577 sièges au total**. Les membres et apparentés sont conservés séparément. Les 577 points du schéma comptent chaque siège une fois ; ce dessin ne reproduit pas le plan exact des places.

Un groupe peut accueillir plusieurs partis : les effectifs de groupe affichés sur les fiches ne sont pas des effectifs propres aux partis et ne doivent pas être additionnés entre fiches. Le tableau officiel ne permet pas de déduire partout les adhésions individuelles ; une absence de groupe propre n’est donc jamais automatiquement convertie en zéro député. Le périmètre est l’Assemblée nationale, pas l’ensemble des mandats électifs. Pour actualiser le relevé, vérifier le tableau source, la date et chaque effectif dans `public/parliament.json`, puis régénérer les pages et exécuter les tests.

Les influences philosophiques et les penseurs sont décrits dans `families[key].philosophy`. Les lectures centrales sont **Les Droites en France** (1982) et **Les Droites aujourd’hui** (2005) de René Rémond, **Les Gauches françaises, 1762–2012** (2012) et **Fernand Pelloutier et les origines du syndicalisme d’action directe** (1971) de Jacques Julliard. De nombreux autres auteurs et travaux ont également été consultés et sont détaillés dans la bibliographie. Les typologies historiques et les références philosophiques ne sont pas transposées mécaniquement aux partis contemporains. Le repère personnel hors axe n’est doté d’aucune généalogie philosophique inventée.

L’annuaire et le tableau parlementaire sont disponibles sans JavaScript. `parties-app.js` ajoute la recherche, les filtres par famille et groupe, les tris, les vues cartes/liste et les onglets utilisables au clavier. Les profils détaillés et les dossiers de courants restent statiques.


### Profils et programmes en ébauche

Chaque candidat possède une page statique `public/candidat-<id>.html`, accessible depuis son portrait, son nom et le lien « Profil et programme ». `public/data.json` conserve un identifiant stable, les affiliations actuelles (`partyIds`) et leur nature (`affiliationKind` : parti, mouvement, soutien ou indépendant). Les logos ne servent pas à inférer une adhésion. Les partis affichent leurs candidatures suivies ; le bas de l’annuaire distingue les indépendants des autres mouvements.

`public/candidate-programmes.js` contient les synthèses personnelles et l’index de la source de presse utilisée dans la fiche. Elles sont séparées des positions collectives du parti. Les textes de 2024, manifestes et programmes de préparation ne sont pas assimilés à des engagements présidentiels personnels de 2027. À mesure des publications, compléter les huit sujets, la date, la portée et le chiffrage, avec une source précise, puis lancer `npm run build` et `npm test`. Les pages générées sont versionnées afin de rester accessibles avec Go Live sans étape de compilation.


## Politique internationale et contexte du scrutin

Chaque dossier de parti et chaque profil individuel comporte un encart international à six rubriques : OTAN, Ukraine, Russie, Chine/Indo-Pacifique, Israël/Palestine et doctrine diplomatique. `public/international-data.json` sépare les positions personnelles des textes collectifs, conserve leurs sources et leurs dates et distingue les repères anciens. Un dossier non renseigné reste « à documenter » : il ne vaut ni neutralité ni absence de toute prise de position. Le vote de mars 2024 sur la déclaration franco-ukrainienne est sourcé dans le scrutin n°3461 ; l’extrait de vérification est dans `data/international/vote3461.json`. Ce vote ne porte pas séparément sur chaque forme d’aide.

La page `public/contexte.html` compare la France, l’Allemagne, l’Espagne, l’Italie, la Belgique, le Danemark et les Pays-Bas avec des séries Eurostat, des repères Insee et les profils Education GPS de l’OCDE consultés au 2 novembre 2026. Les périodes de référence, unités et drapeaux sont conservés dans `public/context-data.json` et dans l’export `public/contexte.csv`. Les tableaux statiques restent accessibles sans JavaScript ; `public/context-app.js` ajoute le comparateur interactif sans requête vers un service tiers.

Les réponses Eurostat archivées sont dans `data/context/eurostat/`, les notes et URL des sources dans `data/context/sources.json`, et les extractions PISA dans `data/context/pisa.json`. Pour actualiser, consulter les URL d’API, vérifier les codes (âge, unité, secteur, opération), remplacer les réponses officielles et revoir les périodes et commentaires dans `scripts/update-context.mjs`. Puis exécuter `node scripts/update-context.mjs`, `npm run build` et `npm test`. Le mode `node scripts/update-context.mjs --check` vérifie la reproductibilité des chiffres publiés.

Le partage de valeur évoqué dans la capture d’Eric Dor est recalculé : 100 × rémunération D1 versée par les sociétés S11 + S12 / leur valeur ajoutée nette B1N. Il inclut les cotisations patronales, exclut l’usure du capital du dénominateur et ne se confond ni avec le salaire net, ni avec le PIB, ni avec le pouvoir d’achat. Le rang est présenté uniquement parmi les sept pays étudiés. Le compte X a été consulté, sans retrouver le message précis dans les publications visibles.

Le classement PISA est également limité explicitement au panel de sept pays. Les profils OCDE accessibles présentent le cycle 2025 ; les scores mathématiques 2022 sont reconstruits à partir des scores 2025 et des variations publiées dans ces profils. Les valeurs arrondies et les intervalles d’incertitude limitent la portée des rangs et de cette reconstruction.


## Familles politiques et Philippe Nemo

L’annuaire `public/familles.html` reprend les outils de celui des partis : recherche par famille, penseur, idée, parti ou candidat ; filtre par type de dossier ; tri ; vues en cartes et en liste. Les six familles, trois courants transversaux et la limite du classement personnel restent explicitement distingués. Les pictogrammes de `public/family-visuals.js` sont issus de Lucide (licence ISC conservée dans `public/icons/families/LICENSE.txt`), accompagnés de libellés explicites. Ce sont des repères éditoriaux, sans valeur d’emblèmes officiels.

Les dix dossiers relient trois dimensions d’analyse à l’histoire, aux penseurs, aux partis (avec logos), aux candidats et aux sources. `scripts/render-families.mjs` génère ces pages ; `public/families-app.js` améliore les filtres sans empêcher la lecture statique avec Go Live ou sans JavaScript.

Philippe Nemo, *Histoire des idées politiques aux Temps modernes et contemporains*, PUF, « Quadrige », édition 2013 [première édition 2002], ISBN 9782130627333, DOI 10.3917/puf.nemo.2013.01, figure dans `public/references.js`. `public/nemo-readings.js` indique les chapitres pertinents et leur pagination vérifiée dans le sommaire. La notice, la présentation, le sommaire et les extraits accessibles de huit chapitres ont été consultés ; cela ne constitue pas une lecture intégrale de l’ouvrage en accès conditionnel. Les autres liens de chapitres sont des pistes de lecture identifiées dans le sommaire.

La perspective libérale de Nemo est mise en regard des autres historiens et des travaux contemporains. Elle éclaire notamment souveraineté, État de droit, libertés, socialismes et justice ; elle n’est pas une grille automatique de classement des partis. Ses repères sont ajoutés aux familles et aux fiches partisanes pertinentes. L’écologie, l’animalisme et le repère personnel conservent leurs sources spécifiques ; une filiation avec Nemo n’est pas inventée pour remplir une rubrique.


### Portraits des penseurs et visibilité de la bibliographie

Les 38 personnes citées dans les cartes de penseurs ont un portrait local dans `public/thinkers/`. Le registre `public/thinker-portraits.js` associe chaque personne au fichier, à la source, au crédit, à la licence et au cadrage. Les fiches réunissant deux auteurs montrent deux portraits avec deux noms. Les photographies et les portraits peints ou gravés sont identifiés et traités avec le même cadre neutre, le même ratio et le même filtre CSS noir et blanc, sans couleur liée au courant politique. Les fichiers téléchargés restent inchangés ; les crédits indiquent le traitement d’affichage.

Les images proviennent de Wikimedia Commons, sauf le portrait de Sue Donaldson, identifié sur son profil de The Writers’ Union of Canada, avec la mention de droits réservés. Il ne faut pas le remplacer par le portrait de son homonyme politique de Seattle. Les attributions requises sont conservées, notamment celles des archives fédérales allemandes pour Rosa Luxemburg et de Regina Kühne / Universitätsarchiv St.Gallen pour Hans Jonas. Les sources et licences sont accessibles dans chaque carte et dans la page Sources ; `public/thinkers/CREDITS.md` en conserve une copie.

`scripts/render-bibliography-scope.mjs` produit l’encart commun, volontairement visible, indiquant que Nemo, Julliard et Rémond ne sont qu’une partie des auteurs mobilisés. Il est affiché sur l’annuaire, les dix dossiers de familles et la page Sources, avec le nombre réel de références et un lien vers la bibliographie complète.

La page contexte couvre 37 indicateurs pour sept pays. Elle distingue le PIB par habitant de la productivité par emploi et par heure, et compare les minima légaux en euros et SPA. L’absence de minimum national en Italie et au Danemark est stockée comme valeur non applicable (`null`), jamais zéro. Les astérisques renvoient aux précisions affichées sous chaque tableau ou comparaison ; le CSV exporte ces précisions en toutes lettres.

Les pensions ESSPROS (régimes publics et privés), les dépenses publiques COFOG vieillesse/soutien aux proches après un décès et les projections du **2024 Ageing Report**, tableau I.1.6, sont des périmètres distincts. Les repères 2022, 2045 et 2070 sont conservés dans `data/context/pension-projections.json` ; le scénario publié en 2024 ne représente pas une prévision actualisée en 2026. Les règles nationales actuelles sont sourcées séparément. Les spécifications Eurostat et les extractions archivées permettent de recalculer les données avec `node scripts/update-context.mjs`, puis `npm run build` et `npm test`, sans réseau. Une actualisation des extractions exige de vérifier à nouveau périodes communes, définitions et statuts.
