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

// Des héritages intellectuels, pas des adhésions prêtées à tous les partis actuels.
const philosophies = {
  radical: {
    frame: 'La « gauche collectiviste » de Julliard éclaire une partie de ces héritages, mais les traditions jacobine et libertaire traversent aussi cette famille. La question de la propriété n’épuise ni celle de la liberté ni celle de l’organisation politique.',
    thinkers: [
      ['Karl Marx et Friedrich Engels', 'Critique des rapports de production capitalistes, conflits de classes et appropriation du travail. Cet héritage a donné lieu à des interprétations démocratiques et autoritaires qu’il faut distinguer.'],
      ['Rosa Luxemburg', 'Importance de l’activité des travailleurs et débat sur les rapports entre organisation révolutionnaire, spontanéité et démocratie.'],
      ['Léon Trotski', 'Révolution permanente et opposition au stalinisme ; une référence spécifique des organisations trotskistes, pas une doctrine qu’on peut attribuer à toute la gauche radicale.'],
      ['Pierre-Joseph Proudhon et Mikhaïl Bakounine', 'Des traditions antiautoritaires distinctes du marxisme, avec des débats sur l’État, la propriété et l’organisation collective. Elles ne sont pas les références communes de toutes les organisations classées ici.'],
      ['Fernand Pelloutier', 'Les Bourses du travail et l’action directe ouvrent une voie d’émancipation par l’organisation ouvrière. L’étude de Julliard éclaire cette tradition syndicaliste, différente d’une seule stratégie électorale.'],
    ],
    caution: 'Le marxisme ne résume pas toutes les gauches de transformation. La référence à Marx ne prouve pas l’adhésion à toutes les expériences qui s’en sont réclamées.',
    references: ['julliard-gauches', 'julliard-pelloutier', 'sep-socialism', 'march'],
  },
  left: {
    frame: 'Chez Julliard, les gauches libérale, jacobine, collectiviste et libertaire sont des traditions historiques qui se croisent. Le socialisme démocratique français et la social-démocratie européenne n’en sont pas de simples cases modernes.',
    thinkers: [
      ['Jean Jaurès', 'Articulation entre République, démocratie, mouvement ouvrier et émancipation sociale ; une référence majeure du socialisme français.'],
      ['Eduard Bernstein', 'Révision du marxisme et défense d’une transformation par les réformes démocratiques plutôt que par l’attente d’un effondrement du capitalisme.'],
      ['Léon Blum', 'Réflexion sur l’exercice du pouvoir, la démocratie et la transformation sociale dans la tradition socialiste française.'],
      ['John Maynard Keynes', 'Les politiques de demande et de stabilisation ont fourni des instruments à de nombreuses gauches de gouvernement. Keynes n’est pas pour autant le fondateur du socialisme ni une propriété exclusive de la gauche.'],
    ],
    caution: 'Ces influences ne conduisent pas à une politique économique unique : réforme du marché, redistribution, nationalisations et négociation collective demeurent des objets de débat.',
    references: ['julliard-gauches', 'berman', 'sep-socialism'],
  },
  green: {
    frame: 'L’écologie politique renouvelle les questions de liberté, d’égalité et de production étudiées dans l’histoire des gauches, sans pouvoir être rabattue sur les seules typologies de Julliard ou de Rémond.',
    thinkers: [
      ['André Gorz', 'Critique du productivisme et réflexion sur le travail, les besoins et l’autonomie : une rencontre entre critique sociale et pensée écologique.'],
      ['Ivan Illich', 'Critique de la dépendance envers les grandes institutions et recherche d’outils conviviaux qui renforcent la capacité d’agir.'],
      ['Hans Jonas', 'Responsabilité envers les générations futures face à la puissance des techniques et à leurs conséquences durables.'],
      ['Arne Næss', 'L’écologie profonde interroge l’anthropocentrisme et la valeur du vivant. Elle représente une tradition particulière, pas le programme commun de tous les écologistes.'],
    ],
    caution: 'Ces auteurs ne s’accordent pas sur tous les rapports entre technique, croissance, État et autonomie. Leurs idées sont des ressources de débat, pas un catéchisme partagé.',
    references: ['dobson', 'sep-environment', 'julliard-gauches'],
  },
  centre: {
    frame: 'Rémond aide à situer les traditions libérales issues notamment de l’orléanisme, tandis que Julliard montre que le libéralisme politique appartient aussi à l’histoire de certaines gauches. Le centre n’a donc pas le monopole de la liberté ou du compromis.',
    thinkers: [
      ['Benjamin Constant', 'Protection des libertés individuelles et limitation du pouvoir, y compris lorsqu’il s’exerce au nom de la souveraineté populaire.'],
      ['John Stuart Mill', 'Liberté d’opinion, pluralisme, individualité et discussion du rôle de l’État : le libéralisme ne se réduit pas au laisser-faire économique.'],
      ['Montesquieu', 'Modération et distribution des pouvoirs comme protections contre l’arbitraire, bien au-delà des seuls partis centristes.'],
    ],
    caution: 'Les héritages libéraux, démocrates-chrétiens et sociaux-libéraux ne sont pas interchangeables. Les filiations intellectuelles éclairent le centre sans lui attribuer une neutralité idéologique.',
    references: ['remond', 'julliard-gauches', 'sep-liberalism'],
  },
  right: {
    frame: 'Les trois droites de Rémond — légitimiste, orléaniste et bonapartiste — distinguent des rapports différents à la tradition, aux libertés et à l’autorité. Les Droites aujourd’hui invite à examiner leurs recompositions plutôt qu’à identifier mécaniquement un parti à chacune.',
    thinkers: [
      ['Edmund Burke', 'Prudence envers les reconstructions politiques abstraites et attention aux institutions héritées ; un repère du conservatisme moderne.'],
      ['Alexis de Tocqueville', 'Analyse de l’égalité démocratique, des associations, des libertés et des risques de centralisation. Sa réception dépasse largement la seule droite.'],
      ['Adam Smith et Friedrich Hayek', 'Smith éclaire les mécanismes de l’échange et de la division du travail ; Hayek défend la coordination décentralisée et critique la planification. Ces pensées libérales sont distinctes du conservatisme et ne conduisent pas toutes les droites au même programme.'],
      ['Joseph de Maistre', 'Pensée contre-révolutionnaire de l’autorité et de la tradition religieuse : un héritage historique distinct du libéralisme, qui ne saurait être imputé à toute la droite actuelle.'],
      ['Charles de Gaulle', 'Une doctrine d’action sur l’État, la nation, l’indépendance et la relation au peuple. Il s’agit ici d’un acteur et auteur politique, non d’un philosophe au même sens que les précédents.'],
    ],
    caution: 'Conservatisme, libéralisme et gaullisme peuvent entrer en tension. Les typologies historiques ne permettent pas, à elles seules, de conclure sur les positions contemporaines de LR ou d’Horizons.',
    references: ['remond', 'remond-actuel', 'sep-conservatism', 'sep-liberalism'],
  },
  'far-right': {
    frame: 'Rémond et Sternhell proposent des lectures distinctes de l’histoire des droites et des nationalismes. Cette controverse compte : l’extrême droite contemporaine ne se laisse pas déduire d’une simple continuité avec le légitimisme ou le bonapartisme.',
    thinkers: [
      ['Maurice Barrès', 'Nationalisme de l’enracinement et de l’appartenance ; une référence de l’histoire intellectuelle de certains nationalismes français.'],
      ['Charles Maurras', 'Nationalisme intégral, monarchisme et antisémitisme : une tradition historique d’extrême droite dont il faut décrire les spécificités plutôt que la projeter sur tout parti actuel.'],
    ],
    caution: 'Ces noms décrivent des traditions et des réemplois historiquement documentés, pas une adhésion attribuée par défaut à chaque élu. Pour les partis contemporains, nativisme, autoritarisme, populisme et rapport au pluralisme sont examinés à partir de leurs positions propres.',
    references: ['remond', 'remond-actuel', 'sternhell', 'mudde-2007'],
  },
  sovereign: {
    frame: 'La souveraineté traverse les traditions étudiées par Rémond et Julliard : souveraineté de l’État, de la nation et du peuple ne désignent pas exactement la même chose.',
    thinkers: [
      ['Jean Bodin', 'La souveraineté comme puissance supérieure de la communauté politique : un jalon de la pensée de l’État moderne.'],
      ['Jean-Jacques Rousseau', 'Souveraineté du peuple et volonté générale ; des notions discutées dans des traditions de gauche comme de droite.'],
      ['Charles de Gaulle', 'Indépendance nationale et capacité de décision de la France, dans une doctrine politique qui n’épuise pas les formes de souverainisme.'],
    ],
    caution: 'Ces références n’impliquent ni un même régime institutionnel ni une même politique sociale. Le patriotisme, la souveraineté populaire et le nativisme ne sont pas des synonymes.',
    references: ['sep-sovereignty', 'remond-actuel', 'julliard-gauches'],
  },
  democracy: {
    frame: 'Les traditions jacobine et libertaire distinguées par Julliard peuvent se rencontrer sur la souveraineté populaire et s’opposer sur la centralisation ou les moyens de l’émancipation.',
    thinkers: [
      ['Jean-Jacques Rousseau', 'Légitimité de la décision collective et souveraineté populaire ; ces principes ne fournissent pas, à eux seuls, un modèle opérationnel de référendum moderne.'],
      ['Condorcet', 'Réflexion sur les décisions collectives, l’instruction et l’égalité des droits ; une référence de la tradition républicaine et de la discussion démocratique.'],
      ['Cornelius Castoriadis', 'Autonomie : une société peut discuter les institutions qu’elle se donne au lieu de les tenir pour intouchables.'],
      ['Carole Pateman', 'La participation peut former les capacités démocratiques des citoyens, y compris au-delà du seul moment électoral.'],
    ],
    caution: 'Représentation, participation, délibération et démocratie directe ne sont pas une seule procédure. Une invocation du peuple ne suffit jamais à garantir les droits et le pluralisme.',
    references: ['julliard-gauches', 'castoriadis', 'pateman', 'manin'],
  },
  animalist: {
    frame: 'L’extension de la considération morale et politique aux animaux pose une question différente des typologies classiques des gauches et des droites, même si elle les croise.',
    thinkers: [
      ['Peter Singer', 'Considération égale des intérêts et critique du spécisme, dans une approche utilitariste attentive à la souffrance.'],
      ['Tom Regan', 'Défense de droits liés à la valeur des sujets d’une vie : une argumentation qui ne se confond pas avec le calcul utilitariste.'],
      ['Sue Donaldson et Will Kymlicka', 'Extension de la réflexion aux relations politiques avec les animaux, avec des statuts différenciés selon leurs relations aux sociétés humaines.'],
    ],
    caution: 'Bien-être, droits et abolition de pratiques ne sont pas des positions identiques. La filiation d’un parti avec l’une de ces théories doit être démontrée, pas déduite de son nom.',
    references: ['sep-animals', 'zoopolis', 'dobson'],
  },
  personal: {
    frame: 'Aucune grande filiation philosophique ne peut être établie à partir des seules déclarations ésotériques recensées. Nous ne créons pas de généalogie intellectuelle pour remplir une rubrique.',
    thinkers: [],
    caution: 'Ce repère demeure descriptif et n’est pas une famille scientifique. Les références ci-dessous concernent la méthode de classement, non les convictions attestées de la personne.',
    references: ['freeden', 'benoit-laver'],
  },
};

for (const [key, philosophy] of Object.entries(philosophies)) {
  families[key].philosophy = philosophy;
  families[key].references = [...new Set([...philosophy.references, ...families[key].references])];
}
