import fs from "fs";
import fetch from "node-fetch";

async function main() {
  console.log("🔄 Hämtar veckans V85-data...");

  const atgUrl = "https://www.atg.se/services/racinginfo/v1/api/products/V86";
  let bana = "Okänd bana";
  let datum = "Okänt datum";
  let jackpot = "—";

  try {
    const res = await fetch(atgUrl);
    const json = await res.json();

    console.log("ATG-rådata (första 200 tecken):");
    console.log(JSON.stringify(json).slice(0, 200) + "...");

    const race =
      (Array.isArray(json?.upcoming) && json.upcoming[0]) ||
      (Array.isArray(json?.results) && json.results[0]) ||
      null;

    if (race) {
      bana = race.tracks?.map(t => t.name).join(" / ") || "Okänd bana";
      datum = race.startTime
        ? new Date(race.startTime).toLocaleDateString("sv-SE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          })
        : "Okänt datum";
      jackpot = race.jackpot
        ? `${race.jackpot.toLocaleString("sv-SE")} kr i potten`
        : "Ingen jackpotinfo";
    } else {
      console.log("Ingen tydlig omgång hittades i ATG-svaret, använder fallbackvärden.");
    }
  } catch (err) {
    console.error("Fel vid hämtning eller tolkning av ATG-data:", err.message);
  }

  const data = {
    omgang: {
      bana,
      datum,
      spelstopp: "16:20",
      jackpot,
      beskrivning: "Automatisk uppdatering via script."
    },
    snabbfakta: {
      antalLopp: "8",
      radpris: "0,50 kr / rad",
      utdelning: "8 / 7 / 6 / 5 rätt",
      spelstopp: "16:20",
      aterbetalning: "65%"
    },
    nycklar: {
      spik: { titel: "Ej uppdaterad", text: "Väntar på analys.", tone: "gray" },
      skrall: { titel: "Ej uppdaterad", text: "Väntar på analys.", tone: "gray" },
      varning: { titel: "Ej uppdaterad", text: "Väntar på analys.", tone: "gray" }
    }
  };

  fs.writeFileSync("./public/data.json", JSON.stringify(data, null, 2), "utf8");
  console.log("✅ Ny data.json skapad i public/");
}

main();
