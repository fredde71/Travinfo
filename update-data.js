// update-data.js
// Version B+: Försök hämta riktiga tips (spik / skräll / varning) från öppna källor.
// Du kör som vanligt: npm run update-data
//
// Flöde:
// 1. Hämta HTML från Travstugan (spik / skräll).
// 2. Hämta HTML från Trav365 (spik / miljonrensare).
// 3. Hämta HTML från ATG "Vass eller Kass" (överspelad favorit).
// 4. Plocka ut hästnamn med enkla mönster (regex).
// 5. Skriv public/data.json med det vi hittade (eller fallback).

import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname-hack för ES-moduler
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------
// Hjälpfunktion: hämta HTML
// -----------------------------
async function fetchText(url) {
  try {
    const res = await fetch(url, {
      headers: {
        // Vi fejkar lite "vanlig webbläsare"-header för att vissa sidor inte ska säga nej direkt
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) {
      console.warn(`⚠ ${url} svarade med status ${res.status}`);
      return "";
    }
    return await res.text();
  } catch (err) {
    console.warn(`⚠ Kunde inte hämta ${url}:`, err.message);
    return "";
  }
}

// ------------------------------------------------
// Extraktion: hitta spik / skräll i Travstugan
// ------------------------------------------------
//
// Vi letar efter rubriker eller textblock som liknar
// "Spiken:" / "🔒 Spiken" / "Spikförslag" osv
// samt "Skrällen", "Luringen", "Miljonrensaren".
//
// Vi försöker vara ganska tillåtande i regexen.

function extractFromTravstugan(html) {
  let spik = null;
  let skrall = null;

  // Spik: fångar t.ex. "Spiken: Hästnamn" eller "Spikförslag: Hästnamn"
  const spikMatch =
    html.match(
      /Spik(?:en|förslag)?\s*[:\-]\s*<\/?(?:strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäöÉéèÈÉ0-9\s'".\-]+)/i
    ) ||
    html.match(
      /Spik(?:en)?\s*<\/?(?:strong|b|span)[^>]*>\s*([A-Za-zÅÄÖåäöÉéèÈÉ0-9\s'".\-]+)/i
    );

  if (spikMatch && spikMatch[1]) {
    spik = spikMatch[1].trim();
  }

  // Skräll: fångar "Skrällen: Hästnamn", "Luringen: Hästnamn", "Miljonrensaren: Hästnamn"
  const skrallMatch =
    html.match(
      /(Skräll(?:en)?|Luring(?:en)?|Miljonrensare(?:n)?)\s*[:\-]\s*<\/?(?:strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäöÉéèÈÉ0-9\s'".\-]+)/i
    ) ||
    html.match(
      /(Skräll(?:en)?|Luring(?:en)?|Miljonrensare(?:n)?)\s*<\/?(?:strong|b|span)[^>]*>\s*([A-Za-zÅÄÖåäöÉéèÈÉ0-9\s'".\-]+)/i
    );

  if (skrallMatch && skrallMatch[2]) {
    skrall = skrallMatch[2].trim();
  }

  return { spik, skrall };
}

// ------------------------------------------------
// Extraktion: Trav365 (Sportbladet)
// ------------------------------------------------
//
// De brukar skriva "Vår spik: HÄSTNAMN" och "Miljonrensaren: HÄSTNAMN".
// Vi försöker hitta det.

function extractFromTrav365(html) {
  let spik = null;
  let skrall = null;

  // "Vår spik: Hästnamn"
  const spik365 =
    html.match(
      /(Vår|Vårt)\s+spik\w*\s*[:\-]\s*<\/?(?:strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäö0-9\s'".\-]+)/i
    ) ||
    html.match(
      /Spiken\s*[:\-]\s*<\/?(?:strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäö0-9\s'".\-]+)/i
    );

  if (spik365 && spik365[2]) {
    spik = spik365[2].trim();
  } else if (spik365 && spik365[1]) {
    // fallback om första gruppen fångade namnet
    spik = spik365[1].trim();
  }

  // "Miljonrensaren: Hästnamn"
  const skrall365 =
    html.match(
      /(Miljonrensare(?:n)?|Skräll(?:en)?)\s*[:\-]\s*<\/?(?:strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäö0-9\s'".\-]+)/i
    );

  if (skrall365 && skrall365[2]) {
    skrall = skrall365[2].trim();
  }

  return { spik, skrall };
}

// ------------------------------------------------
// Extraktion: Vass eller Kass (ATG)
// ------------------------------------------------
//
// De pratar om att vissa favoriter är "överspelade", "ingen spik".
// Vi tar första hästen som nämns nära "överspelad" eller "för stor favorit" och använder det som varning.

function extractWarningFromVass(html) {
  let varning = null;

  const warningMatch = html.match(
    /([A-Za-zÅÄÖåäö0-9\s'".\-]+?)\s+(?:är|blir|känns)[^.!?]{0,60}(överspelad|för stor favorit|inte spelvärd)/i
  );

  if (warningMatch && warningMatch[1]) {
    varning = warningMatch[1].trim();
  }

  return { varning };
}

// ------------------------------------------------
// Fallbackbyggare om vi inte hittar allt
// ------------------------------------------------

function fallbackSpik() {
  return "Hickovelocissimo";
}
function fallbackSkrall() {
  return "Lion Mearas";
}
function fallbackVarning() {
  return "Francesco Zet";
}

function buildOmgInfo() {
  // På sikt ska vi plocka detta från en ATG-startlist-URL.
  return {
    bana: "Romme",
    datum: "Lördag 1 november 2025",
    spelstopp: "16:20",
    jackpot: "≈42 miljoner kr i potten",
    beskrivning:
      "Tuff omgång på Romme. Flera öppna lopp och inte lika tung favoritdominans som senast. 8 lopp, utdelning ända ner till 5 rätt. Du kan spela sänkt insats (30%, 50%, 70%) så systemet inte blir för dyrt.",
  };
}

function buildFormFallback() {
  return [
    {
      name: "Hickovelocissimo",
      avd: "4",
      form: "1-1-2",
      streck: "28%",
      signal: "Stabil toppform",
      color: "green",
    },
    {
      name: "Lion Mearas",
      avd: "6",
      form: "4-3-5",
      streck: "5%",
      signal: "Undervärderad skräll",
      color: "yellow",
    },
    {
      name: "Francesco Zet",
      avd: "1",
      form: "–",
      streck: "68%",
      signal: "Högprocentare med frågetecken",
      color: "red",
    },
  ];
}

function buildStallSnackFallback() {
  return [
    {
      name: "Francesco Zet",
      avd: "1",
      quote: "Behöver lopp i kroppen efter vila.",
      signal: "Risk för ringrost",
      color: "yellow",
    },
    {
      name: "Lion Mearas",
      avd: "6",
      quote: "Känns bättre än raden. Kan överraska.",
      signal: "Möjlig skräll",
      color: "green",
    },
    {
      name: "Hickovelocissimo",
      avd: "4",
      quote: "Allt känns bra. Inga ändringar. Kör för vinst.",
      signal: "Spikläge",
      color: "green",
    },
  ];
}

function buildBanaFallback() {
  return {
    underlag:
      "Romme – medelrask bana. Fördel spets men det går att vinna bakifrån över lång distans.",
    spelvarde:
      "Jackpot ≈42 Mkr. Flera lopp öppna och favorittrycket är lägre än normalt.",
    snabbcheck:
      "8 lopp • Spelstopp 16:20 • Utdelning ända ner till 5 rätt.",
  };
}

// ------------------------------------------------
// Huvudflöde
// ------------------------------------------------

async function main() {
  console.log("📡 Hämtar källor...");

  // 1. hämta källor
  const travstuganHtml = await fetchText("https://travstugan.se/v85");
  const trav365Html = await fetchText(
    "https://www.aftonbladet.se/sportbladet/trav365/"
  );
  const vassHtml = await fetchText(
    "https://www.atg.se/V85/tips/vass-eller-kass-v85-lordag"
  );

  // 2. extrahera tips från källorna
  const { spik: stuganSpik, skrall: stuganSkrall } =
    extractFromTravstugan(travstuganHtml);

  const { spik: t365Spik, skrall: t365Skrall } =
    extractFromTrav365(trav365Html);

  const { varning: vassVarning } = extractWarningFromVass(vassHtml);

  // 3. välj bästa hittade spik / skräll / varning (priosystem)
  const spikName = stuganSpik || t365Spik || fallbackSpik();
  const skrallName = stuganSkrall || t365Skrall || fallbackSkrall();
  const varningName = vassVarning || fallbackVarning();

  console.log("🔑 Spik vald:", spikName);
  console.log("💣 Skräll vald:", skrallName);
  console.log("⚠️  Varning vald:", varningName);

  // 4. Bygg nya dataobjektet
  const newData = {
    omgang: buildOmgInfo(),
    snabbfakta: {
      antalLopp: "8",
      radpris: "0,50 kr / rad",
      utdelning: "8 / 7 / 6 / 5 rätt",
      spelstopp: "16:20",
      aterbetalning: "65%",
    },
    nycklar: {
      spik: {
        titel: spikName,
        text: "Spikförslag enligt senaste analyser.",
        tone: "green",
      },
      skrall: {
        titel: skrallName,
        text: "Lågprocentare med chans att skrälla.",
        tone: "yellow",
      },
      varning: {
        titel: varningName,
        text: "Stor favorit med frågetecken.",
        tone: "red",
      },
    },
    formbarometer: buildFormFallback(),
    stallSnack: buildStallSnackFallback(),
    bana: buildBanaFallback(),
  };

  // 5. skriv ner public/data.json
  const outPath = path.join(__dirname, "public", "data.json");
  writeFileSync(outPath, JSON.stringify(newData, null, 2), "utf8");

  console.log("✅ Ny data.json skapad i public/ (med automatisk spik/skräll/varning där det gick)");
}

main().catch((err) => {
  console.error("❌ Något gick fel i update-data:", err);
});

