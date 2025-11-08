import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("./data.json");
        if (!res.ok) throw new Error("Kunde inte läsa data.json");
        const json = await res.json();
        setData(json);

        let start = null;
        if (json?.omgang?.startTid) {
          start = new Date(json.omgang.startTid);
        } else {
          start = new Date("2025-11-08T16:20:00+01:00");
        }

        function updateCountdown() {
          const now = new Date();
          const diff = start.getTime() - now.getTime();
          if (diff <= 0) {
            setTimeLeft({
              done: true,
              text: "Spelstopp passerat – dags för resultat!"
            });
            return;
          }
          const totalSeconds = Math.floor(diff / 1000);
          const days = Math.floor(totalSeconds / (60 * 60 * 24));
          const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          setTimeLeft({
            done: false,
            days,
            hours,
            minutes,
            seconds
          });
        }

        updateCountdown();
        const id = setInterval(updateCountdown, 1000);
        return () => clearInterval(id);
      } catch (err) {
        setError("Kunde inte läsa omgångsdata.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const cleanup = load();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  const nycklar = {
    spik: {
      label: "Spik",
      title: "2 Shogun R.R",
      text: "Stark spik i jämnt lopp – form, läge och uppgift ser helt rätt ut.",
      tone: "green"
    },
    skrall: {
      label: "Skräll",
      title: "12 Funny Guy, 6 Cuelebre",
      text: "Två roliga streck som kan lyfta utdelningen ordentligt.",
      tone: "yellow"
    },
    varning: {
      label: "Varning",
      title: "12 Freeloader",
      text: "Glöms lätt bort på kupongerna men har fullt kunnande för att överraska.",
      tone: "red"
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-900 text-sky-50">
        <div className="text-center space-y-2">
          <div className="text-3xl">⏳</div>
          <p className="text-sm font-medium">Laddar veckans omgång…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-900 text-sky-50">
        <div className="bg-sky-800/60 border border-sky-500/40 px-6 py-4 rounded-2xl max-w-md text-center space-y-3">
          <p className="text-lg font-semibold">Kunde inte läsa omgångsdata</p>
          <p className="text-sm opacity-80">
            Testa att ladda om sidan. Om felet kvarstår kan data.json behöva
            uppdateras.
          </p>
        </div>
      </div>
    );
  }

  const { omgang } = data;

  return (
    <div className="min-h-screen bg-sky-950 text-sky-50">
      <header className="sticky top-0 z-40 border-b border-sky-800 bg-sky-950/90 backdrop-blur">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="./omgangskollen-dark.png"
              alt="Omgångskollen"
              className="h-7 w-auto"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-tight text-sky-50">
                Omgångskollen
              </span>
              <span className="text-[11px] text-sky-300">
                Veckans V85 på ett ställe
              </span>
            </div>
          </div>
          <ul className="hidden sm:flex gap-4 text-[13px] text-sky-100">
            <li>
              <a href="#omgang" className="hover:text-white">
                🏁 Omgång
              </a>
            </li>
            <li>
              <a href="#swish" className="hover:text-white">
                💸 Veckans kupong
              </a>
            </li>
            <li>
              <a href="#nycklar" className="hover:text-white">
                🎯 Spik & skräll
              </a>
            </li>
            <li>
              <a href="#v85-guide" className="hover:text-white">
                📘 V85-guide
              </a>
            </li>
            <li>
              <a href="#tips" className="hover:text-white">
                🧩 Gratis tips
              </a>
            </li>
            <li>
              <a href="#spel" className="hover:text-white">
                🤝 Spela ihop
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        <section
          id="hero"
          className="pt-6 pb-6 md:pt-10 md:pb-10 grid md:grid-cols-[2fr,1.3fr] gap-6 items-center scroll-mt-24"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-900/70 border border-sky-700 px-3 py-1 text-[11px] text-sky-200">
              <span className="text-xs">V85 • {omgang?.bana}</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              <span>{omgang?.datum}</span>
              {omgang?.jackpott && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  Jackpott: {omgang.jackpott}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Omgångskollen – allt inför veckans V85 på{" "}
              <span className="text-sky-300">{omgang?.bana}</span>
            </h1>
            <p className="text-sm md:text-[15px] text-sky-200/90 max-w-xl">
              Här samlar vi spikar, skrällar, gratisanalyser, länkar och en
              exklusiv kupong som du kan köpa via Swish. En enkel överblick
              inför lördagens omgång.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-sky-900/60 border border-sky-700/80 p-4 shadow-lg shadow-sky-900/40">
              <p className="text-[11px] uppercase tracking-[0.18em] text-sky-300 mb-1">
                Nedräkning till spelstopp
              </p>
              {timeLeft && !timeLeft.done ? (
                <div className="flex gap-3">
                  {[
                    ["Dagar", timeLeft.days],
                    ["Timmar", timeLeft.hours],
                    ["Min", timeLeft.minutes],
                    ["Sek", timeLeft.seconds]
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex-1 rounded-xl bg-sky-950/70 border border-sky-700/80 py-2 text-center"
                    >
                      <div className="text-xl font-semibold text-sky-50 tabular-nums">
                        {value.toString().padStart(2, "0")}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-sky-300 mt-0.5">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-emerald-300">
                  Spelstopp passerat – nu håller vi tummarna!
                </p>
              )}
            </div>

            <section
              id="swish"
              className="scroll-mt-24 rounded-2xl bg-emerald-900/40 border border-emerald-500/50 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">
                    Veckans kupong
                  </p>
                  <h2 className="text-lg font-semibold text-emerald-50">
                    Exklusivt V85-system – 100 kr insats
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-emerald-200">Pris</p>
                  <p className="text-xl font-semibold text-emerald-300">
                    19 kr
                  </p>
                </div>
              </div>
              <p className="text-sm text-emerald-100/90">
                Swisha så får du ett färdigt system för V85 omgången skickat via
                SMS. Kupongen visas inte här på sidan utan går endast till dig
                som betalat.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-emerald-900/80 border border-emerald-600/60 p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300 mb-1.5">
                    Steg 1 – Swisha
                  </p>
                  <p className="font-semibold text-emerald-100">
                    Swisha 19 kr till:
                  </p>
                  <p className="text-lg font-bold text-emerald-200 mt-0.5">
                    0761&nbsp;39&nbsp;01&nbsp;99
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-900/40 border border-emerald-600/40 p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300 mb-1.5">
                    Steg 2 – Meddelande
                  </p>
                  <p className="text-emerald-100">
                    Skriv i meddelandet:
                    <br />
                    <span className="font-semibold">
                      "V85-tipset" + ditt mobilnummer
                    </span>
                    .
                  </p>
                  <p className="text-[11px] text-emerald-200 mt-1.5">
                    När betalningen syns skickas systemet manuellt som SMS till
                    numret du angav.
                  </p>
                </div>
              </div>
              <div className="mt-1 text-[11px] text-emerald-200">
                Inga spel genomförs åt dig – du får raden och spelar själv via
                ATG.
              </div>
            </section>
          </div>
        </section>

        <section
          id="omgang"
          className="scroll-mt-24 mb-6 grid md:grid-cols-[1.6fr,1.4fr] gap-6"
        >
          <div className="rounded-2xl bg-sky-900/60 border border-sky-700/80 p-4 space-y-3">
            <h2 className="text-lg font-semibold text-sky-50 flex items-center gap-2">
              <span>🏁 Veckans omgång</span>
            </h2>
            <p className="text-sm text-sky-100">
              <span className="font-semibold">{omgang?.bana}</span> –{" "}
              {omgang?.datum}
            </p>
            {omgang?.beskrivning && (
              <p className="text-sm text-sky-200/90">{omgang.beskrivning}</p>
            )}
          </div>

          <div className="rounded-2xl bg-sky-900/40 border border-sky-700/80 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-sky-100 flex items-center gap-2">
              <span>📄 Gratisprogram</span>
            </h3>
            <p className="text-xs text-sky-200/90">
              Officiellt program för hela omgången med startlistor, tider och
              lopplaner.
            </p>
            <a
              href="https://assets.ctfassets.net/hkip2osr81id/39uvrIW4wvyccGJij4j7X7/e48d16ad41ce42b912807ef8195f21db/251108_BERGSAKER_GP_V85_1.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-sky-950 text-sm font-semibold px-4 py-2 mt-1"
            >
              Öppna gratisprogram (PDF)
            </a>
          </div>
        </section>

        <section
          id="nycklar"
          className="scroll-mt-24 py-6 space-y-4 border-t border-sky-800/60"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-sky-50">
              🎯 Spikar, skrällar & varningar
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(nycklar).map(([key, val]) => (
              <div
                key={key}
                className={
                  "rounded-2xl border p-4 space-y-2 " +
                  (val.tone === "green"
                    ? "bg-emerald-900/40 border-emerald-500/50"
                    : val.tone === "yellow"
                    ? "bg-amber-900/30 border-amber-400/60"
                    : "bg-rose-900/40 border-rose-500/60")
                }
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-sky-100/80">
                  {val.label}
                </p>
                <h3 className="text-base font-semibold text-sky-50">
                  {val.title}
                </h3>
                <p className="text-sm text-sky-100/90">{val.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="v85-guide"
          className="scroll-mt-24 py-6 space-y-4 border-t border-sky-800/60"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-sky-50">
              📘 Så fungerar V85
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-sky-100/90">
            <div className="space-y-2 rounded-2xl bg-sky-900/60 border border-sky-700/80 p-4">
              <h3 className="font-semibold text-sky-50">Grunderna i spelet</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Du spelar på 8 lopp (avdelningar).</li>
                <li>Målet är att hitta vinnaren i varje avdelning.</li>
                <li>Utdelning på 8, 7 och 6 rätt.</li>
                <li>Insatsen beräknas som antal rader × radpris.</li>
              </ul>
            </div>
            <div className="space-y-2 rounded-2xl bg-sky-900/40 border border-sky-700/80 p-4">
              <h3 className="font-semibold text-sky-50">
                Speltips inför omgången
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Våga spika där du verkligen tror på en häst.</li>
                <li>Lägg fler streck i luriga lopp med många möjliga vinnare.</li>
                <li>
                  Håll koll på väder, balansändringar och sena strykningar.
                </li>
                <li>Kombinera egna idéer med gratis tipslänkarna nedan.</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="tips"
          className="scroll-mt-24 py-6 space-y-4 border-t border-sky-800/60"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-sky-50">
              🧩 Gratis tips & analyser
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl bg-sky-900/60 border border-sky-700/80 p-4 space-y-2">
              <h3 className="font-semibold text-sky-50">ATG V85-tips</h3>
              <ul className="space-y-1">
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/251104-lordag-811-tips-till-v85-pa-bergsaker"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-300 hover:text-sky-100 underline underline-offset-2"
                  >
                    ATG – Tips till V85 Bergsåker
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/v85-med-fernlund-lordag"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-300 hover:text-sky-100 underline underline-offset-2"
                  >
                    V85 med Fernlund
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/korsdragaren-fran-vi-tippa-v85"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-300 hover:text-sky-100 underline underline-offset-2"
                  >
                    Korsdragaren – Vi Tippa
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-sky-900/40 border border-sky-700/80 p-4 space-y-2">
              <h3 className="font-semibold text-sky-50">Övriga gratislänkar</h3>
              <ul className="space-y-1">
                <li>
                  <a
                    href="https://travstugan.se/v85"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-300 hover:text-sky-100 underline underline-offset-2"
                  >
                    Travstugan – analyser & drag
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.aftonbladet.se/sportbladet/trav365"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-300 hover:text-sky-100 underline underline-offset-2"
                  >
                    Trav365 – Sportbladet
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-sky-900/20 border border-sky-700/60 p-4 space-y-2">
              <h3 className="font-semibold text-sky-50">
                Travronden (premium)
              </h3>
              <p className="text-sm text-sky-100/90">
                Fördjupade analyser, intervjuer och material för dig som vill
                gå ännu djupare i omgången.
              </p>
              <a
                href="https://www.travronden.se/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-sky-950 text-xs font-semibold px-3 py-1.5"
              >
                Till Travronden
              </a>
            </div>
          </div>
        </section>

        <section
          id="spel"
          className="scroll-mt-24 py-6 space-y-4 border-t border-sky-800/60"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-sky-50">
              🤝 Spela med Omgångskollen
            </h2>
          </div>
          <div className="rounded-2xl bg-sky-900/50 border border-sky-700/80 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
            <div>
              <p className="font-semibold text-sky-50">
                Team Wästman på ATG Tillsammans
              </p>
              <p className="text-sky-100/90">
                Vill du spela tillsammans istället för att bygga egna system?
                Häng på laget och var med på gemensamma kuponger.
              </p>
            </div>
            <a
              href="https://www.atg.se/tillsammans"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-sm font-semibold px-4 py-2"
            >
              Spela med Omgångskollen
            </a>
          </div>
        </section>

        <footer className="mt-8 border-t border-sky-900/80 pt-4 pb-8 text-[11px] text-sky-400 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p>
            Spela ansvarsfullt. 18+ | Stödlinjen: 020-81 91 00 |
            spelpaus.se
          </p>
          <p>Omgångskollen – ett fristående projekt, ej kopplat till ATG.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;


