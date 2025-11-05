import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const OUT_PATH = path.join("public", "data.json");

async function fetchV85Info() {
  try {
    const res = await fetch("https://www.atg.se/services/racinginfo/v1/api/products/V86"); // V86 används även för V85-info
    const json = await res.json();

    const next = json.upcoming[0];
    const bana = next.track.name;
    const datum = new Date(next.startTime).toLocaleDateString("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const spelstopp = new Date(next.startTime).toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      bana,
      datum,
      spelstopp,
      jackpot: next.jackpot ? `≈${next.jackpot / 1_000_000} miljoner kr` : "",
      beskrivning: `Aktuell omgång på ${bana}. Spelstopp ${spelstopp}.`
    };
  } catch (e) {
    console.error("Fel vid hämtning av ATG-info:", e);
    return null;
  }
}

async function fetchTips() {
  // Här kan vi lägga in fler källor senare – start enkelt
  return {
    spik: { titel: "Favorit från senast", text: "Analyseras automatiskt", tone: "green" },
    skrall: { titel: "Lågprocentare", text: "Kan chocka fältet", tone: "yellow" },
    varning: { titel: "Storfavorit med frågetecken", text: "Kan bli över", tone: "red" },
  };
}

async function main() {
  console.log("🔄 Hämtar veckans V85-data...");

  const omgang = await fetchV85Info();
  const nycklar = await fetchTips();

  if (!omgang) {
    console.error("Kunde inte hämta ATG-data. Avbryter.");
    return;
  }

  const data = {
    omgang,
    snabbfakta: {
      antalLopp: "8",
      radpris: "0,50 kr / rad",
      utdelning: "8 / 7 / 6 / 5 rätt",
      spelstopp: omgang.spelstopp,
      aterbetalning: "65%",
    },
    nycklar,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(data, null, 2));
  console.log(`✅ Ny data.json skapad (${omgang.bana}, ${omgang.datum})`);
}

main();
