import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("./data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte läsa data.json");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Kunde inte ladda veckans omgång. Testa att köra update-scriptet igen.");
      });
  }, []);

  const omg = data?.omgang || data || {};
  const bana = omg.bana || omg.track || "Okänd bana";
  const datum = omg.datum || omg.date || "";
  const spelstopp = omg.spelstopp || omg.spelstoppTid || "";
  const beskrivning =
    omg.beskrivning ||
    omg.description ||
    "Beskrivning kommer snart. Men all info uppdateras automatiskt så fort ATG släpper nästa V85-omgång.";

  const nycklar = data?.nycklar || {
    spik: {
      titel: "Veckans spik",
      text: "När datan är på plats kan du lägga in din bästa idé här, eller låta ett script föreslå spik.",
      tone: "green",
    },
    skrall: {
      titel: "Rolig skräll",
      text: "En rolig procentare som kan lyfta systemet rejält.",
      tone: "yellow",
    },
    varning: {
      titel: "Varning",
      text: "Hästar/streck du tycker är överstreckade – perfekt att gardera.",
      tone: "red",
    },
  };

  const tipsLinks = [
    {
      name: "ATG",
      href: "https://www.atg.se/",
      desc: "Officiell info, startlistor och spel på V85.",
      logo: "./logos/atg.svg",
      tag: "Officiellt",
    },
    {
      name: "Travstugan",
      href: "https://travstugan.se/",
      desc: "Skribenter med både spikar och skrällar till V-loppen.",
      logo: "./logos/travstugan.svg",
      tag: "Blogg & tips",
    },
    {
      name: "Trav365 (Aftonbladet)",
      href: "https://www.aftonbladet.se/sportbladet/trav365/",
      desc: "Genomgångar, drag och spelkrönikor.",
      logo: "./logos/trav365.svg",
      tag: "Nyheter",
    },
    {
      name: "Travronden",
      href: "https://www.travronden.se/",
      desc: "Analys, intervjuer och pdf-tips (mycket V75/V86 men bra info).",
      logo: "./logos/travronden.svg",
      tag: "Premium/nyheter",
    },
    {
      name: "Fem Tippar",
      href: "https://www.travronden.se/trav/fem-tippar",
      desc: "Fem olika systemförslag – inspirerande även till V85.",
      logo: "./logos/femtippar.svg",
      tag: "Systemidéer",
    },
    {
      name: "Thomas Uhrberg",
      href: "https://thomasuhrberg.se/",
      desc: "Uhrbergs syn på loppen, hästarna och form.",
      logo: "./logos/uhrberg.svg",
      tag: "Profiler",
    },
    {
      name: "Andelstorget",
      href: "https://andelstorget.se/",
      desc: "Köp andelar om du inte vill spela själv.",
      logo: "./logos/andelstorget.svg",
      tag: "Andelsspel",
    },
  ];

  const toneClasses = {
    green: "bg-emerald-50 border-emerald-200",
    yellow: "bg-amber-50 border-amber-200",
    red: "bg-rose-50 border-rose-200",
  };

  if (!data && !error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700">
        <img
          src="./omgangskollen-dark.png"
          alt="Omgångskollen"
          className="h-16 w-auto mb-4 opacity-80"
        />
        <p className="text-sm">⏳ Hämtar veckans V85-omgång…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="./omgangskollen-dark.png"
              alt="Omgångskollen"
              className="h-6 w-auto"
            />
            <span className="font-semibold tracking-tight text-slate-900">
              Omgångskollen
            </span>
          </div>
          <ul className="hidden sm:flex gap-4 text-xs sm:text-sm text-slate-600">
            <li>
              <a href="#omgang" className="hover:text-slate-900">
                🏁 Omgång
              </a>
            </li>
            <li>
              <a href="#nycklar" className="hover:text-slate-900">
                🎯 Spikar & drag
              </a>
            </li>
            <li>
              <a href="#verktyg" className="hover:text-slate-900">
                🧮 Verktyg
              </a>
            </li>
            <li>
              <a href="#gratis-tips" className="hover:text-slate-900">
                📚 Gratis tips
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* HERO */}
        <section
          id="hero"
          className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-center"
        >
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              <span className="text-lg">💡</span> Din genväg till V85-känslan
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Allt inför <span className="text-sky-700">veckans V85</span> på
              ett ställe.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              Omgångskollen samlar omgångens info, spikar, skrällar och
              genvägar till de bästa gratis-tipsen. Perfekt att ha öppet bredvid
              ATG när du bygger system.
            </p>

            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                <span className="text-lg">🏟️</span>
                <div>
                  <div className="font-semibold">{bana}</div>
                  <div className="text-[11px] text-slate-500">
                    Bana för veckans V85
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                <span className="text-lg">🕒</span>
                <div>
                  <div className="font-semibold">
                    {spelstopp || "Spelstopp senare i veckan"}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {datum || "Datum uppdateras automatiskt"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Snabbkoll-kort */}
          <div className="space-y-3">
            <div className="rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 text-white p-4 shadow-lg">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-sky-100 mb-1">
                    Veckans omgång
                  </p>
                  <p className="text-sm font-semibold">
                    {bana} {datum && `• ${datum}`}
                  </p>
                  <p className="mt-2 text-xs text-sky-100/90 leading-relaxed">
                    {beskrivning}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
                <div className="text-[11px] font-medium text-slate-500 uppercase">
                  Spelstopp
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {spelstopp || "Inte klart än"}
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Dubbelkolla alltid på ATG innan du lämnar in systemet.
                </p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
                <div className="text-[11px] font-medium text-slate-500 uppercase">
                  Nästa steg
                </div>
                <ul className="mt-1 space-y-1 text-[11px] text-slate-600">
                  <li>• Skumma spikar & skrällar</li>
                  <li>• Kolla gratis-tips</li>
                  <li>• Bygg din grundkupong</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FELMEDDELANDE OM DATA */}
        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            ⚠️ {error}
          </div>
        )}

        {/* NYCKLAR: SPIK / SKRÄLL / VARNING */}
        <section id="nycklar" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              🎯 Spikar, skrällar & varningar
            </h2>
            <span className="text-[11px] text-slate-500">
              En snabb känsla för omgången
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {Object.entries(nycklar).map(([key, item]) => (
              <div
                key={key}
                className={`rounded-xl border p-4 shadow-sm text-sm ${
                  toneClasses[item.tone] || "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="text-[11px] font-mono uppercase text-slate-500 mb-1">
                  {key === "spik"
                    ? "Spik"
                    : key === "skrall"
                    ? "Skräll"
                    : "Varning"}
                </div>
                <h3 className="font-semibold mb-1">{item.titel}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* VECKANS KUPONG (placeholder som du kan bygga vidare på) */}
        <section id="verktyg" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              🧮 Veckans kupong & verktyg
            </h2>
            <span className="text-[11px] text-slate-500">
              Perfekt när du bygger systemet
            </span>
          </div>

          <div className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
            {/* Kupong */}
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="font-semibold text-sm sm:text-base">
                  🎟️ Förslag: grundkupong till V85
                </h3>
                <span className="text-[11px] text-slate-500">
                  Demo – fyll på med dina idéer
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((avd) => (
                  <div
                    key={avd}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"
                  >
                    <div className="text-[10px] text-slate-500 mb-1">
                      Avd {avd}
                    </div>
                    <div className="font-semibold text-slate-800 mb-0.5">
                      {/* Här kan du senare hämta förslag från data.json */}
                      {
                        {
                          1: "Spik",
                          2: "3–5 streck",
                          3: "Skiktat",
                          4: "Skrälläge",
                          5: "Spik/2-hästarslås",
                          6: "Gardering",
                          7: "Öppet",
                          8: "Breda streck",
                        }[avd]
                      }
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Lägg in hästar & procent senare.
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Tanken: använd Omgångskollen för helheten, sedan ATG för
                detaljer och inlämning. Här kan vi senare bygga logik som
                föreslår system baserat på dina spikar/skällar.
              </p>
            </div>

            {/* Verktygskolumn */}
            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">🌦 Väder & bana</h3>
                  <span className="text-[10px] text-slate-500">Kommer snart</span>
                </div>
                <p className="mt-1 text-slate-600">
                  Här kan vi koppla in automatiskt väder för banan (regn, vind,
                  temperatur) och snabbinfo om underlag.
                </p>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
                <h3 className="font-semibold text-sm">📊 Banafakta</h3>
                <p className="mt-1 text-slate-600">
                  Exempel: upploppets längd, open stretch, vinklad vinge, plus
                  små notiser som &quot;spets extra gynnad&quot; eller
                  &quot;starka hästar går i dödens&quot;.
                </p>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
                <h3 className="font-semibold text-sm">🧠 Checklista</h3>
                <ul className="mt-1 space-y-1 text-slate-600">
                  <li>• Gå igenom alla favoriter – vilka är sårbara?</li>
                  <li>• Hitta 1–2 riktiga skrällopp.</li>
                  <li>• Sätt en tydlig budget per omgång.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* GRATIS TIPS & LÄNKAR */}
        <section id="gratis-tips" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              📚 Gratis tips & resurser
            </h2>
            <span className="text-[11px] text-slate-500">
              Öppna i nya flikar medan du bygger systemet
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {tipsLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl bg-white border border-slate-200 p-3 flex gap-3 items-start shadow-sm hover:border-sky-300 hover:shadow-md transition"
              >
                <div className="h-8 w-8 rounded-md bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-slate-500">
                      {item.name[0]}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900 text-sm">
                      {item.name}
                    </span>
                    {item.tag && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-snug">{item.desc}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-sky-700 group-hover:underline">
                    Öppna sida
                    <span>↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 pt-4 pb-6 text-center text-[11px] text-slate-500">
          <p>Spela ansvarsfullt. 18+ Stödlinjen: 020-81 91 00.</p>
          <p className="mt-1">
            Omgångskollen är en fristående sida och har ingen koppling till ATG.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
