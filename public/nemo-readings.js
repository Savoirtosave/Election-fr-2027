// Chapter titles and pagination verified in the 2013 PUF/Cairn table of contents.
// Notes identify questions to examine, not an intellectual allegiance of today's parties.
export const nemoChapters = {
  introduction:{title:'Introduction générale. La droite, la gauche, la démocratie libérale',pages:'13–30',page:13},
  bodin:{title:'Bodin. Un théoricien de l’État souverain',pages:'79–107',page:79},
  hobbes:{title:'Hobbes. L’État illimité',pages:'137–154',page:137},
  locke:{title:'Locke. La doctrine de la rule of law',pages:'305–335',page:305},
  mill:{title:'Démocrates et libéraux en Angleterre au XIXe siècle',pages:'569–589',page:569},
  constant:{title:'Démocrates et libéraux en France au XIXe siècle : Constant, Bastiat, Prévost-Paradol',pages:'591–697',page:591},
  rousseau:{title:'Rousseau',pages:'801–840',page:801},
  marx:{title:'Marx',pages:'915–952',page:915},
  socialism:{title:'Le socialisme démocratique',pages:'973–988',page:973},
  socialdem:{title:'La social-démocratie',pages:'989–1014',page:989},
  montesquieu:{title:'Montesquieu. La nostalgie de la société féodale',pages:'1027–1057',page:1027},
  tocqueville:{title:'Tocqueville. La liberté aristocratique',pages:'1105–1152',page:1105},
  nationalism:{title:'Barrès, Maurras et le nationalisme français',pages:'1181–1233',page:1181},
  arendt:{title:'Le totalitarisme selon Hannah Arendt',pages:'1357–1377',page:1357},
  rawls:{title:'John Rawls',pages:'1379–1406',page:1379},
};
export const nemoReadings = {
  radical:{chapters:['marx','rousseau','socialism'],note:'Distinguer la critique des rapports de propriété, la souveraineté populaire et les stratégies de transformation. Les chapitres consacrés à Marx, Rousseau et au socialisme démocratique donnent des repères pour ces débats ; ils ne rendent pas équivalentes les voies réformistes et révolutionnaires.',thinkers:['Karl Marx et Friedrich Engels']},
  left:{chapters:['socialism','socialdem','rawls'],note:'Comparer socialisme démocratique, social-démocratie et justice libérale : la réforme sociale peut mobiliser plusieurs conceptions de l’égalité et de la liberté. Le classement critique de Nemo doit être croisé avec l’histoire de la social-démocratie étudiée par Sheri Berman.',thinkers:['John Rawls']},
  centre:{chapters:['locke','mill','constant'],note:'Examiner la limitation du pouvoir, le consentement et les libertés individuelles. Ces débats libéraux traversent le centre et une partie des gauches et des droites : ils ne constituent pas la propriété intellectuelle d’un camp.',thinkers:['John Locke','Benjamin Constant','John Stuart Mill']},
  right:{chapters:['constant','montesquieu','tocqueville'],note:'Distinguer liberté économique, équilibre des pouvoirs et traditions conservatrices. Les intitulés choisis par Nemo pour Montesquieu et Tocqueville signalent un angle d’interprétation historique, à croiser avec les autres histoires des droites et les travaux sur le conservatisme.',thinkers:['Alexis de Tocqueville']},
  'far-right':{chapters:['nationalism','arendt','introduction'],note:'Étudier les nationalismes et les critiques de la démocratie libérale en distinguant doctrines, régimes et époques. Un chapitre sur Maurras ou le totalitarisme ne permet pas d’assimiler automatiquement un parti contemporain à ces références.',thinkers:[]},
  sovereign:{chapters:['bodin','hobbes','rousseau'],note:'Séparer la souveraineté de l’État, l’autorité protectrice et la souveraineté populaire. Bodin, Hobbes et Rousseau posent des problèmes différents ; aucun ne fournit directement le programme européen ou diplomatique d’un parti actuel.',thinkers:['Jean Bodin','Thomas Hobbes','Jean-Jacques Rousseau']},
  democracy:{chapters:['rousseau','locke','introduction'],note:'Comparer souveraineté populaire et limitation du pouvoir. La participation ne remplace pas à elle seule les garanties des droits ; les débats historiques doivent être complétés par Manin et Pateman sur la représentation et la participation contemporaines.',thinkers:['Jean-Jacques Rousseau']},
};
export const nemoChapterUrl = chapter => `https://shs.cairn.info/histoire-des-idees-politiques-aux-temps-modernes-et-contemporains--9782130627333-page-${nemoChapters[chapter].page}?lang=fr`;
