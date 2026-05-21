(() => {
const EQUIPMENT_IFRAME = "/equipment-table/studio-equipment.html";

const EQUIPMENT_CATEGORIES = [
  { id: "guitars", label: { cs: "Kytary: elektrické + akustické", en: "Guitars: electric + acoustic", de: "Gitarren: elektrisch + akustisch" } },
  { id: "basses", label: { cs: "Baskytary", en: "Basses", de: "Bässe" } },
  { id: "amps", label: { cs: "Zesilovače", en: "Amplifiers", de: "Verstärker" } },
  { id: "cabs", label: { cs: "Boxy (Cabs)", en: "Cabs", de: "Boxen (Cabs)" } },
  { id: "effects", label: { cs: "Efekty", en: "Effects", de: "Effekte" } },
  { id: "drums", label: { cs: "Bicí", en: "Drums", de: "Drums" } },
  { id: "microphones", label: { cs: "Mikrofony", en: "Microphones", de: "Mikrofone" } },
  { id: "audio", label: { cs: "Audio & Processing", en: "Audio & Processing", de: "Audio & Processing" } },
  { id: "software", label: { cs: "Studio & Software", en: "Studio & Software", de: "Studio & Software" } },
  { id: "monitoring", label: { cs: "Monitoring & A/V", en: "Monitoring & A/V", de: "Monitoring & A/V" } },
  { id: "infrastructure", label: { cs: "Infrastruktura", en: "Infrastructure", de: "Infrastruktur" } },
  { id: "collaboration", label: { cs: "Spolupráce", en: "Collaboration", de: "Zusammenarbeit" } },
];

const EQUIPMENT_NOTES = {
  cs: "Kompletní tabulka vybavení je vložená z lokálního souboru s detailními technickými popisy a fotografiemi.",
  en: "The full equipment table is embedded from a local file with detailed technical descriptions and photos.",
  de: "Die vollständige Ausstattungstabelle wird aus einer lokalen Datei mit technischen Details und Fotos eingebettet.",
};

window.MlynEquipment = {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_IFRAME,
  EQUIPMENT_NOTES,
};
})();
