import { useEffect, useState } from "react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

function useCountdown(targetIso) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!targetIso) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [targetIso]);
  if (!targetIso) return null;
  const target = new Date(targetIso);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return {
      finished: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    finished: false,
    days,
    hours,
    minutes,
    seconds
  };
}

function App() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  const countdown = useCountdown(data?.omgang?.startTid);

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 80;
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.scrollY - headerOffset;
    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 text-slate-700">
        <div className="text-center">
          <div className="text-3xl mb-2">⏳</div>
          <p>Laddar omgång...</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 text-slate-700">
        <div className="text-center space-y-2">
          <div className="text-3xl">⚠️</div>
          <p>Kunde inte läsa in data.json.</p>
          <p className="text-sm text-slate-500">
            Kontrollera att filen finns i public/data.json och bygg om sidan.
          </p>
        </div>
      </div>
    );
  }

  const omgang = data.omgang;
  const nycklar = data.nycklar;
  const veckansKupong = data.veckansKupong;
  const länkar = data.lankar;

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="./omgangskollen-dark.png"
              alt="Omgångskollen"
              className="h-7 w-auto"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-tight">
                Omgångskollen
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-sky-700">
                V85 Bergsåker
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600">
            <button
              onClick={() => scrollToSection("omgang")}
              className="hover:text-sky-700"
            >
              🏁 Omgång
            </button>
            <button
              onClick={() => scrollToSection("nycklar")}
              className="hover:text-sky-700"
            >
              🎯 Spikar
            </button>
            <button
              onClick={() => scrollToSection("kupong")}
              className="hover:text-sky-700"
            >
              💯 Veckans kupong
            </button>
            <button
              onClick={() => scrollToSection("v85-guide")}
              className="hover:text-sky-700"
            >
              📘 V85-guide
            </button>
            <button
              onClick={() => scrollToSection("gratis")}
              className="hover:text-sky-700"
            >
              🎁 Gratistips
            </button>
            <button
              onClick={() => scrollToSection("om")}
              className="hover:text-sky-700"
            >
              ℹ️ Om sidan
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-16">
        <section
          id="hero"
          className="pt-6 pb-6 md:pt-10 md:pb-10 flex flex-col gap-6 md:flex-row md:items-center"
        >
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-[11px] font-medium text-sky-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Nästa omgång</span>
              <span className="text-slate-500">•</span>
              <span>{omgang.spel}</span>
              <span className="text-slate-500">•</span>
              <span>{omgang.bana}</span>
              <span className="text-slate-500">•</span>
              <span>{omgang.datumText}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Håll koll på veckans V85-omgång
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-xl">
              Omgångskollen samlar den viktigaste infon inför lördagens V85 på{" "}
              <span className="font-semibold">{omgang.bana}</span>. Här hittar
              du omgångsöversikt, nyckelhästar, gratis analyser och snabb
              genväg till veckans kupong.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="rounded-xl bg-white shadow-sm border border-sky-100 px-3 py-2 flex items-center gap-2">
                <span className="text-lg">💰</span>
                <div>
                  <div className="font-semibold">{omgang.jackpot}</div>
                  <div className="text-[11px] text-slate-500">
                    Extra pengar i potten på lördag
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-slate-900 text-slate-50 px-3 py-2 flex items-center gap-2">
                <span className="text-lg">⏱️</span>
                <div>
                  {countdown && !countdown.finished ? (
                    <>
                      <div className="font-semibold text-xs">
                        Start om{" "}
                        {countdown.days > 0 && `${countdown.days} d `}
                        {String(countdown.hours).padStart(2, "0")}:
                        {String(countdown.minutes).padStart(2, "0")}:
                        {String(countdown.seconds).padStart(2, "0")}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Tills spelstopp enligt data.json
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-xs">
                        Omgången är igång eller färdig
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Uppdatera datum i data.json inför nästa vecka
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:w-56">
            <div className="rounded-2xl border border-sky-100 bg-white shadow-sm p-4 space-y-3 text-xs">
              <div className="font-semibold text-slate-800">
                Dagens bana: {omgang.bana}
              </div>
              <div className="text-slate-600">{omgang.banprofil}</div>
              <div className="h-px bg-slate-200" />
              <div className="text-[11px] font-semibold text-slate-700">
                Väder och underlag
              </div>
              <div className="text-slate-600">{omgang.vader}</div>
            </div>
          </div>
        </section>

        <section
          id="omgang"
          className="scroll-mt-24 mt-4 mb-6 space-y-3"
        >
          <h2 className="text-xl font-semibold">Veckans omgång</h2>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:p-5 flex flex-col md:flex-row gap-4 text-sm">
            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono uppercase tracking-[0.18em] text-sky-700">
                  {omgang.spel}
                </span>
                <span>•</span>
                <span>{formatDate(omgang.datum)}</span>
                <span>•</span>
                <span>{omgang.bana}</span>
              </div>
              <p className="text-slate-700">
                Fokus på kvälls-V85 från {omgang.bana}. Här följer vi
                spelvärdet, streckfördelningen och de viktigaste förändringarna
                under veckan.
              </p>
              <p className="text-xs text-slate-500">
                Uppdatera data.json varje vecka med ny bana, datum, jackpott och
                kort banbeskrivning.
              </p>
            </div>
            <div className="w-full md:w-60 flex flex-col gap-2 text-xs">
              <a
                href={länkar.programPdf.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 font-semibold"
              >
                <span>📄 {länkar.programPdf.namn}</span>
              </a>
              <a
                href="https://www.atg.se/V85"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 px-3 py-2 font-semibold"
              >
                <span>🎟️ Gå till V85 hos ATG</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="nycklar"
          className="scroll-mt-24 mt-8 space-y-3"
        >
          <h2 className="text-xl font-semibold">Spikar, skrällar och varningar</h2>
          <p className="text-xs text-slate-600 mb-1">
            Här fyller du på under veckan när du hittar rätt drag.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(nycklar).map(([key, item]) => (
              <div
                key={key}
                className={
                  "rounded-2xl p-4 shadow-sm border text-sm " +
                  (item.tone === "green"
                    ? "bg-emerald-50 border-emerald-200"
                    : item.tone === "yellow"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-rose-50 border-rose-200")
                }
              >
                <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 mb-1">
                  {key === "spik"
                    ? "Spik"
                    : key === "skrall"
                    ? "Skräll"
                    : "Varning"}
                </div>
                <div className="font-semibold text-slate-900">
                  {item.titel}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {item.race}
                </div>
                <p className="mt-2 text-slate-700">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="kupong"
          className="scroll-mt-24 mt-10 space-y-3"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Veckans kupong</h2>
            <span className="text-[11px] text-slate-500">
              Ett färdigt 100-kronorssystem du kan spela direkt hos ATG
            </span>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-sky-100 shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-3 text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-sky-800 border border-sky-100">
                <span>💯</span>
                <span>100 kr-system</span>
                <span className="text-slate-400">•</span>
                <span>Balans mellan tryggt och chansartat</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {veckansKupong.titel}
              </h3>
              <p className="text-slate-700">{veckansKupong.beskrivning}</p>
              <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                <li>Enkel att spela för både nybörjare och rutinerade</li>
                <li>Bygger på spikar, lås och smarta reduceringar i tanken</li>
                <li>Perfekt grund att bygga större system på</li>
              </ul>
              <p className="text-[11px] text-slate-500">
                När du vill börja ta betalt kan denna sektion kopplas mot
                Swish, Patreon eller ATG Tillsammans-system.
              </p>
            </div>
            <div className="w-full md:w-64 flex flex-col justify-between gap-3">
              <div className="rounded-xl bg-white border border-sky-200 p-3 text-xs space-y-2">
                <div className="font-semibold text-slate-800">
                  Förslag på kupongflöde
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                  <li>Välj system (t.ex. 100 kr)</li>
                  <li>Läs kort motivering</li>
                  <li>Klicka dig vidare till ATG</li>
                  <li>Bekräfta och betala där</li>
                </ol>
              </div>
              <a
                href={veckansKupong.atgUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 text-sm font-semibold"
              >
                <span>🧾 Öppna veckans kupong hos ATG</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="v85-guide"
          className="scroll-mt-24 mt-10 space-y-3"
        >
          <h2 className="text-xl font-semibold">V85 – så funkar spelet</h2>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:p-6 grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-sky-700 uppercase tracking-[0.16em]">
                Grunderna
              </div>
              <p className="text-slate-700">
                V85 är ett streckspel med 8 avdelningar. Målet är att hitta
                vinnaren i så många lopp som möjligt. Fullträff är 8 rätt, men
                det finns ofta utdelning på 7 och 6 rätt också.
              </p>
              <ul className="list-disc pl-4 text-slate-700 space-y-1">
                <li>8 lopp på samma bana</li>
                <li>Radpris vanligtvis 0,25 kr</li>
                <li>Du väljer en eller flera hästar per lopp</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-sky-700 uppercase tracking-[0.16em]">
                Bygg system
              </div>
              <p className="text-slate-700">
                Systemet byggs med spikar, lås och garderingslopp. Ju fler
                hästar du tar med, desto dyrare blir systemet.
              </p>
              <ul className="list-disc pl-4 text-slate-700 space-y-1">
                <li>Spik: en häst du tror extra mycket på</li>
                <li>Lås: två hästar som du tror ”äger” loppet</li>
                <li>Gardering: många hästar i öppna lopp</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-sky-700 uppercase tracking-[0.16em]">
                Spela smart
              </div>
              <p className="text-slate-700">
                För att få betalt på V85 behöver du ofta kombinera favoriter med
                någon eller några riktiga skrällar.
              </p>
              <ul className="list-disc pl-4 text-slate-700 space-y-1">
                <li>Jämför streckprocent mot spelvärde</li>
                <li>Utnyttja väder och banunderlag</li>
                <li>Våga stå över överstreckade favoriter</li>
              </ul>
              <a
                href="https://www.atg.se/hjalp/spelinformation/v86"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-sky-700 hover:text-sky-900 mt-1"
              >
                <span>Läs mer hos ATG</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="gratis"
          className="scroll-mt-24 mt-10 space-y-3"
        >
          <h2 className="text-xl font-semibold">Gratistips och analyser</h2>
          <p className="text-xs text-slate-600">
            Samling av gratis material inför veckans omgång.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-2">
              <div className="text-xs font-semibold text-sky-700 uppercase tracking-[0.16em]">
                ATG:s egna tips
              </div>
              <ul className="space-y-1.5 text-slate-700">
                {länkar.gratisTips.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-sky-700 underline underline-offset-2"
                    >
                      {l.namn}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
              <div className="text-xs font-semibold text-sky-700 uppercase tracking-[0.16em]">
                Profiler och extramaterial
              </div>
              <ul className="space-y-1.5 text-slate-700">
                {länkar.profiler.map((p) => (
                  <li key={p.url}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-sky-700 underline underline-offset-2"
                    >
                      {p.namn}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={länkar.programPdf.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-sky-700 hover:text-sky-900"
              >
                <span>📄 {länkar.programPdf.namn}</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="tillsammans"
          className="scroll-mt-24 mt-10 space-y-3"
        >
          <h2 className="text-xl font-semibold">Spela tillsammans</h2>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 text-sm">
            <div className="flex-1 space-y-2">
              <p className="font-semibold text-emerald-900">
                Spela med Omgångskollen via ATG Tillsammans
              </p>
              <p className="text-emerald-900/80">
                Perfekt när du vill dela upp insatsen, spela större system och
                göra omgången roligare tillsammans med andra.
              </p>
              <p className="text-[11px] text-emerald-900/70">
                När du har en egen lagsida hos ATG byter du bara ut länken i
                data.json, så pekar knappen direkt rätt.
              </p>
            </div>
            <div className="w-full md:w-60">
              <a
                href={länkar.tillsammans.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-sm font-semibold"
              >
                <span>🤝 {länkar.tillsammans.namn}</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="om"
          className="scroll-mt-24 mt-10 mb-8 space-y-3"
        >
          <h2 className="text-xl font-semibold">Om Omgångskollen</h2>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:p-5 text-sm space-y-2">
            <p className="text-slate-700">
              Omgångskollen är en enkel samlingssida inför veckans V85, byggd
              för spelare som vill ha överblick utan att drunkna i information.
            </p>
            <p className="text-slate-700">
              Du uppdaterar själv data.json med ny bana, datum, jackpott och
              nyckelhästar varje vecka. Layouten och strukturen är gjord för att
              vara lätt att bygga vidare på med fler idéer.
            </p>
            <p className="text-[11px] text-slate-500">
              Spela ansvarsfullt. 18+ Stödlinjen: 020-81 91 00.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
