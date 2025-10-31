import React, { useEffect, useState } from "react";
import "./index.css";

const TIP_SOURCES = [
  {
    name: "ATG V85 Tips",
    url: "https://www.atg.se/V85/tips",
    type: "gratis",
    logo: "/logos/atg.svg",
    note: "Officiella tips från ATG"
  },
  {
    name: "Travstugan",
    url: "https://travstugan.se/v85",
    type: "gratis",
    logo: "/logos/travstugan.svg",
    note: "Gratis analyser & spelförslag"
  },
  {
    name: "Trav365 (Sportbladet)",
    url: "https://www.aftonbladet.se/sportbladet/trav365/",
    type: "gratis",
    logo: "/logos/trav365.svg",
    note: "Spik & miljonrensare"
  },
  {
    name: "Thomas Uhrberg",
    url: "https://www.facebook.com/thomasuhrberg",
    type: "gratis",
    logo: "/logos/uhrberg.svg",
    note: "Tränar-/kusktankar inför omgången"
  },
  {
    name: "Fem Tippar V85 (ATG)",
    url: "https://www.atg.se/femtippar",
    type: "gratis",
    logo: "/logos/femtippar.svg",
    note: "Paneltipset inför V85"
  },
  {
    name: "Andelstorget",
    url: "https://andelstorget.se/",
    type: "premium",
    logo: "/logos/andelstorget.svg",
    note: "Andelar & premiumtips"
  },
  {
    name: "Travronden",
    url: "https://www.travronden.se/",
    type: "premium",
    logo: "/logos/travronden.svg",
    note: "Premiumanalyser & system"
  }
];

function InitialBadge({ name }) {
  const letters = (name || "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="h-10 w-10 rounded-md bg-zinc-900/5 ring-1 ring-zinc-200 flex items-center justify-center font-semibold text-zinc-700">
      {letters}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        ⏳ Laddar omgång...
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 bg-white text-gray-900">
      {/* HEADER */}
      <header className="flex flex-col items-center mb-10">
        <img
          src="/omgangskollen-dark.png"
          alt="Omgångskollen"
          className="h-20 w-auto mb-4"
        />
        <h1 className="text-3xl font-bold tracking-tight">Omgångskollen</h1>
        <p className="text-gray-600 text-sm">
          Samlar all info och alla tips inför veckans V85
        </p>
      </header>

      {/* OMGÅNGSINFO */}
      <section id="omgang" className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold">Veckans omgång</h2>
        <p>
          <strong>{data.omgang.bana}</strong> – {data.omgang.datum}
        </p>
        <p>{data.omgang.beskrivning}</p>
        <p className="text-sm text-gray-600">{data.omgang.jackpot}</p>
      </section>

      {/* NYCKLAR */}
      <section id="nycklar" className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold">Spikar & skrällar</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(data.nycklar).map(([key, val]) => (
            <li
              key={key}
              className={`p-4 rounded-lg border ${
                val.tone === "green"
                  ? "bg-emerald-50 border-emerald-200"
                  : val.tone === "yellow"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              <h3 className="font-semibold text-lg">{val.titel}</h3>
              <p className="text-sm">{val.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* TIPS & ANALYSER */}
      <section id="kallor" className="space-y-6 mb-10">
        <header className="flex flex-col gap-2">
          <div className="text-xs text-gray-500 font-mono uppercase tracking-wide">
            Tips & analyser
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Källor – gratis & premium
          </h2>
          <p className="text-sm text-gray-600">
            Samlingsplatsen för V85: officiella ATG-tips, gratiskällor och
            utvalda premiumanalyser. Klicka för att läsa mer.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIP_SOURCES.map((src) => (
            <li key={src.name}>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white p-4 shadow-sm hover:shadow transition"
              >
                <div className="flex items-center gap-3">
                  {src.logo ? (
                    <img
                      src={src.logo}
                      alt={src.name}
                      className="h-10 w-10 rounded-md object-contain ring-1 ring-zinc-200 bg-white"
                    />
                  ) : (
                    <InitialBadge name={src.name} />
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium text-gray-900">
                        {src.name}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ring-1 ${
                          src.type === "gratis"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-indigo-50 text-indigo-700 ring-indigo-200"
                        }`}
                      >
                        {src.type === "gratis" ? "Gratis" : "Premium"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                      {src.note}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Öppnas i ny flik</span>
                  <span className="opacity-0 group-hover:opacity-100 transition">
                    ⟶
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-2 text-[10px] text-gray-500">
          Tipsinnehåll tillhör respektive källa. Omgångskollen aggregerar och
          länkar vidare.
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
        Spela ansvarsfullt. 18+ Stödlinjen: 020-81 91 00.
      </footer>
    </main>
  );
}
