#!/bin/bash

set -e

echo "🚀 Steg 1: Uppdaterar data.json (veckans omgång)…"
npm run update-data

echo "📝 Kopierar senaste data.json till build-underlag…"
cp public/data.json public/_latest-data.json 2>/dev/null || true

echo "🏗 Steg 2: Bygger sidan…"
npm run build

echo "📦 Säkerställer att builden innehåller rätt data.json…"
# ibland hamnar nya data.json bara i public/, så vi tvingar in den i dist också
cp public/data.json dist/data.json

echo "🧼 Steg 3: Rensar gamla docs…"
rm -rf docs
mkdir docs

echo "⬇️ Steg 4: Kopierar nya builden till docs…"
cp -R dist/* docs/

echo "🔁 Steg 5: Lägger till ändringarna i git…"
git add docs --force
git add public/data.json
git add deploy.sh
git add update-data.js
git add package.json
git add src/App.jsx

echo "🖊 Steg 6: Commitar…"
git commit -m "Auto: uppdaterad omgång + publicerade docs" || echo "ℹ️ Inget att committa (ingen ändring)"

echo "📤 Steg 7: Pushar till GitHub…"
git push origin main

echo "✅ Färdigt! Nya omgången borde nu ligga live. Kolla omgångskollen.se 🐎"

