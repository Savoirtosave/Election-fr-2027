export const families = {
  radical: {
    label: 'Gauche radicale / révolutionnaire',
    definition: 'Courants qui cherchent une transformation profonde des rapports économiques et sociaux et contestent la domination du capital. La gauche radicale peut agir par les élections et les institutions ; les courants révolutionnaires visent une rupture avec le capitalisme. Ces stratégies ne sont pas équivalentes.',
    kind: 'family',
  },
  left: {
    label: 'Gauche sociale / sociale-démocrate',
    definition: 'Gauche attachée à la réduction des inégalités, aux services publics, aux droits sociaux et à la redistribution. Elle cherche des changements par des moyens démocratiques et institutionnels. Le degré de régulation du marché, de protectionnisme et d’intervention de l’État varie entre gauche sociale et social-démocratie.',
    kind: 'family',
  },
  green: {
    label: 'Écologie politique',
    definition: 'Tradition qui place les limites écologiques, le climat et le vivant au cœur des choix économiques et sociaux. Elle propose de transformer la production, la consommation et les modes de vie. Souvent située à gauche en France, elle comprend aussi des sensibilités qui revendiquent de dépasser cet axe.',
    kind: 'family',
  },
  centre: {
    label: 'Centre / centre droit réformiste',
    definition: 'Ensemble de courants favorables aux réformes graduelles, à l’économie de marché encadrée et au compromis institutionnel, souvent pro-européens. Les traditions libérales, sociales-libérales et démocrates-chrétiennes s’y croisent. Le centre droit y accorde davantage de place à l’initiative privée.',
    kind: 'family',
  },
  right: {
    label: 'Droite conservatrice / libérale',
    definition: 'Courants attachés à l’autorité de l’État, à la sécurité, à la continuité des institutions et/ou à la liberté économique. Les sensibilités conservatrices, libérales et gaullistes donnent des poids différents au marché, à la protection sociale et aux traditions.',
    kind: 'family',
  },
  'far-right': {
    label: 'Droite radicale / extrême droite',
    definition: 'La littérature sur la droite radicale populiste souligne le nativisme — la priorité accordée au groupe national —, l’autoritarisme et le populisme. L’extrême droite, au sens strict, se distingue par le rejet de la démocratie. Cette catégorie rassemble des courants différents : elle ne signifie pas que chaque candidat rejette la démocratie.',
    kind: 'family',
  },
  sovereign: {
    label: 'Souverainisme / républicanisme souverainiste',
    definition: 'Courants qui veulent rendre à la nation la maîtrise de ses décisions politiques, économiques et diplomatiques. Ils peuvent aller d’une réorientation de la construction européenne à la sortie de l’Union européenne ou de l’OTAN. C’est un repère transversal : il existe des souverainismes de gauche et de droite, qui ne partagent pas nécessairement un programme social.',
    kind: 'transversal',
  },
  democracy: {
    label: 'Démocratie citoyenne / constituante',
    definition: 'Démarches qui placent la transformation des institutions et l’intervention directe des citoyens au premier plan : référendum d’initiative citoyenne, assemblée constituante ou participation hors des partis traditionnels. Ce repère institutionnel ne détermine pas à lui seul une position de gauche ou de droite sur l’économie.',
    kind: 'transversal',
  },
  animalist: {
    label: 'Animalisme politique',
    definition: 'Courant qui fait de la protection des animaux et de la prise en compte de leurs intérêts une priorité politique : élevage, chasse, alimentation et statut juridique du vivant. Il croise l’écologie, mais ne s’y réduit pas et ne détermine pas automatiquement une position sur l’ensemble des sujets économiques et sociaux.',
    kind: 'transversal',
  },
  personal: {
    label: 'Hors axe — projet personnel ésotérique',
    definition: 'Repère descriptif pour une candidature fondée sur des références spirituelles ou ésotériques et un projet personnel, plutôt que sur une doctrine partisane structurée. Ce n’est pas une famille politique reconnue par la recherche. Il permet de décrire la démarche sans lui inventer une appartenance à la gauche ou à la droite.',
    kind: 'singular',
  },
};

// Dossiers de lecture : les références portent sur des concepts et des traditions,
// jamais sur une attribution automatique à une personne.
const guides = {
  radical: {
    question: 'Transformer le capitalisme, ou le dépasser ?',
    history: [
      'Cette famille se construit dans les conflits entre travail et capital et dans l’histoire du mouvement ouvrier. Elle réunit aujourd’hui des héritages communistes, des socialismes démocratiques et des organisations révolutionnaires. Le mot « radical » ne suffit donc pas à identifier une stratégie unique.',
      'Luke March distingue les recompositions de ces gauches après la fin de la guerre froide. Certaines participent aux élections et à des coalitions ; d’autres considèrent que les institutions existantes ne permettent pas la transformation recherchée. La critique du capitalisme et le rapport à la démocratie libérale doivent être examinés séparément.',
    ],
    dimensions: [
      ['Économie et travail', 'Redistribution, droits des salariés, services publics et formes de propriété collective occupent une place centrale. L’ampleur de la rupture avec le marché varie.'],
      ['Institutions et stratégie', 'Réformes électorales, mobilisation sociale, transformation constitutionnelle ou rupture révolutionnaire : les moyens ne sont pas interchangeables.'],
      ['Europe et écologie', 'Les positions vont de la transformation de l’Union européenne à la rupture avec ses règles ; les priorités écologiques ne sont ni absentes ni identiques dans tous les courants.'],
    ],
    debate: 'Ne pas confondre gauche radicale, gauche révolutionnaire et rejet de la démocratie. Une critique radicale de l’ordre économique ne prouve pas une hostilité au pluralisme ; celle-ci doit être documentée lorsqu’elle existe.',
    references: ['march', 'lipset-rokkan', 'benoit-laver'],
  },
  left: {
    question: 'Comment rendre l’économie compatible avec l’égalité sociale ?',
    history: [
      'La social-démocratie s’enracine dans le mouvement ouvrier et dans la conquête de droits par la participation démocratique. Au cours du XXe siècle, elle associe selon les pays économie de marché, négociation collective, protection sociale et intervention publique.',
      'Sheri Berman insiste sur la volonté de soumettre les forces économiques à des objectifs politiques et sociaux. Notre catégorie « gauche sociale / sociale-démocrate » est volontairement plus large : elle inclut aussi des sensibilités protectionnistes ou critiques du marché qui ne se reconnaissent pas dans toutes les évolutions de la social-démocratie.',
    ],
    dimensions: [
      ['Redistribution', 'Fiscalité, protection sociale et services publics sont des instruments de réduction des inégalités ; leurs niveaux et leurs modalités font débat.'],
      ['Réforme et représentation', 'Le changement est recherché dans un cadre pluraliste, par la loi, les élections et le dialogue social, sans que les mobilisations soient exclues.'],
      ['Ouverture économique', 'Libre-échange régulé, construction européenne ou protectionnisme social divisent cette famille : une même position économique ne peut pas être attribuée à tous ses membres.'],
    ],
    debate: 'La frontière avec la gauche radicale n’est pas une simple différence de ton. Elle dépend du programme de transformation, du rapport au marché et des alliances. À l’inverse, gouverner ne suffit pas à faire d’un parti un parti du centre.',
    references: ['berman', 'march', 'lipset-rokkan'],
  },
  green: {
    question: 'Que change le fait de prendre au sérieux les limites écologiques ?',
    history: [
      'L’écologie politique ne consiste pas seulement à ajouter une politique de l’environnement à un programme existant. Elle questionne les besoins, la production, l’énergie, les modes de vie et les responsabilités envers les générations futures et le vivant.',
      'Andrew Dobson distingue l’environnementalisme, qui cherche à limiter les dommages, d’une pensée écologiste qui peut remettre en cause des structures économiques et sociales. Les mouvements écologistes se sont souvent alliés à la gauche en France, mais cette histoire ne suffit pas à définir tout projet de sobriété comme un programme de gauche.',
    ],
    dimensions: [
      ['Production et ressources', 'Sobriété, transformation des infrastructures et réduction des atteintes au vivant sont des enjeux centraux. Les choix concernant la croissance et les techniques restent discutés.'],
      ['Justice', 'Qui supporte les coûts de la transition ? Les inégalités sociales et territoriales peuvent être articulées aux limites environnementales, avec des réponses différentes.'],
      ['Démocratie et échelle d’action', 'Participation locale, action de l’État et coopération internationale peuvent se compléter. Aucun mode de décision unique ne découle automatiquement de l’écologie.'],
    ],
    debate: 'Le nucléaire, la décroissance, le rapport aux entreprises ou les alliances distinguent fortement les écologistes. Une proposition environnementale isolée ne suffit pas à classer toute une candidature dans cette famille.',
    references: ['dobson', 'freeden', 'ches'],
  },
  centre: {
    question: 'Réformer par le compromis, mais autour de quelles valeurs ?',
    history: [
      'Le centre désigne une position dans un espace politique, mais aussi plusieurs traditions : libéralisme politique, démocratie chrétienne, réformisme social et sensibilités sociales-libérales. Son contenu dépend des pays, des époques et des coalitions.',
      'Avec Michael Freeden, on peut examiner l’articulation entre liberté, marché, solidarité et autorité plutôt que considérer le centre comme une absence d’idéologie. Le centre droit privilégie généralement davantage l’initiative privée ; d’autres sensibilités mettent plus fortement l’accent sur la régulation et la protection sociale.',
    ],
    dimensions: [
      ['Économie', 'Économie de marché, régulation publique et dispositifs de solidarité sont combinés dans des proportions variables. « Réformiste » ne décrit pas à lui seul le sens d’une réforme.'],
      ['Europe', 'La coopération et l’intégration européennes occupent souvent une place importante, sans rendre identiques les politiques budgétaires ou sociales proposées.'],
      ['Institutions', 'Le compromis parlementaire et les réformes graduelles sont des repères fréquents. Ils ne garantissent pas, par eux-mêmes, une pratique plus consensuelle du pouvoir.'],
    ],
    debate: 'Une moyenne entre la gauche et la droite n’est pas une définition suffisante. Un candidat peut être libéral sur l’économie, conservateur sur les valeurs et favorable à l’Europe : il faut rendre ces dimensions visibles.',
    references: ['freeden', 'benoit-laver', 'ches'],
  },
  right: {
    question: 'Comment articuler ordre, libertés économiques et continuité ?',
    history: [
      'Les droites ne forment pas un bloc historique unique. René Rémond distingue des traditions légitimiste, orléaniste et bonapartiste, qui éclairent des rapports différents à la monarchie, au libéralisme et à l’autorité. Cette lecture de l’histoire française n’est pas une correspondance automatique avec les partis actuels.',
      'Dans la compétition contemporaine, des sensibilités libérales, conservatrices et gaullistes se croisent. Les premières peuvent privilégier le marché ; les secondes, la continuité des normes ; les dernières, l’autorité de l’État et l’indépendance nationale. Un programme peut combiner ces héritages, parfois au prix de tensions.',
    ],
    dimensions: [
      ['Économie', 'Liberté d’entreprendre et limitation de certaines interventions publiques sont fréquentes, mais coexistent avec des traditions d’État stratège et de protection sociale.'],
      ['Autorité et société', 'Sécurité, continuité institutionnelle et transmission sont des thèmes importants. Leur traduction en matière de libertés et de droits doit être examinée concrètement.'],
      ['Nation et Europe', 'Attachement national, intégration européenne et souveraineté peuvent être combinés de façons différentes ; aucune position européenne unique ne définit toutes les droites.'],
    ],
    debate: 'Des propositions fermes sur la sécurité ne suffisent pas à classer un candidat à l’extrême droite. Inversement, une filiation partisane ancienne ne dispense pas d’examiner ses positions et alliances présentes.',
    references: ['remond', 'freeden', 'benoit-laver'],
  },
  'far-right': {
    question: 'Quelles frontières entre droite radicale, populisme et extrême droite ?',
    history: [
      'Cas Mudde définit la droite radicale populiste à partir du nativisme, de l’autoritarisme et du populisme. Le nativisme vise une priorité au groupe national défini comme légitime ; l’autoritarisme valorise l’ordre et la sanction ; le populisme oppose un « peuple » vertueux à des élites jugées corrompues.',
      'La distinction entre radical et extrême porte notamment sur la démocratie : une droite radicale peut accepter les élections tout en contestant des garanties de la démocratie libérale, tandis que l’extrême droite au sens strict rejette la démocratie elle-même. Notre catégorie commune doit donc être lue avec la justification propre à chaque candidature.',
    ],
    dimensions: [
      ['Appartenance nationale', 'Immigration, citoyenneté et accès aux droits sont au centre de l’analyse lorsque les propositions hiérarchisent les appartenances ou réservent des droits au groupe national.'],
      ['Ordre et pluralisme', 'La place des contre-pouvoirs, des minorités et de l’opposition distingue l’usage électoral de la démocratie du respect de l’ensemble de ses garanties.'],
      ['Économie', 'Libéralisme, protectionnisme et protection sociale réservée aux nationaux peuvent se combiner. L’orientation économique n’est pas uniformément la même.'],
    ],
    debate: 'Le populisme n’appartient pas exclusivement à la droite. Mudde et Müller en proposent des lectures complémentaires mais distinctes. Le qualifier ne remplace donc ni l’analyse du programme ni celle du rapport effectif au pluralisme.',
    references: ['mudde-2007', 'mudde-2004', 'muller'],
  },
  sovereign: {
    question: 'Qui doit décider : la nation, l’Europe, les marchés ?',
    history: [
      'Le souverainisme est ici un repère transversal, pas une famille partisane homogène. Il donne la priorité à la capacité nationale de décider, notamment face aux traités européens, aux dépendances économiques ou aux alliances internationales.',
      'Les travaux de Kriesi et de Hooghe et Marks montrent comment les conflits liés à l’intégration et aux frontières croisent les anciens conflits sociaux. Un souverainisme de gauche peut défendre la capacité de redistribuer ; un souverainisme de droite peut privilégier l’identité nationale. Cette distinction doit rester visible derrière une même étiquette.',
    ],
    dimensions: [
      ['Échelle de décision', 'Réorienter des institutions supranationales, récupérer certaines compétences ou quitter des organisations sont des projets différents.'],
      ['Économie', 'Protection industrielle, autonomie stratégique et politique sociale peuvent être articulées de plusieurs façons ; le souverainisme ne constitue pas à lui seul un programme économique.'],
      ['Appartenance et droits', 'La souveraineté populaire ou nationale n’est pas synonyme de nativisme. Les critères de citoyenneté et le respect des droits permettent de distinguer des démarches pourtant toutes qualifiées de souverainistes.'],
    ],
    debate: 'Être critique d’un traité ne signifie pas nécessairement vouloir quitter l’Union européenne. Ce repère ne permet pas non plus de ranger automatiquement un candidat à droite, à gauche ou à l’extrême droite.',
    references: ['kriesi', 'hooghe-marks', 'benoit-laver'],
  },
  democracy: {
    question: 'La démocratie se limite-t-elle à choisir des représentants ?',
    history: [
      'Carole Pateman interroge la place de la participation dans la vie démocratique et ses effets sur la capacité des citoyens à agir. Bernard Manin montre de son côté que le gouvernement représentatif repose sur une histoire et des mécanismes distincts de la démocratie directe.',
      'Notre repère rassemble des candidatures qui placent les institutions ou la participation citoyenne au premier plan. Il ne les rend pas identiques : une candidature indépendante des partis, un référendum d’initiative citoyenne et une assemblée constituante sont trois démarches différentes.',
    ],
    dimensions: [
      ['Participation', 'Consultation, délibération et décision ne donnent pas le même pouvoir. Il faut regarder qui fixe l’ordre du jour et quelles suites sont données aux propositions.'],
      ['Constitution', 'Un processus constituant vise les règles fondamentales ; son mode de désignation, son mandat et ses garanties doivent être précisés.'],
      ['Droits et pluralisme', 'La décision majoritaire doit être articulée à la protection des libertés et des minorités. « Le peuple décide » ne répond pas, à lui seul, à toutes les questions démocratiques.'],
    ],
    debate: 'La démocratie directe peut être défendue à gauche comme à droite. Une proposition institutionnelle n’établit pas le programme social d’un candidat et ne prouve pas, sans examen, un respect supérieur du pluralisme.',
    references: ['pateman', 'manin', 'muller'],
  },
  animalist: {
    question: 'Quels intérêts le politique doit-il représenter au-delà des humains ?',
    history: [
      'L’animalisme politique place les intérêts des animaux dans la délibération publique : conditions de vie, élevage, chasse, expérimentation, alimentation et statut juridique. Il ne se réduit pas à la protection d’espèces menacées ou à la conservation des écosystèmes.',
      'Dans Zoopolis, Sue Donaldson et Will Kymlicka proposent de penser des relations politiques différenciées avec les animaux domestiques, sauvages et ceux qui vivent à proximité des humains. Cette théorie normative élargit la réflexion ; elle ne doit pas être attribuée intégralement à un parti ou à une candidate sans preuve.',
    ],
    dimensions: [
      ['Statut et intérêts', 'Les débats concernent la souffrance, les droits et les obligations humaines. Amélioration du bien-être et abolition de certaines pratiques ne sont pas la même position.'],
      ['Écologie', 'La protection d’individus animaux et celle d’un écosystème peuvent converger, mais aussi entrer en tension : les deux traditions ne sont pas interchangeables.'],
      ['Projet d’ensemble', 'Une priorité animale ne suffit pas à connaître les positions sur la fiscalité, l’Europe, les institutions ou les autres droits. Ces positions exigent des sources propres.'],
    ],
    debate: 'Le classement « animaliste » décrit ici une priorité et une organisation politiques attestées. Il ne transforme pas une candidature thématique en programme complet et ne lui attribue pas automatiquement une place unique sur l’axe gauche–droite.',
    references: ['zoopolis', 'dobson', 'freeden'],
  },
  personal: {
    question: 'Comment décrire une candidature qui ne relève pas d’une doctrine partisane ?',
    history: [
      'Ce dossier n’ajoute pas une dixième famille scientifique. Il explicite un repère descriptif employé pour une démarche personnelle dont les annonces publiques mobilisent surtout des références ésotériques ou spirituelles.',
      'L’approche conceptuelle de Freeden invite à identifier des ensembles d’idées articulées. En l’absence d’éléments comparables sur l’économie, les libertés et les institutions, il serait trompeur de fabriquer une appartenance précise à gauche ou à droite. Les sources de la fiche individuelle documentent le contenu de la déclaration.',
    ],
    dimensions: [
      ['Ce qui est attesté', 'Les termes employés publiquement et la déclaration de candidature peuvent être rapportés, avec leurs sources.'],
      ['Ce qui ne l’est pas', 'Une biographie singulière ou une référence spirituelle ne démontre pas un programme fiscal, une politique européenne ou une position sur les droits.'],
      ['Limite du classement', 'Le repère décrit une démarche ; il n’attribue ni diagnostic médical ni appartenance idéologique non étayée.'],
    ],
    debate: 'Le champ politique accueille des candidatures très différentes. Les décrire exige le même niveau de précision que pour les partis établis ; une catégorie résiduelle doit montrer ses limites au lieu de les masquer.',
    references: ['freeden', 'benoit-laver'],
  },
};

for (const [key, guide] of Object.entries(guides)) Object.assign(families[key], guide);
