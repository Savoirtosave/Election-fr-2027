// Conserver les anciens favoris de la première version à page unique.
const legacy = { '#candidats': 'candidats.html', '#familles': 'familles.html', '#methode': 'sources.html#methode', '#references': 'sources.html#bibliographie' };
if (legacy[window.location.hash]) window.location.replace(new URL(legacy[window.location.hash], window.location.href));
