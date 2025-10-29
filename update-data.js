// update-data.js
// Steg B: Försök hämta riktig info från öppna källor och skriva till public/data.json
// Du kör: npm run update-data

import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname-hack för ES-moduler (Node i "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------
// 1. Hjälpfunktioner för att hämta och tolka källor
// -----------------------------------------------------

// Enkel fetch-wrapper (Node 18+ har fetch inbyggt)
async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Kunde inte hämta ${url}: ${res.status}`);
  }
  return await res.text();
}

/*
Vi tänker så här:
- Travstugan har ofta rubriker som "Spiken:" och "Luringen:" inför V85.
- Sportbladet Trav365 skriver ofta om "Vår spik", "Miljonrensaren".
- ATG:s "Vass eller Kass" och "Björnkollen" brukar peka ut en överspelad favorit (varning).
Vi försöker plocka ut de bitarna med enkla regex.

OBS: Detta är första versionen. Om regexen inte matchar en vecka är det lugnt – vi fyller fallback.
*/

function extractSpikFromTravstugan(html) {
  // försök hitta något i stil med "Spiken:" följt av hästnamn
  const match =
    html.match(/Spiken[^:]{0,10}:\s*<\/?(strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäö0-9\s'-]+)/) ||
    html.match(/Spik(?:en)?\s*<\/?(strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäö0-9\s'-]+)/);

  if (match && match[2]) {
    return match[2].trim();
  }
  return null;
}

function extractSkrallFromTravstugan(html) {
  // försök hitta "Skrällen:" eller "Luringen:" etc
  const match =
    html.match(/Skräll(?:en)?[^:]{0,10}:\s*<\/?(strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäö0-9\s'-]+)/) ||
    html.match(/Luring(?:en)?[^:]{0,10}:\s*<\/?(strong|b|span)?[^>]*>\s*([A-Za-zÅÄÖåäö0-9\s'-]+)/);

  if (match && match[2]) {
    return match[2].trim();
  }
  return null;
}

function extractVarningFromVassEllerKass(html) {
  // försök hitta något som liknar "överspelad" / "inte spelvärd" / "pass"
  // vi tar bara ut en häst som nämns i samma mening som "överspelad"
  const block = html.match(/([A-Za-zÅÄÖåäö0-9\s'-]+)\s+(?:är|va[r]|blir)[^.!?]{0,80}överspelad/i);
  if (block && block[1]) {
    return block[1].trim();
  }
  return null;
}

// Vi kan också försöka plocka bana/datum/jackpot
// I början kör vi manuellt här, men här är platsen där vi senare ska få in baninfo från en ATG-startlistsida
function buildOmgInfoFallback() {
  return {
    bana: "Romme",
    datum: "Lördag 1 november 2025",
    spelstopp: "16:20",
    jackpot: "≈42 miljoner kr i potten",
    beskrivning:
      "Tuff omgång på Romme. Flera öppna lopp och inte lika tung favoritdominans som senast. 8 lopp, utdelning ända ner till 5 rätt. Du kan spela sänkt insats (30%, 50%, 70%) så systemet inte blir för dyrt."
  };
}

// Formbarometer kan vi inte automatiskt bedöma utan mer avancerad logik (t.ex. läsa senaste startlistor/hästens formrad).
// Vi behåller fallback tills vi automatiserar detta separat.
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

// StallSnack (citat) är svårt att skrapa snyggt utan att vi vet exakt struktur på sidan som har intervjuer.
// Vi behåller fallback så länge.
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

// Banförutsättningar lägger vi också in fallback tills vi börjar läsa specifikt om banan.
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

// -----------------------------------------------------
// 2. Huvudfunktionen som körs när du gör `npm run update-data`
// -----------------------------------------------------

async function main() {
  // Hämta HTML från källor vi gillar
  // (just nu exempeladresser – du kan uppdatera till korrekta, veckans V85-sida)
  // Travstugan: spik / skräll
  let travstuganHtml = "";
  try {
    travstuganHtml = await fetchText("https://travstugan.se/v85");
  } catch (err) {
    console.warn("⚠ Kunde inte hämta Travstugan. Använder fallback.");
  }

  // Vass eller Kass (ATG): varningar på favoriter
  let vassHtml = "";
  try {
    vassHtml = await fetchText("https://www.atg.se/V85/tips/vass-eller-kass-v85-lordag");
  } catch (err) {
    console.warn("⚠ Kunde inte hämta Vass eller Kass. Använder fallback.");
  }

  // extrahera spik / skräll från Travstugan
  const spikNamn = extractSpikFromTravstugan(travstuganHtml) || "Hickovelocissimo";
  const skrallNamn = extractSkrallFromTravstugan(travstuganHtml) || "Lion Mearas";

  // extrahera varning från Vass eller Kass
  const varningNamn =
    extractVarningFromVassEllerKass(vassHtml) || "Francesco Zet";

  // Bygg ihop dataobjektet som appen behöver
  const newData = {
    omgang: buildOmgInfoFallback(),
    snabbfakta: {
      antalLopp: "8",
      radpris: "0,50 kr / rad",
      utdelning: "8 / 7 / 6 / 5 rätt",
      spelstopp: "16:20",
      aterbetalning: "65%"
    },
    nycklar: {
      spik: {
        titel: spikNamn,
        text: "Spikförslag enligt senaste analyser.",
        tone: "green"
      },
      skrall: {
        titel: skrallNamn,
        text: "Lågprocentare med chans att skrälla.",
        tone: "yellow"
      },
      varning: {
        titel: varningNamn,
        text: "Stor favorit med frågetecken.",
        tone: "red"
      }
    },
    formbarometer: buildFormFallback(),
    stallSnack: buildStallSnackFallback(),
    bana: buildBanaFallback()
  };

  // Skriv till /public/data.json
  const outPath = path.join(__dirname, "public", "data.json");
  writeFileSync(outPath, JSON.stringify(newData, null, 2), "utf8");

  console.log("✅ Ny data.json skapad i public/ med hämtade tips (där det gick).");
}

// Kör!
main().catch((err) => {
  console.error("❌ Något gick fel i update-data:", err);
});

