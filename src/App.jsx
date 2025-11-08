import React, { useEffect, useState } from "react";

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = +targetDate - +new Date();
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(() => {
        const diff = +targetDate - +new Date();
        return diff > 0 ? diff : 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, []);

  const targetDate = new Date("2025-11-08T16:20:00+01:00");
  const countdown = useCountdown(targetDate);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const omgang = data?.omgang || {
    bana: "Bergsåker",
    datum: "Lördag 8 november 2025",
    beskrivning:
      "V85 på Bergsåker med bra sport, luriga spår och jackpot på cirka 50 miljoner.",
  };

  const nycklar = {
    spik: { titel: "2 Shogun R.R", text: "Stabil form, bra läge och rätt uppgift." },
    skrall: {
      titel: "12 Funny Guy & 6 Cuelebre",
      text: "Två roliga drag till låg procent.",
    },
    varning: {
      titel: "12 Freeloader",
      text: "Hårt emot favoriten om det klaffar.",
    },
  };

  const kupong = [
    { avd: "Avd 1", hästar: "15" },
    { avd: "Avd 2", hästar: "4, 1" },
    { avd: "Avd 3", hästar: "11, 6" },
    { avd: "Avd 4", hästar: "4, 8, 7, 1" },
    { avd: "Avd 5", hästar: "6, 9" },
    { avd: "Avd 6", hästar: "2" },
    { avd: "Avd 7", hästar: "2, 6, 12" },
    { avd: "Avd 8", hästar: "4, 10" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <img src="./omgangskollen-dark.png" alt="Omgångskollen" className="h-9 w-auto" />
            <span className="font-semibold tracking-tight text-slate-900 text-sm md:text-base">
              Omgångskollen
            </span>
          </a>
          <ul className="hidden sm:flex gap-4 text-sm text-slate-600">
            <li><a href="#omgang" onClick={(e) => handleNavClick(e, "omgang")} className="hover:text-slate-900">🏁 Omgång</a></li>
            <li><a href="#v85-guide" onClick={(e) => handleNavClick(e, "v85-guide")} className="hover:text-slate-900">📘 V85-guide</a></li>
            <li><a href="#tips" onClick={(e) => handleNavClick(e, "tips")} className="hover:text-slate-900">🧩 Gratis tips</a></li>
            <li><a href="#nycklar" onClick={(e) => handleNavClick(e, "nycklar")} className="hover:text-slate-900">🎯 Spikar & skrällar</a></li>
            <li><a href="#kupong" onClick={(e) => handleNavClick(e, "kupong")} className="hover:text-slate-900">📲 Veckans kupong</a></li>
            <li><a href="#swish" onClick={(e) => handleNavClick(e, "swish")} className="hover:text-slate-900">💚 Swish-tipset</a></li>
          </ul>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        {/* HERO */}
        <section className="scroll-mt-24 grid md:grid-cols-[2fr,1.4fr] gap-6 items-center">
          <div>
            <h1 className="text-3xl font-bold">Inför veckans V85 på {omgang.bana}</h1>
            <p className="text-sm text-slate-600 mt-2">
              Samlad info, spikar, skrällar och länkar inför lördagens omgång.
            </p>
            <div className="mt-3 text-xs bg-slate-100 p-2 rounded-lg w-fit">
              ⏱️ Nedräkning: {countdown.days}d {countdown.hours}h {countdown.minutes}m
            </div>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-2xl p-4 text-sm">
            <p className="font-semibold text-slate-900">{omgang.bana} – V85</p>
            <p className="text-xs text-slate-600">{omgang.datum}</p>
            <p className="mt-1 text-xs text-slate-700">{omgang.beskrivning}</p>
            <p className="text-amber-700 mt-2 font-medium">💰 Jackpot ca 50 Mkr</p>
          </div>
        </section>

        {/* OMGÅNG */}
        <section id="omgang" className="scroll-mt-24 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-semibold">🏁 Veckans omgång – {omgang.bana}</h2>
          <p className="text-sm text-slate-700 mt-1">
            Här samlar vi allt inför lördagens V85 på {omgang.bana}.
          </p>
          <a
            href="https://assets.ctfassets.net/hkip2osr81id/39uvrIW4wvyccGJij4j7X7/e48d16ad41ce42b912807ef8195f21db/251108_BERGSAKER_GP_V85_1.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-3 items-center gap-2 border border-sky-200 bg-white px-4 py-2 rounded-full text-sky-800 hover:bg-sky-50 text-xs"
          >
            📄 Gratis program – Bergsåker V85
          </a>
        </section>

        {/* V85-GUIDE (uppflyttad hit) */}
        <section id="v85-guide" className="scroll-mt-24 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-semibold">📘 Så funkar V85</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm mt-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold">Grunderna i V85</h3>
              <ul className="list-disc pl-5 text-xs mt-1 space-y-1 text-slate-700">
                <li>Du ska hitta vinnaren i 8 lopp.</li>
                <li>Utdelning sker oftast på 8, 7 och 6 rätt.</li>
                <li>Insatsen är 1 kr per rad.</li>
                <li>Spela själv eller via Tillsammans-lag.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold">Tips inför spelet</h3>
              <ul className="list-disc pl-5 text-xs mt-1 space-y-1 text-slate-700">
                <li>1–2 stabila spikar ger plats för garderingar.</li>
                <li>Kolla väder, balans och strykningar.</li>
                <li>Jämför tips – se sektionen “Gratis tips & analyser”.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* GRATIS TIPS */}
        <section id="tips" className="scroll-mt-24 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-semibold">🧩 Gratis tips & analyser</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mt-3">
            <a href="https://www.atg.se/V85/tips/fem-tippar-v85" target="_blank" rel="noreferrer" className="p-3 border rounded-2xl bg-white hover:border-sky-300">Fem tippar V85</a>
            <a href="https://www.atg.se/V85/tips/v85-med-fernlund-lordag" target="_blank" rel="noreferrer" className="p-3 border rounded-2xl bg-white hover:border-sky-300">V85 med Fernlund</a>
            <a href="https://www.atg.se/V85/tips/vass-eller-kass-v85-lordag" target="_blank" rel="noreferrer" className="p-3 border rounded-2xl bg-white hover:border-sky-300">Vass eller Kass</a>
            <a href="https://www.atg.se/V85/tips/bjornkollen-v85-lordag" target="_blank" rel="noreferrer" className="p-3 border rounded-2xl bg-white hover:border-sky-300">Björnkollen</a>
            <a href="https://www.atg.se/V85/tips/251107-stallsnack-v85-bergsaker-multijackpot" target="_blank" rel="noreferrer" className="p-3 border rounded-2xl bg-white hover:border-sky-300">Stallsnack Bergsåker</a>
            <a href="https://thomasuhrberg.se/" target="_blank" rel="noreferrer" className="p-3 border rounded-2xl bg-white hover:border-sky-300">Thomas Uhrberg</a>
            <a href="https://gratistravtips.se/" target="_blank" rel="noreferrer" className="p-3 border rounded-2xl bg-white hover:border-sky-300">Gratistravtips.se</a>
            <a href="https://travstugan.se/" target="_blank" rel="noreferrer" className="p-3 border rounded-2xl bg-white hover:border-sky-300">Travstugan</a>
            <a href="https://www.aftonbladet.se/sportbladet/trav365/a/Gyv09Q/v85-tips-bergsaker-lordagen-8-november-basta-skrallarna-andelssystem-jackpott-50-miljoner" target="_blank" rel="noreferrer" className="p-3 border rounded-2xl bg-white hover:border-sky-300">Trav365 – Aftonbladet</a>
          </div>
        </section>

        {/* SPIKAR */}
        <section id="nycklar" className="scroll-mt-24 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-semibold">🎯 Spikar, skrällar & varningar</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-3 text-sm">
            {Object.entries(nycklar).map(([key, info]) => (
              <div key={key} className="rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-xs uppercase text-slate-500">{key}</p>
                <h3 className="font-semibold">{info.titel}</h3>
                <p className="text-xs text-slate-700 mt-1">{info.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* KUPONG */}
        <section id="kupong" className="scroll-mt-24 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-semibold">📲 Veckans kupong</h2>
          <div className="relative rounded-2xl border bg-white p-4 mt-3">
            <div className="space-y-1 text-sm">
              {kupong.map((r) => (
                <div key={r.avd} className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                  <span>{r.avd}</span>
                  <span>{r.hästar}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur flex items-center justify-center">
              <div className="text-center text-white text-sm px-3">
                🔒 Kupongen är låst – kostar 19 kr. Betala via Swish nedan.
              </div>
            </div>
          </div>
        </section>

        {/* SWISH */}
        <section id="swish" className="scroll-mt-24 border-t border-slate-200 pt-6 mb-10">
          <h2 className="text-xl font-semibold">💚 Swish-tipset</h2>
          <p className="text-sm text-slate-700 mt-1">
            Betala 19 kr via Swish genom att scanna QR-koden nedan (eller skriv in belopp och meddelande: “V85 + ditt mobilnummer”).
          </p>
          <div className="grid md:grid-cols-[1.2fr,1.8fr] gap-4 mt-4">
            <div className="border border-slate-200 bg-white p-4 rounded-2xl text-sm">
              <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-700">
                <li>Öppna Swish och scanna QR-koden.</li>
                <li>Betala 19 kr och skriv “V85 + ditt mobilnummer”.</li>
                <li>Raden skickas via SMS efter betalning.</li>
              </ol>
            </div>
            <div className="flex flex-col items-center border border-slate-200 bg-white p-4 rounded-2xl">
              <p className="text-xs text-slate-700 mb-2">Scanna QR-koden i Swish:</p>
              <img src="./qrKod.png" alt="Swish QR-kod" className="w-40 h-40 object-contain" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-[11px] text-slate-500">
        Spela ansvarsfullt. 18+ | Stödlinjen: 020-81 91 00. Fristående hobbyprojekt utan koppling till ATG.
      </footer>
    </div>
  );
}

export default App;









