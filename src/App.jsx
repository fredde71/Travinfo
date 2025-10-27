import React, { useState } from "react";

export default function App() {
  // Liten interaktiv test-knapp så vi ser att React funkar
  const [loadingRound, setLoadingRound] = useState(false);

  const omgInfo = {
    bana: "Jägersro",
    datum: "Lördag 25 oktober 2025",
    spelstopp: "16:10",
    jackpot: "≈85 miljoner kr i potten",
    beskrivning:
      "8 lopp. Du kan vinna även på 7, 6 och 5 rätt. Radpris 0,50 kr/rad och du kan sänka insatsen till 30%, 50% eller 70% på ett matematiskt system.",
  };

  const expertNycklar = [
    {
      label: "Spik-idé",
      häst: "Hickovelocissimo",
      avdelning: "Avd 4",
      källa: "Tipskungen (Trav365)",
      note: "Bedöms som stabil spik trots tuff omgång.",
    },
    {
      label: "Skrällvarning",
      häst: "Lion Mearas",
      avdelning: "Avd 6",
      källa: "Tipskungen (Trav365)",
      note: "Kan spräcka kuponger till låg procent.",
    },
    {
      label: "Varning på favorit",
      häst: "Francesco Zet",
      avdelning: "Avd 1",
      källa: "Tipskungen (Trav365)",
      note: "Haft långt tävlingsuppehåll – risk för ringrost.",
    },
  ];

  const källor = [
    {
      titel: "ATG V85 – startlistor, spel & Harry Boy",
      beskrivning:
        "Officiella startlistor, streckfördelning, speltyper (eget system, Harry Boy, Tillsammans) och liveuppdateringar från ATG.",
      href: "https://www.atg.se/v85",
      taggar: ["Officiellt", "Startlistor", "Streck%"],
    },
    {
      titel: "Travstugan – V85 tips & andelar",
      beskrivning:
        "Gratis systemförslag, spik/såga-analys och möjlighet att gå in i andelssystem inför aktuell omgång.",
      href: "https://travstugan.se/v85",
      taggar: ["Andelsspel", "Gratis tips"],
    },
    {
      titel: "Rekatochklart – V85 analys idag",
      beskrivning:
        "Skriver upp rank, idéer och värdehästar. Förklarar sänkt insats och hur du håller nere kostnaden.",
      href: "https://www.rekatochklart.com/trav/v85-tips/",
      taggar: ["Rank", "Värdehästar"],
    },
    {
      titel: "Trav365 / Aftonbladet – Tipskungens drag",
      beskrivning:
        "Experten går igenom spikar, skrällar och vilka storfavoriter som kan falla. Bra snabböversikt.",
      href: "https://www.aftonbladet.se/sportbladet/trav365/",
      taggar: ["Spikar", "Skrällar", "Jackpot-info"],
    },
  ];

  const faktaV85 = [
    {
      rubrik: "Radpris",
      text: "0,50 kr per rad. Du kan sänka insatsen till 30%, 50% eller 70% på ett matematiskt system (max 2 000 rader).",
    },
    {
      rubrik: "Utdelning",
      text: "Vinster betalas ut på 8, 7, 6 och 5 rätt.",
    },
    {
      rubrik: "Jackpot",
      text: "Om ingen har alla rätt eller om en pool skulle ge under 5 kr, går pengarna normalt vidare som jackpot till nästa ordinarie omgång.",
    },
    {
      rubrik: "Spelstopp (lördagar)",
      text: "16:10.",
    },
    {
      rubrik: "Var körs V85?",
      text: "Ordinarie omgång körs lördagar runt om i landet. Premiär var Jägersro 25/10/2025.",
    },
  ];

  const live = [
    {
      titel: "ATG Live / sändning",
      desc: "Liverace, intervjuer i vinnarcirkeln, pulsen direkt från banan.",
      href: "https://www.atg.se/play",
    },
    {
      titel: "Travstugan Live-uppdatering",
      desc: "Uppdateringar om spikar spricker, skrällar, mm under eftermiddagen.",
      href: "https://travstugan.se/v85",
    },
    {
      titel: "Trav365 Live",
      desc: "Minut-för-minut, citat från stall och kuskar.",
      href: "https://www.aftonbladet.se/sportbladet/trav365/",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      {/* NAV */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="omgangskollen-dark.png?v=brand"
              alt="Omgångskollen"
              className="h-10 w-10 rounded-md bg-black border border-green-500 object-contain"
            />
            <span className="text-xs text-zinc-400">
              Allt inför lördagens omgång
            </span>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-zinc-300">
            <a href="#omgangen" className="hover:text-white">
              Omgång
            </a>
            <a href="#nycklar" className="hover:text-white">
              Spik / Skräll
            </a>
            <a href="#lankar" className="hover:text-white">
              Tips & länkar
            </a>
            <a href="#fakta" className="hover:text-white">
              Fakta om V85
            </a>
            <a href="#live" className="hover:text-white">
              Live
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 flex flex-col gap-16">
        {/* FUNKTIONSTEST */}
        <section className="border border-zinc-800 rounded-2xl p-4 bg-zinc-900/40 max-w-md">
          <div className="text-xs text-zinc-400 font-mono uppercase tracking-wide mb-2">
            Funktionstest
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed mb-4">
            Tryck på knappen för att se att React är igång:
          </p>

          <TestButton />
        </section>

        {/* OM OMGÅNGEN */}
        <section
          id="omgangen"
          className="grid gap-8 lg:grid-cols-[1fr,360px] lg:items-start"
        >
          <div className="bg-gradient-to-br from-green-600/10 via-zinc-900 to-zinc-900/0 border border-zinc-800 rounded-2xl p-6 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.8)]">
            <div className="text-sm text-zinc-400 font-mono uppercase tracking-wide mb-2">
              Aktuell omgång
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
              V85 {omgInfo.bana} – {omgInfo.datum}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-zinc-200 text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-100 rounded-md px-2 py-1 text-xs font-medium">
                  Spelstopp {omgInfo.spelstopp}
                </span>
              </div>
              <div className="text-green-400 font-medium">
                {omgInfo.jackpot}
              </div>
            </div>

            <p className="mt-6 text-zinc-300 leading-relaxed text-base max-w-xl">
              {omgInfo.beskrivning}
            </p>

            <ul className="mt-6 grid gap-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-zinc-500">•</span>
                <span>
                  Utdelning delas i fyra pooler: 8 rätt (35%), 7 rätt (15%), 6
                  rätt (15%), 5 rätt (35%).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500">•</span>
                <span>
                  Jackpot om ingen får alla rätt eller om en pool annars skulle
                  ge &lt;5 kr.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500">•</span>
                <span>
                  “Sänkt insats” = du kan spela fler hästar men tar ner din egen
                  utdelning procentuellt.
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.atg.se/v85"
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-green-600 text-zinc-900 font-semibold px-4 py-3 text-sm hover:bg-green-500 transition"
              >
                Spela / startlista på ATG
              </a>

              <a
                href="#lankar"
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-zinc-700 text-zinc-200 font-semibold px-4 py-3 text-sm hover:bg-zinc-800 transition"
              >
                Se alla tips
              </a>
            </div>

            <div className="mt-4 text-[10px] text-zinc-500 leading-relaxed max-w-md">
              Spel kan vara beroendeframkallande. Stödlinjen: 020-81 91 00.
              Åldersgräns 18+.
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-xs text-zinc-400 uppercase font-mono tracking-wide mb-2">
                Snabbfakta V85
              </div>
              <dl className="text-sm text-zinc-200 space-y-2">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Antal lopp</dt>
                  <dd className="font-medium text-zinc-100">8</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Radpris</dt>
                  <dd className="font-medium text-zinc-100">0,50 kr / rad</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Utdelning</dt>
                  <dd className="font-medium text-zinc-100">
                    8 / 7 / 6 / 5 rätt
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Spelstopp</dt>
                  <dd className="font-medium text-zinc-100">
                    {omgInfo.spelstopp}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Återbetalning</dt>
                  <dd className="font-medium text-zinc-100">65%</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-xs text-zinc-400 uppercase font-mono tracking-wide mb-2">
                Sänkt insats?
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Du kan välja 30%, 50% eller 70% insats på ett (1) matematiskt
                system (max 2 000 rader). Din utdelning blir då samma procent av
                ordinarie utdelning. Ex: 1 000 000 kr → 50% insats = 500 000 kr.
              </p>
            </div>
          </aside>
        </section>

        {/* NYCKELHÄSTAR */}
        <section id="nycklar" className="space-y-6">
          <header className="flex flex-col gap-2">
            <div className="text-sm text-zinc-400 font-mono uppercase tracking-wide">
              Spik / Skräll / Varningar
            </div>
            <h2 className="text-xl font-semibold text-white">
              Experternas nyckelhästar
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Snabbt bordssnack innan du bygger kupongen. Vi sammanfattar vad
              travprofilerna säger – klicka vidare under “Tips & länkar” för
              full analys och motivering.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expertNycklar.map((rad, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 flex flex-col"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono tracking-wide text-green-400">
                    {rad.label}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {rad.källa}
                  </span>
                </div>

                <div className="mt-3 text-lg font-semibold text-white leading-tight">
                  {rad.häst}
                </div>
                <div className="text-xs text-zinc-400">{rad.avdelning}</div>

                <p className="mt-3 text-sm text-zinc-300 leading-relaxed flex-1">
                  {rad.note}
                </p>

                <div className="mt-4 text-[10px] text-zinc-500">
                  Obs: detta är en sammanfattning. Läs full motivering via
                  källan innan du spikar tungt.
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LÄNKAR */}
        <section id="lankar" className="space-y-6">
          <header className="flex flex-col gap-2">
            <div className="text-sm text-zinc-400 font-mono uppercase tracking-wide">
              Tips & länkar
            </div>
            <h2 className="text-xl font-semibold text-white">
              Fördjupning, system & andelar
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Här är de vanligaste källorna spelare läser inför lördagen:
              startlistor, rank, systemförslag, intervjuer med kuskar/tränare
              och andelsspel.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {källor.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-white leading-tight">
                    {item.titel}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.taggar.map((t, j) => (
                      <span
                        key={j}
                        className="text-[10px] bg-zinc-800/80 border border-zinc-700 text-zinc-300 rounded-md px-2 py-1 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-sm text-zinc-300 leading-relaxed flex-1">
                  {item.beskrivning}
                </p>

                <a
                  className="mt-4 inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/40 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Läs mer / gå till sidan →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAKTA */}
        <section id="fakta" className="space-y-6">
          <header className="flex flex-col gap-2">
            <div className="text-sm text-zinc-400 font-mono uppercase tracking-wide">
              Fakta
            </div>
            <h2 className="text-xl font-semibold text-white">
              Så funkar V85 (kortfattat)
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Detta är grunden i den nya spelformen som ersätter V75 på
              lördagar. Målet är fortfarande att sätta vinnaren i varje
              avdelning – men nu är det åtta lopp och det finns fler
              vinstchanser och möjlighet till högre toppvinster.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {faktaV85.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col"
              >
                <div className="text-sm font-semibold text-white">
                  {f.rubrik}
                </div>
                <div className="mt-2 text-sm text-zinc-300 leading-relaxed flex-1">
                  {f.text}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-green-700/10 p-5">
            <div className="text-sm font-semibold text-white">
              Viktigt om ansvar
            </div>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-2xl">
              Spela aldrig för pengar du inte har råd att förlora. Sök stöd om
              du känner att spelandet inte är kul längre.
            </p>
            <p className="mt-4 text-[10px] text-zinc-500">
              Stödlinjen: 020-81 91 00 • Endast 18+
            </p>
          </div>
        </section>

        {/* LIVE */}
        <section id="live" className="space-y-6">
          <header className="flex flex-col gap-2">
            <div className="text-sm text-zinc-400 font-mono uppercase tracking-wide">
              Live
            </div>
            <h2 className="text-xl font-semibold text-white">
              Följ omgången i realtid
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Här kan du se loppen, få sista-minuten-info om balansändringar,
              värmningar, strykningar och chockskrällar.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {live.map((row, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col"
              >
                <div className="text-sm font-semibold text-white">
                  {row.titel}
                </div>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed flex-1">
                  {row.desc}
                </p>
                <a
                  className="mt-4 inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/40 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition"
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gå till live →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-800 pt-10 pb-16 text-xs text-zinc-500 leading-relaxed">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div>
              <div className="font-semibold text-zinc-300">
                Omgångskollen
              </div>
              <div className="text-zinc-500">
                Ett samlat läge för travspelare. Alla tipshubbar på ett ställe.
              </div>
            </div>

            <div className="text-zinc-600 max-w-md">
              Omgångskollen äger inte eller driver inte ATG® eller deras
              produkter. All extern analys, rank och spelinformation tillhör
              respektive källa. Spela ansvarsfullt.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Separat komponent för knappen
function TestButton() {
  const [loadingRound, setLoadingRound] = useState(false);

  return (
    <button
      className="rounded-lg bg-green-600 text-zinc-900 font-semibold text-sm px-4 py-2 hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loadingRound}
      onClick={() => {
        setLoadingRound(true);
        setTimeout(() => {
          setLoadingRound(false);
          alert('Ny omgång laddas… (demo)');
        }, 800);
      }}
    >
      {loadingRound ? "Jobbar..." : "Ladda nästa omgång"}
    </button>
  );
}
