import React, { useEffect, useState } from "react";
import "./index.css";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("./data.json")
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
    <div className="bg-white text-gray-900">
      {/* TOPP */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="./omgangskollen-dark.png" alt="Logo" className="h-6 w-auto" />
            <span className="font-semibold tracking-tight">Omgångskollen</span>
          </div>
          <ul className="flex gap-4 text-sm text-gray-600">
            <li><a href="#omgang" className="hover:text-black">🏁 Omgång</a></li>
            <li><a href="#nycklar" className="hover:text-black">🎯 Spikar</a></li>
            <li><a href="#tips" className="hover:text-black">🧩 Tips</a></li>
          </ul>
        </nav>
      </header>

      {/* HERO */}
      <section id="hero" className="max-w-6xl mx-auto px-4 py-10 text-center">
        <img src="./omgangskollen-dark.png" alt="Omgångskollen" className="h-24 mx-auto mb-3" />
        <h1 className="text-4xl font-bold">Omgångskollen</h1>
        <p className="text-gray-600 text-sm mt-2">
          Samlar all info och alla tips inför veckans V85
        </p>
      </section>

      {/* OMGÅNG */}
      <section id="omgang" className="max-w-6xl mx-auto px-4 space-y-3">
        <h2 className="text-xl font-semibold">Veckans omgång</h2>
        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
          <p><strong>{data.omgang.bana}</strong> – {data.omgang.datum}</p>
          <p className="text-sm text-gray-600 mt-2">{data.omgang.beskrivning}</p>
        </div>
      </section>

      {/* NYCKLAR */}
      <section id="nycklar" className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <h2 className="text-xl font-semibold">Spikar & skrällar</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {Object.entries(data.nycklar).map(([key, val]) => (
            <div key={key} className={`rounded-xl p-4 border shadow-sm ${
              val.tone === "green" ? "bg-emerald-50 border-emerald-200" :
              val.tone === "yellow" ? "bg-amber-50 border-amber-200" :
              "bg-rose-50 border-rose-200"
            }`}>
              <div className="text-xs font-mono text-gray-500 uppercase">
                {key === "spik" ? "Spik" : key === "skrall" ? "Skräll" : "Varning"}
              </div>
              <h3 className="text-lg font-semibold">{val.titel}</h3>
              <p className="text-sm">{val.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIPS */}
      <section id="tips" className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <h2 className="text-xl font-semibold">Tips & analyser</h2>
        <ul className="list-disc pl-6 text-sm text-gray-700">
          <li><a href="https://www.atg.se/V85/tips" target="_blank">ATG V85-tips</a></li>
          <li><a href="https://travstugan.se/v85" target="_blank">Travstugan</a></li>
          <li><a href="https://www.aftonbladet.se/sportbladet/trav365/" target="_blank">Trav365</a></li>
          <li><a href="https://www.travronden.se/" target="_blank">Travronden (premium)</a></li>
        </ul>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 text-center py-6 text-xs text-gray-500">
        Spela ansvarsfullt. 18+ Stödlinjen: 020-81 91 00.
      </footer>
    </div>
  );
}
