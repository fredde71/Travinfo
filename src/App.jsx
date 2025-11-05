import { useEffect, useState } from "react";

const navItems = [
  { id: "omgang", label: "🏁 Omgång" },
  { id: "nycklar", label: "🎯 Spikar & skrällar" },
  { id: "gratis", label: "💸 Gratistips" },
  { id: "vader", label: "🌦 Väder" },
];

const freeTipSites = [
  {
    name: "ATG",
    href: "https://www.atg.se/V85/tips",
    description: "Officiella tips, startlistor och senaste info.",
    logo: "./logos/atg.svg",
    tag: "Officiellt",
  },
  {
    name: "Travstugan",
    href: "https://travstugan.se/v85",
    description: "Analyser, speldrag och systemförslag.",
    logo: "./logos/travstugan.svg",
    tag: "Analys",
  },
  {
    name: "Trav365",
    href: "https://www.aftonbladet.se/sportbladet/trav365/",
    description: "Nyheter, tips och drag från Trav365.",
    logo: "./logos/trav365.svg",
    tag: "Nyheter",
  },
  {
    name: "Travronden",
    href: "https://www.travronden.se/",
    description: "Tungt analysmaterial (delvis premium).",
    logo: "./logos/travronden.svg",
    tag: "Premium",
  },
  {
    name: "Fem tippar V75",
    href: "https://www.atg.se/femtippar",
    description: "Fem experter, fem system – bra för känsla.",
    logo: "./logos/femtippar.svg",
    tag: "Översikt",
  },
  {
    name: "Uhrberg",
    href: "https://www.expressen.se/sport/trav/",
    description: "Uhrbergs tankar och drag inför omgångarna.",
    logo: "./logos/uhrberg.svg",
    tag: "Profil",
  },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ladda data.json (omgång, nycklar osv.)
  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="flex flex-col items-center gap-2 text-sm">
          <span className="text-xl animate-pulse">🐴</span>
          <span>Laddar omgångsinformation...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="text-sm text-center">
          <p className="font-semibold mb-1">Något gick fel.</p>
          <p>Det gick inte att läsa in data.json.</p>
        </div>
      </div>
    );
  }

  const trackName = data?.omgang?.bana || "";
  const trackQuery = encodeURIComponent(`${trackName} travbana väder`);
  const smhiUrl = `https://www.smhi.se/vader/prognoser/ortsprognoser?q=${trackQuery}`;
  const yrUrl = `https://www.yr.no/sok?q=${trackQuery}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo + titel */}
          <div className="flex items-center gap-2">
            <img
              src="./omgangskollen-dark.png"
              alt="Omgångskollen"
              className="h-7 w-auto rounded-sm"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
                Travinfo
              </span>
              <span className="font-semibold tracking-tight text-slate-900">
                Omgångskollen
              </span>
            </div>
          </div>

          {/* Desktop-navigering */}
          <ul className="hidden sm:flex items-center gap-3 text-xs font-medium text-slate-600">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full hover:bg-sky-50 hover:text-sky-900 border border-transparent hover:border-sky-200 transition text-[0.75rem]"
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* MAIN */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 pb-10">
          {/* HERO */}
          <section id="top" className="pt-6 pb-5">
            <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-stretch">
              {/* Text + intro */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-sky-900 uppercase tracking-[0.18em]">
                  Veckans V85
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Omgångskollen
                </h1>
                <p className="text-sm text-slate-600 max-w-xl">
                  En enkel överblick över omgång, spikar, skrällar, väder och
                  bästa gratistipsen – allt samlat innan du lämnar in.
                </p>

                <div className="flex flex-wrap gap-2 mt-1 text-[0.7rem] text-slate-500">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100">
                    <span>✅</span> Fokus på spelvärde
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100">
                    <span>⚡</span> Snabb överblick
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100">
                    <span>🎯</span> Spikar & skrällar
                  </span>
                </div>
              </div>

              {/* Omgångs-kort */}
              <div className="rounded-2xl bg-gradient-to-br from-sky-900 to-sky-700 text-sky-50 p-4 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="text-[0.7rem] uppercase tracking-[0.18em] text-sky-200">
                    Nästa omgång
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    {data.omgang.bana} – {data.omgang.datum}
                  </div>
                  {data.omgang.starttid && (
                    <div className="mt-1 text-xs text-sky-100">
                      Starttid: {data.omgang.starttid}
                    </div>
                  )}
                  <p className="mt-3 text-xs text-sky-100 leading-relaxed">
                    {data.omgang.beskrivning}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-300/40">
                    📍 {trackName}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-300/40">
                    🧩 V85-översikt
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Omgångsinfo */}
          <section id="omgang" className="pt-4 space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                🏁 Veckans omgång
              </h2>
              <button
                type="button"
                className="hidden sm:inline-flex text-[0.7rem] text-sky-700 hover:text-sky-900 underline-offset-2 hover:underline"
                onClick={() => scrollToSection("nycklar")}
              >
                Vidare till spikar & skrällar →
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-800 px-3 py-0.5 text-xs font-semibold border border-sky-100">
                  {data.omgang.bana}
                </span>
                <span className="text-xs text-slate-500">
                  {data.omgang.datum}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                {data.omgang.beskrivning}
              </p>
            </div>
          </section>

          {/* Spikar & skrällar */}
          <section id="nycklar" className="pt-8 space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">
              🎯 Spikar & skrällar
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(data.nycklar).map(([key, nyckel]) => {
                const tone = nyckel.tone ?? "green";
                const base =
                  tone === "green"
                    ? "bg-emerald-50 border-emerald-200"
                    : tone === "yellow"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-rose-50 border-rose-200";

                const label =
                  key === "spik"
                    ? "Trygg spik"
                    : key === "skrall"
                    ? "Skrällbud"
                    : "Varning";

                const emoji =
                  key === "spik" ? "✅" : key === "skrall" ? "💣" : "⚠️";

                return (
                  <article
                    key={key}
                    className={`rounded-2xl border shadow-sm p-4 flex flex-col ${base}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[0.7rem] font-mono uppercase tracking-[0.18em] text-slate-500">
                        {label}
                      </div>
                      <span className="text-sm">{emoji}</span>
                    </div>
                    <h3 className="mt-1 text-base font-semibold leading-snug">
                      {nyckel.titel}
                    </h3>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                      {nyckel.text}
                    </p>
                    <div className="mt-auto pt-3 text-[0.7rem] text-slate-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>Fundera: hur påverkar detta ditt system?</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Gratistips med logos */}
          <section id="gratis" className="pt-8 space-y-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                💸 Gratis tips & analyser
              </h2>
              <span className="text-[0.7rem] text-slate-500">
                Öppnas i ny flik – mixa flera källor för bäst känsla.
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {freeTipSites.map((site) => (
                <a
                  key={site.name}
                  href={site.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-sky-300 hover:shadow-md transition flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    {site.logo && (
                      <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200">
                        <img
                          src={site.logo}
                          alt={site.name}
                          className="max-h-6 max-w-6 object-contain"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {site.name}
                      </span>
                      <span className="text-[0.7rem] text-slate-500">
                        {site.tag}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 flex-1">
                    {site.description}
                  </p>
                  <div className="text-[0.7rem] text-sky-700 group-hover:text-sky-900 flex items-center gap-1">
                    <span>Öppna analys</span>
                    <span aria-hidden>↗</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Väder-överblick */}
          <section id="vader" className="pt-8 space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">
              🌦 Väderkollen för {trackName || "banan"}
            </h2>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-stretch">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 shadow-sm">
                <p className="text-xs text-slate-700 leading-relaxed">
                  Väder påverkar tempo, balans och hur banan blir. Kolla alltid
                  väderläget nära spelstopp – särskilt vid{" "}
                  <strong>regn, blåst</strong> eller{" "}
                  <strong>snöblandat regn</strong>.
                </p>
                <ul className="mt-3 text-xs text-slate-700 list-disc pl-4 space-y-1">
                  <li>
                    Blöt bana → kan gynna starka hästar och vissa balansval.
                  </li>
                  <li>
                    Kraftig blåst → ledaren/från rygg ledaren kan få annat läge.
                  </li>
                  <li>
                    Kallt väder → kolla om balans/skor ändras sent.
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3">
                <div className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">
                  Snabba väderlänkar
                </div>
                <a
                  href={smhiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-100 text-xs text-sky-900 transition"
                >
                  <span>SMHI – prognos för {trackName || "banan"}</span>
                  <span aria-hidden>↗</span>
                </a>
                <a
                  href={yrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-900 transition"
                >
                  <span>YR – alternativ prognos</span>
                  <span aria-hidden>↗</span>
                </a>
                <p className="text-[0.7rem] text-slate-500">
                  Tips: uppdatera dessa sidor de sista{" "}
                  <strong>20–30 minuterna</strong> innan spelstopp.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white mt-4">
        <div className="max-w-6xl mx-auto px-4 py-4 text-[0.7rem] text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>Spela ansvarsfullt. 18+ Stödlinjen: 020-81 91 00.</span>
          <span className="text-[0.65rem] text-slate-400">
            Omgångskollen – inofficiell hjälpsida för V85-spelare. Alla
            rekommendationer är personliga, inget är spelgaranti.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
