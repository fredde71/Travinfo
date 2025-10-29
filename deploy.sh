#!/bin/bash

echo "🚀 Steg 1: Uppdaterar data.json…"
npm run update-data

echo "🏗 Steg 2: Bygger sidan…"
npm run build

echo "🧼 Steg 3: Rensar gamla docs…"
rm -rf docs
mkdir docs

echo "📦 Steg 4: Kopierar nya builden till docs…"
cp -R dist/* docs/

echo "📤 Steg 5: Git add/commit/push…"
git add docs --force
git commit -m "Auto: ny omgång uppdaterad"
git push origin main

echo "✅ Klar! Kolla live-sidan 🙌"
