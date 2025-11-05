import { useEffect, useState } from "react";

const navItems = [
  { id: "omgang", label: "🏁 Omgång" },
  { id: "nycklar", label: "🎯 Spikar & skrällar" },
  { id: "tips", label: "🧩 Tips & analyser" },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="text-sm">🔄 Laddar omgång...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="text-sm">Något gick fel när datan skulle hämtas.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="./omgangskollen-dark.png"
              alt="Omgångskollen"
              className="h-7 w-auto rounded-sm"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-[0.12em] text-slate-500">
                Travinfo
              </span>
              <span className="font-semibold tracking-tight text-slate-900">
                Omgångskollen
              </span>
            </div>
          </div>

          <ul className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-600">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full hover:bg-slate-100 hover:text-slate-900 transition text-[0.75rem]"
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 pb-10">
        {/* Hero */}
        <section id="top" className="pt-6 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-sky-800 uppercase tracking-[0.16em]">
                Veckans V85
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">
                Omgångskollen
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-xl">
                Samlar omgångsinfo, spikar, skrällar och länkar till analyser –
                på ett ställe innan du lämnar in dina system.
              </p>
            </div>

            <div className="rounded-xl bg-sky-900 text-sky-50 px-4 py-3 text-sm shadow-md">
              <div className="text-[0.7rem] uppercase tracking-[0.16em] text-sky-200">
                Nästa omgång
              </div>
              <div className="mt-1 font-semibold">
                {data.omgang.bana} – {data.omgang.datum}
              </div>
              <div className="mt-1 text-xs text-sky-100">
                {data.omgang.beskrivning}
              </div>
            </div>
          </div>
        </section>

        {/* Omgång */}
        <section id="omgang" className="pt-4 space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              🏁 Veckans omgång
            </h2>
            <button
              type="button"
              className="text-[0.7rem] text-sky-700 hover:text-sky-900 underline-offset-2 hover:underline"
              onClick={() => scrollToSection("tips")}
            >
              Hoppa till tips →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-800 px-3 py-0.5 text-xs font-medium border border-sky-100">
                {data.omgang.bana}
              </span>
              <span className="text-xs text-slate-500">
                {data.omgang.datum}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              {data.omgang.beskrivning}
            </p>
          </div>
        </section>

        {/* Spikar & skrällar */}
        <section id="nycklar" className="pt-8 space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            🎯 Spikar & skrällar
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
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

              return (
                <div
                  key={key}
                  className={`rounded-2xl border shadow-sm p-4 flex flex-col ${base}`}
                >
                  <div className="text-[0.7rem] font-mono uppercase tracking-[0.18em] text-slate-500 mb-1">
                    {label}
                  </div>
                  <h3 className="text-base font-semibold leading-snug">
                    {nyckel.titel}
                  </h3>
                  <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                    {nyckel.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tips & analyser */}
        <section id="tips" className="pt-8 space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            🧩 Tips & analyser
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="https://www.atg.se/V85/tips"
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-sky-300 hover:shadow-md transition"
            >
              <div className="text-xs font-semibold text-sky-800 uppercase tracking-[0.16em]">
                ATG
              </div>
              <div className="mt-1 text-sm font-semibold">
                Officiella V85-tips
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Startlistor, experttips och senaste infon direkt från ATG.
              </p>
            </a>

            <a
              href="https://travstugan.se/v85"
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-sky-300 hover:shadow-md transition"
            >
              <div className="text-xs font-semibold text-slate-800 uppercase tracking-[0.16em]">
                Travstugan
              </div>
              <div className="mt-1 text-sm font-semibold">
                Stugans analyser
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Speldrag och systemförslag från Travstugans tippare.
              </p>
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-6">
        <div className="max-w-5xl mx-auto px-4 py-4 text-[0.7rem] text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>Spela ansvarsfullt. 18+ Stödlinjen: 020-81 91 00.</span>
          <span className="text-[0.65rem] text-slate-400">
            Omgångskollen – inofficiell hjälpsida för V85-spelare.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
