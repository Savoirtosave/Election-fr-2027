# Repères 2027

Première version d’un site indépendant d’information sur l’élection présidentielle française de 2027. Interface en français, responsive, sans ressources externes, cookies, suivi ou collecte de données.

## Démarrage

Node.js 22 ou ultérieur. Aucune dépendance à installer.

```sh
cd /workspace/Election-fr-2027
npm start
```

Le serveur utilise le port 3000 (`PORT` permet de le modifier). `npm test` lance les tests HTTP et éditoriaux. Pas de compilation : les fichiers de `public/` peuvent également être hébergés sur un hébergeur statique.

## État éditorial

L’annuaire contient **31 candidatures déclarées documentées au 2 novembre 2026**, avec une présentation factuelle, les sources consultées et une justification du classement lorsqu’il est suffisamment étayé. Ce suivi reste **non exhaustif** et ne constitue pas la liste officielle du Conseil constitutionnel. Les annonces, investitures de parti et validations officielles sont des étapes distinctes.

Les articles de RTL, franceinfo, BFMTV, du Figaro, du HuffPost, du Point, de RMC et de la presse régionale servent de sources de presse. Wikipédia a servi au repérage et au croisement des déclarations. Certains articles sont partiellement accessibles ou bloqués ; les fiches ne citent pas leur contenu inaccessible comme s’il avait été lu. Pour Bernard Cazeneuve, la date de l’annonce formelle est recoupée dans la synthèse Wikipédia ; l’extrait du Figaro accessible documente sa démarche antérieure et son parcours. Sa fiche rend cette limite explicite.

Quand la date exacte de déclaration n’a pas pu être confirmée, `declarationDateType: "reported"` signale que `declaredAt` est la date de l’article attestant la candidature, affichée comme « Candidature rapportée le ». `verifiedAt` est la date du contrôle documentaire, pas une garantie d’exhaustivité ou d’admission au scrutin. `coverage: "partial"` rend cette limite explicite. Les candidatures à une primaire ne sont pas automatiquement assimilées à des candidatures maintenues à la présidentielle.

Avant toute actualisation, contrôler les retraits, nouvelles investitures et décisions d’éligibilité. Les familles sont une synthèse éditoriale ; elles ne correspondent pas à une échelle scientifique mesurée. Les positions insuffisamment documentées ou qui traversent les catégories restent « classement non établi ».

## Ajouter une fiche vérifiée

Modifier `public/data.json`. `verifiedAt` global est la date du dernier contrôle de l’ensemble de la liste ; ne le renseigner qu’après ce contrôle documentaire et conserver `coverage: "partial"` tant que l’exhaustivité n’est pas établie. Chaque entrée de `candidates` doit contenir :

- `name`, `party`, `family` : l’une de `radical`, `left`, `green`, `centre`, `right`, `far-right`, `unclassified` ;
- `rationale` : justification spécifique, nuancée et sourcée du classement ;
- `biography` : présentation factuelle de quelques lignes (parcours et fonctions, sans argumentaire électoral), étayée par les sources ;
- `declaredAt` : date ISO de l’annonce explicite de candidature ; si seul un article confirme la candidature sans dater précisément l’annonce, utiliser sa date et ajouter `declarationDateType: "reported"` ;
- `verifiedAt` : date ISO du contrôle ;
- `sources` : objets `{ "label": "Titre, éditeur et date", "url": "https://…" }`, incluant annonce explicite, confirmation journalistique et références du classement.

N’inclure dans cette liste que des candidatures déclarées encore actives, vérifiées. Les candidatures retirées et les hypothèses ne doivent pas être comptées comme actives. Ne pas attribuer automatiquement à une personne le score de son parti. Après vérification, adapter aussi les mentions d’état dans `public/index.html` pour refléter précisément la couverture obtenue ; ne jamais annoncer l’exhaustivité sans contrôle.
