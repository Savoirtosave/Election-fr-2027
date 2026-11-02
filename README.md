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
- `public/familles.html` : panorama des six familles et des courants transversaux.
- `public/famille-*.html` : dix dossiers autonomes (origines, dimensions, débats et références), dont un dossier explicitement consacré aux limites de la catégorie personnelle hors axe.
- `public/election.html` : fonctionnement du scrutin, présentations d’élus, deux tours, suffrages exprimés, campagne et contrôles.
- `public/sources.html` : méthode, seize références scientifiques ou de recherche et six sources institutionnelles.

Les contenus des dossiers sont dans `public/families.js`, la bibliographie et les références officielles dans `public/references.js`, les fragments éditoriaux dans `site/`. Le gabarit commun et la génération des quinze pages sont dans `scripts/build-pages.mjs`. Après modification de ces sources ou du nombre de candidatures :

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
