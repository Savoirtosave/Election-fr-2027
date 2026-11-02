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

**L’annuaire n’est pas renseigné.** L’accès aux sources web était refusé lors de la création du site le 2 novembre 2026. L’absence de fiches n’indique pas l’absence de candidats. Aucun contrôle exhaustif des candidatures n’a été possible. Les autorisations réseau nécessaires ont été proposées dans la configuration de l’environnement.

Le site est une première structure fonctionnelle, pas un annuaire complet prêt à publier. Avant une publication publique, vérifier les déclarations et retraits à la date du contrôle, renseigner les fiches, documenter leurs familles politiques et faire une relecture éditoriale. Les références scientifiques fondent la méthode, pas des attributions individuelles encore non réalisées. Les familles sont une synthèse éditoriale et ne correspondent pas à une échelle scientifique mesurée.

## Ajouter une fiche vérifiée

Modifier `public/data.json`. `verifiedAt` global est la date du dernier contrôle de l’ensemble de la liste ; ne le renseigner qu’après ce contrôle. Chaque entrée de `candidates` doit contenir :

- `name`, `party`, `family` : l’une de `radical`, `left`, `green`, `centre`, `right`, `far-right`, `unclassified` ;
- `rationale` : justification spécifique, nuancée et sourcée du classement ;
- `verifiedAt` : date ISO du contrôle ;
- `sources` : objets `{ "label": "Titre, éditeur et date", "url": "https://…" }`, incluant annonce explicite, confirmation journalistique et références du classement.

N’inclure dans cette liste que des candidatures déclarées encore actives, vérifiées. Les candidatures retirées et les hypothèses ne doivent pas être comptées comme actives. Ne pas attribuer automatiquement à une personne le score de son parti. Après vérification, adapter aussi les mentions d’état dans `public/index.html` pour refléter précisément la couverture obtenue ; ne jamais annoncer l’exhaustivité sans contrôle.
