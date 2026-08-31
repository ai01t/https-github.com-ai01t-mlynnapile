#!/usr/bin/env bash
# Zkopíruje web Keramiky Kampanela do public/jindra/kampanela jako ukázku.
#
# Proti zdroji se liší dvěma věcmi, které skript pokaždé znovu doplní:
#  - editační rozhraní se vynechá (zapisuje přes server.py, ten v produkci neběží)
#  - doplní se <base href>, protože adresa /jindra/kampanela nemá koncové
#    lomítko a relativní cesty by se hledaly o úroveň výš (/jindra/styles.css)
set -euo pipefail

SRC="${KAMPANELA_SRC:-$HOME/Projects/Keramika Kampanela/web}"
WEB="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$WEB/public/jindra/kampanela"

[ -d "$SRC" ] || { echo "Zdroj nenalezen: $SRC" >&2; exit 1; }

echo "→ kopíruji z $SRC"
rm -rf "$DEST"
mkdir -p "$DEST"
rsync -a \
  --exclude '.zalohy' \
  --exclude 'editor.css' \
  --exclude 'editor.js' \
  --exclude 'admin.html' \
  --exclude 'README.md' \
  "$SRC/" "$DEST/"

echo "→ odstraňuji editační rozhraní"
# řádek s editor.css i s jeho komentářem, a řádek se skriptem editoru
perl -0pi -e 's{[ \t]*<!-- Editor:.*?-->\n[ \t]*<link rel="stylesheet" href="editor\.css[^"]*">\n}{  <!-- Ukazkova verze bez editacniho rozhrani (editor zapisuje pres server.py,\n       ktery v produkci nebezi). Zdroj: ~/Projects/Keramika Kampanela/web -->\n}s' "$DEST/index.html"
perl -0pi -e 's{[ \t]*<script src="editor\.js[^"]*"></script>\n}{}s' "$DEST/index.html"

echo "→ doplňuji <base href>"
for f in index.html styly.html; do
  [ -f "$DEST/$f" ] || continue
  grep -q '<base ' "$DEST/$f" || \
    perl -0pi -e 's{(<meta charset="utf-8">)}{$1\n  <base href="/jindra/kampanela/">}' "$DEST/$f"
done

echo "→ kontrola"
grep -q 'editor\.js' "$DEST/index.html" && { echo "CHYBA: editor zůstal v index.html" >&2; exit 1; }
grep -q '<base href="/jindra/kampanela/">' "$DEST/index.html" || { echo "CHYBA: chybí base v index.html" >&2; exit 1; }

echo "hotovo — nezapomeň změny zacommitovat"
