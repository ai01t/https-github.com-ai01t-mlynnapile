/* Jazyková vrstva tabulky vybavení.
   Tabulka byla původně jen česky a parametr ?lang= ignorovala. Tady jsou
   rozhraní, názvy kategorií a překlady textů u položek; co není přeloženo,
   spadne zpět na češtinu, takže se nikdy nezobrazí prázdno. */
(function () {
  var raw = new URLSearchParams(location.search).get('lang') || 'cs';
  var lang = ['cs', 'en', 'de'].indexOf(raw.toLowerCase()) >= 0 ? raw.toLowerCase() : 'cs';

  var UI = {
    cs: {
      empty: 'Vyberte položku ze seznamu',
      noDetail: 'Podrobné informace nejsou k dispozici.',
      specs: 'Technické specifikace',
      note: 'Poznámka',
      upgrade: 'Upgrade',
      usedBy: 'Používají / používali také',
      chain: 'Použitý chain',
      source: 'Zdroj:',
      forSale: 'Na prodej',
      backToList: 'Seznam',
      photos: 'Fotografie',
      scheme: 'Schéma sestavy',
      fullChain: 'Kompletní chain, který v klipu slyšíte, je k dispozici ve studiu.',
    },
    en: {
      empty: 'Select an item from the list',
      noDetail: 'No detailed information available.',
      specs: 'Specifications',
      note: 'Note',
      upgrade: 'Upgrade',
      usedBy: 'Also used by',
      chain: 'Signal chain',
      source: 'Source:',
      forSale: 'For sale',
      backToList: 'List',
      photos: 'Photos',
      scheme: 'Kit layout',
      fullChain: 'The full chain you hear in the clip is available in the studio.',
    },
    de: {
      empty: 'Wählen Sie einen Eintrag aus der Liste',
      noDetail: 'Keine detaillierten Informationen verfügbar.',
      specs: 'Technische Daten',
      note: 'Anmerkung',
      upgrade: 'Upgrade',
      usedBy: 'Ebenfalls gespielt von',
      chain: 'Signalkette',
      source: 'Quelle:',
      forSale: 'Zu verkaufen',
      backToList: 'Liste',
      photos: 'Fotos',
      scheme: 'Set-Aufbau',
      fullChain: 'Die vollständige Kette aus dem Clip steht im Studio bereit.',
    },
  };

  /* Názvy kategorií a podskupin. Klíč je české znění z CATS. */
  var CATS = {
    'Kytary': { en: 'Guitars', de: 'Gitarren' },
    'Elektrické': { en: 'Electric', de: 'E-Gitarren' },
    'Akustické': { en: 'Acoustic', de: 'Akustisch' },
    'Baskytary': { en: 'Bass guitars', de: 'Bässe' },
    'Zesilovače': { en: 'Amplifiers', de: 'Verstärker' },
    'Boxy (Cabs)': { en: 'Cabinets', de: 'Boxen' },
    'Boxy': { en: 'Cabinets', de: 'Boxen' },
    'Reproduktorové kabely': { en: 'Speaker cables', de: 'Lautsprecherkabel' },
    'Efekty': { en: 'Effects', de: 'Effekte' },
    'Nástrojové kabely': { en: 'Instrument cables', de: 'Instrumentenkabel' },
    'Bicí': { en: 'Drums', de: 'Schlagzeug' },
    'Mikrofony': { en: 'Microphones', de: 'Mikrofone' },
    'Kabeláž': { en: 'Cabling', de: 'Verkabelung' },
    'Audio & Processing': { en: 'Audio & Processing', de: 'Audio & Processing' },
    'Technické detaily': { en: 'Technical details', de: 'Technische Details' },
    'Vstupy & výstupy': { en: 'Inputs & outputs', de: 'Ein- & Ausgänge' },
    'Pluginy & Unison': { en: 'Plug-ins & Unison', de: 'Plug-ins & Unison' },
    'Studio & Software': { en: 'Studio & Software', de: 'Studio & Software' },
    'Monitoring & A/V': { en: 'Monitoring & A/V', de: 'Monitoring & A/V' },
    'Monitoring': { en: 'Monitoring', de: 'Monitoring' },
    'A/V': { en: 'A/V', de: 'A/V' },
    'Infrastruktura': { en: 'Infrastructure', de: 'Infrastruktur' },
    'Spolupráce': { en: 'Collaboration', de: 'Zusammenarbeit' },
    'Formy spolupráce': { en: 'Ways to work together', de: 'Formen der Zusammenarbeit' },
    'Poděkování a bazar': { en: 'Thanks & second-hand', de: 'Dank & Gebrauchtmarkt' },
    'Bazar': { en: 'Second-hand', de: 'Gebrauchtmarkt' },
    'Aktuálně na prodej': { en: 'Currently for sale', de: 'Aktuell zu verkaufen' },
  };

  window.EQ_LANG = lang;
  window.EQ_T = function (key) {
    var pack = UI[lang] || UI.cs;
    return pack[key] !== undefined ? pack[key] : UI.cs[key];
  };
  window.EQ_CAT = function (czech) {
    if (lang === 'cs') return czech;
    var entry = CATS[czech];
    return entry && entry[lang] ? entry[lang] : czech;
  };
  /* Překlady textů u položek doplňujeme postupně; bez záznamu zůstane čeština. */
  window.EQ_ITEMS = window.EQ_ITEMS || {};
  window.EQ_ITEM = function (name, field, fallback) {
    if (lang === 'cs') return fallback;
    var rec = window.EQ_ITEMS[name];
    var val = rec && rec[lang] && rec[lang][field];
    return val || fallback;
  };
})();
