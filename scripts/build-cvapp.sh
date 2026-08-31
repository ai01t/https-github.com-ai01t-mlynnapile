#!/usr/bin/env bash
# Postaví CV Studio jako statické stránky a nasadí je do public/jindra/cvapp.
#
# Zdroj aplikace je samostatný projekt; build běží ve stranou odložené kopii,
# aby se v něm nic nepřepsalo. API routy se do statického exportu nedostanou,
# takže překlad míří na routu tohoto webu (/api/cv-translate).
set -euo pipefail

SRC="${CVAPP_SRC:-$HOME/Projects/free_cv_creator}"
WEB="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "→ kopíruji zdroj z $SRC"
rsync -a --exclude .next --exclude .git "$SRC/" "$TMP/build/"

# statický export nemá server, takže serverové routy do buildu nepatří
rm -rf "$TMP/build/src/app/api"

cat > "$TMP/build/next.config.ts" <<'CFG'
import type { NextConfig } from 'next';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') || undefined;
const nextConfig: NextConfig = {
  basePath,
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
CFG

echo "→ build"
(cd "$TMP/build" && NEXT_PUBLIC_BASE_PATH=/jindra/cvapp npx next build >/dev/null)

echo "→ přesměrování překladu na routu tohoto webu"
grep -rl '"/api/translate"' "$TMP/build/out/_next/static/chunks" \
  | xargs -r sed -i '' 's|"/api/translate"|"/api/cv-translate"|g'

echo "→ nasazuji do public/jindra/cvapp"
rm -rf "$WEB/public/jindra/cvapp"
mkdir -p "$WEB/public/jindra"
cp -R "$TMP/build/out" "$WEB/public/jindra/cvapp"

echo "hotovo — nezapomeň změny zacommitovat"
