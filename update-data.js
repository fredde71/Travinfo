// update-data.js
// Version med OVERRIDE-stöd.
// Användning: ändra hästnamnen i OVERRIDE nedan, kör `npm run deploy`.
// Scriptet försöker fortfarande hämta automatiskt från källor, men din override vinner.

import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// 1. MANUELL OVERRIDE ZON 💚
// =============================
// Byt dessa tre värden inför aktuell omgång om du vill styra vad som visas på sajten.
// Lämna som "" (tom sträng) om du vill låta scriptet försöka plocka det automatiskt.
const OVERRIDE = {
  spik: "",
  skrall: "",
  varning: ""
};

// =============================
// 2. Hjälpfunktion att hämta HTML
// =============================
async function fetchText(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        Accept: "text/html,application/xhtml+xml"
      }
    });
    if (!res.ok) {
      console.warn(`⚠ ${url} svarade ${res.status}`);
      return "";
    }
    return await res.text();
  } catch (err) {
    console.warn(`⚠ Kunde inte hämta ${url}:`, err.message);
    return "";
  }
}

// =============================
// 3. Regex för att försöka hitta spik / skräll / varning i källor
// =============================
function extractFromTravstugan(html) {
  let spik = null;
  let skrall = null;

  const spikMatch =
    html.match(
      /Spik(?:en|förslag)?\s*[:\-]\s*<\/?(?:strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäöÉé0-9\s'".\-]+)/i
    ) ||
    html.match(
      /Spik(?:en)?\s*<\/?(?:strong|b|span)[^>]*>\s*([A-Za-zÅÄÖåäöÉé0-9\s'".\-]+)/i
    );

  if (spikMatch && spikMatch[1]) {
    spik = spikMatch[1].trim();
  }

  const skrallMatch =
    html.match(
      /(Skräll(?:en)?|Luring(?:en)?|Miljonrensare(?:n)?)\s*[:\-]\s*<\/?(?:strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäöÉé0-9\s'".\-]+)/i
    ) ||
    html.match(
      /(Skräll(?:en)?|Luring(?:en)?|Miljonrensare(?:n)?)\s*<\/?(?:strong|b|span)[^>]*>\s*([A-Za-zÅÄÖåäöÉé0-9\s'".\-]+)/i
    );

  if (skrallMatch && skrallMatch[2]) {
    skrall = skrallMatch[2].trim();
  }

  return { spik, skrall };
}

function extractFromTrav365(html) {
  let spik = null;
  let skrall = null;

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
    spik = spik365[1].trim();
  }

  const skrall365 = html.match(
    /(Miljonrensare(?:n)?|Skräll(?:en)?)\s*[:\-]\s*<\/?(?:strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäö0-9\s'".\-]+)/i
  );

  if (skrall365 && skrall365[2]) {
    skrall = skrall365[2].trim();
  }

  return { spik, skrall };
}

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

// =============================
// 4. Fallback-block (så sidan alltid funkar)
// =============================
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
  return {
    bana: "Romme",
    datum: "Lördag 1 november 2025",
    spelstopp: "16:20",
    jackpot: "≈42 miljoner kr i potten",
    beskrivning:
      "Tuff omgång på Romme. Flera öppna lopp och inte lika tung favoritdominans som senast. 8 lopp, utdelning ända ner till 5 rätt. Du kan spela sänkt insats (30%, 50%, 70%) så systemet inte blir för dyrt."
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
      color: "green"
    },
    {
      name: "Lion Mearas",
      avd: "6",
      form: "4-3-5",
      streck: "5%",
      signal: "Undervärderad skräll",
      color: "yellow"
    },
    {
      name: "Francesco Zet",
      avd: "1",
      form: "–",
      streck: "68%",
      signal: "Högprocentare med frågetecken",
      color: "red"
    }
  ];
}

function buildStallSnackFallback() {
  return [
    {
      name: "Francesco Zet",
      avd: "1",
      quote: "Behöver lopp i kroppen efter vila.",
      signal: "Risk för ringrost",
      color: "yellow"
    },
    {
      name: "Lion Mearas",
      avd: "6",
      quote: "Känns bättre än raden. Kan överraska.",
      signal: "Möjlig skräll",
      color: "green"
    },
    {
      name: "Hickovelocissimo",
      avd: "4",
      quote: "Allt känns bra. Inga ändringar. Kör för vinst.",
      signal: "Spikläge",
      color: "green"
    }
  ];
}

function buildBanaFallback() {
  return {
    underlag:
      "Romme – medelrask bana. Fördel spets men det går att vinna bakifrån över lång distans.",
    spelvarde:
      "Jackpot ≈42 Mkr. Flera lopp öppna och favorittrycket är lägre än normalt.",
    snabbcheck:
      "8 lopp • Spelstopp 16:20 • Utdelning ända ner till 5 rätt."
  };
}

// =============================
// 5. Huvudflödet
// =============================
async function main() {
  console.log("📡 Hämtar källor...");

  const travstuganHtml = await fetchText("https://travstugan.se/v85");
  const trav365Html = await fetchText(
    "https://www.aftonbladet.se/sportbladet/trav365/"
  );
  const vassHtml = await fetchText(
    "https://www.atg.se/V85/tips/vass-eller-kass-v85-lordag"
  );

  // extrahera automatiska värden
  const { spik: stuganSpik, skrall: stuganSkrall } =
    extractFromTravstugan(travstuganHtml);
  const { spik: t365Spik, skrall: t365Skrall } =
    extractFromTrav365(trav365Html);
  const { varning: vassVarning } = extractWarningFromVass(vassHtml);

  // välj spik / skräll / varning med prioritet:
  // 1. OVERRIDE
  // 2. automatisk hämtning
  // 3. fallback
  const spikName =
    (OVERRIDE.spik && OVERRIDE.spik.trim()) ||
    stuganSpik ||
    t365Spik ||
    fallbackSpik();

  const skrallName =
    (OVERRIDE.skrall && OVERRIDE.skrall.trim()) ||
    stuganSkrall ||
    t365Skrall ||
    fallbackSkrall();

  const varningName =
    (OVERRIDE.varning && OVERRIDE.varning.trim()) ||
    vassVarning ||
    fallbackVarning();

  console.log("🔑 Spik vald:", spikName);
  console.log("💣 Skräll vald:", skrallName);
  console.log("⚠️  Varning vald:", varningName);

  const newData = {
    omgang: buildOmgInfo(),
    snabbfakta: {
      antalLopp: "8",
      radpris: "0,50 kr / rad",
      utdelning: "8 / 7 / 6 / 5 rätt",
      spelstopp: "16:20",
      aterbetalning: "65%"
    },
    nycklar: {
      spik: {
        titel: spikName,
        text: "Spikförslag enligt senaste analyser.",
        tone: "green"
      },
      skrall: {
        titel: skrallName,
        text: "Lågprocentare med chans att skrälla.",
        tone: "yellow"
      },
      varning: {
        titel: varningName,
        text: "Stor favorit med frågetecken.",
        tone: "red"
      }
    },
    formbarometer: buildFormFallback(),
    stallSnack: buildStallSnackFallback(),
    bana: buildBanaFallback()
  };

  const outPath = path.join(__dirname, "public", "data.json");
  writeFileSync(outPath, JSON.stringify(newData, null, 2), "utf8");

  console.log("✅ Ny data.json skapad i public/ (override/auto/fallback mix klar)");
}

main().catch((err) => {
  console.error("❌ Något gick fel i update-data:", err);
});

