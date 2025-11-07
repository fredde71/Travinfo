import React, { useEffect, useState } from "react";

const SWISH_NUMBER = "0761390199";
const SWISH_AMOUNT = 19;

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
      .catch(() => {
        setError("Kunde inte läsa omgångsdata. Visa sparad version i stället.");
        setData(null);
      });
  }, []);

  const omgang = data?.omgang || {
    bana: "Bergsåker",
    datum: "Lördag 8 november",
    beskrivning: "Teknisk och ofta utslagsgivande bana med plats för starka hästar och offensiva upplägg.",
    jackpott: "Jackpott 50 miljoner kr på V85"
  };

  const nycklar = data?.nycklar || {
    spik: {
      titel: "Huvudspiken",
      text: "Trygg favorit med bra läge och form. Passar extra bra om du vill spela lite mer kontrollerat.",
      tone: "green"
    },
    skrall: {
      titel: "Bästa skrällbudet",
      text: "Ett lite bortglömt ekipage med rätt smygläge. Perfekt för att få upp utdelningen.",
      tone: "yellow"
    },
    varning: {
      titel: "Varning för överstreckad",
      text: "En stor favorit som riskerar att fastna eller inte passar förhållandena den här gången.",
      tone: "red"
    }
  };

  const weather = data?.vader || {
    text: "Prognos: svag vind, några plusgrader och risk för lätt nederbörd.",
    temp: "+3°",
    vind: "3–5 m/s"
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-sky-100">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-600 flex items-center justify-center text-white text-lg font-bold">
              V
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-tight">Omgångskollen</span>
              <span className="text-[11px] text-slate-500">Veckans V85 samlat på ett ställe</span>
            </div>
          </a>
          <ul className="hidden sm:flex gap-4 text-sm text-slate-600">
            <li>
              <a href="#omgang" className="hover:text-sky-700">
                🏁 Veckans omgång
              </a>
            </li>
            <li>
              <a href="#veckans-tips" className="hover:text-sky-700">
                💡 Veckans tips
              </a>
            </li>
            <li>
              <a href="#nycklar" className="hover:text-sky-700">
                🎯 Spikar & skrällar
              </a>
            </li>
            <li>
              <a href="#guide" className="hover:text-sky-700">
                📘 V85-guide
              </a>
            </li>
            <li>
              <a href="#tips-lankar" className="hover:text-sky-700">
                🔗 Tips & länkar
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="top" className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <section id="hero" className="scroll-mt-24 grid md:grid-cols-[1.6fr,1fr] gap-6 items-center">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Ny omgång – {omgang.bana}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Omgångskollen för V85 på {omgang.bana}
            </h1>
            <p className="text-sm text-slate-600">
              {omgang.datum} – allt du behöver inför spelet: bana, väder, nyckellopp, gratislänkar och veckans speltips.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 border border-amber-200">
                <span className="text-amber-500">💰</span>
                {omgang.jackpott || "Jackpott på V85 den här veckan"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 border border-sky-200">
                <span className="text-sky-600">🌤️</span>
                {weather.text}
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-white shadow-md border border-sky-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Nedräkning till spelstopp</p>
                <p className="text-sm font-semibold">Lördag kl. 16:20</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase text-slate-400 font-semibold">V85</p>
                <p className="text-xl font-bold text-sky-700">Lördag</p>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-1">
                <p className="text-slate-500">Bana</p>
                <p className="font-semibold">{omgang.bana}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500">Underlag</p>
                <p className="font-semibold">Vinterbana</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500">Väder</p>
                <p className="font-semibold">
                  {weather.temp} · {weather.vind}
                </p>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Spela ansvarsfullt. 18+ | Stödlinjen 020-81 91 00.
            </div>
          </div>
        </section>

        <section
          id="veckans-tips"
          className="scroll-mt-24 grid lg:grid-cols-[1.4fr,1fr] gap-6 items-start"
        >
          <div className="rounded-2xl bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 text-white p-5 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-sky-100 font-semibold">
                  Veckans speltips
                </p>
                <h2 className="text-xl font-bold mt-1">Färdigt V85-förslag för ca 100 kr</h2>
              </div>
              <div className="text-right text-sm">
                <p className="text-sky-100">Pris</p>
                <p className="text-2xl font-extrabold">{SWISH_AMOUNT} kr</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-sky-50">
              Du får ett färdigt systemförslag till V85-omgången – anpassat för ungefär 100 kr insats.
              Perfekt om du vill komma igång snabbt utan att läsa igenom allt själv.
            </p>
            <ol className="mt-3 space-y-1.5 text-sm text-sky-50">
              <li>1. Swisha {SWISH_AMOUNT} kr till {SWISH_NUMBER}.</li>
              <li>2. Skriv “Veckans tips” + datum i meddelandet.</li>
              <li>3. Du får förslaget skickat via sms eller e-post.</li>
            </ol>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={`sms:${SWISH_NUMBER.replace(/[^0-9]/g, "")}?&body=Hej! Jag vill köpa veckans V85-tips.`}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white text-sky-800 text-sm font-semibold shadow-sm hover:bg-sky-50 transition"
              >
                Skicka förfrågan via sms
              </a>
              <p className="text-[11px] text-sky-100">
                Utbetalning och spel sker alltid hos ATG – här köper du bara tipset, inte själva spelet.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-sky-100 p-4 shadow-sm space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Veckans kupong
            </p>
            <p className="text-sm text-slate-700">
              Här kan du klicka dig vidare till ATG och spela på V85 med egen kupong. Veckans speltips
              hjälper dig att sätta upp ett smart system – men själva spelet lägger du alltid hos ATG.
            </p>
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-500">
              Här kan du senare lägga in en direktlänk till exakt den kupong du vill rekommendera på ATG
              Tillsammans eller som enkelrad.
            </div>
            <a
              href="https://www.atg.se/V85"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition"
            >
              Gå till V85 hos ATG
            </a>
          </div>
        </section>

        <section id="omgang" className="scroll-mt-24 grid md:grid-cols-[1.5fr,1fr] gap-6">
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Veckans omgång</h2>
              <span className="inline-flex items-center gap-1 text-xs rounded-full bg-sky-50 px-3 py-1 text-sky-700 border border-sky-100">
                🏁 {omgang.bana}
              </span>
            </div>
            <p className="text-sm text-slate-700">{omgang.beskrivning}</p>
            <ul className="text-sm text-slate-700 space-y-1 mt-2">
              <li>• Spelstopp ca 16:20 (kontrollera exakta tider hos ATG).</li>
              <li>• Håll koll på värmningar, balansändringar och streckfördelning nära start.</li>
              <li>• Kombinera egna idéer med tipsen nedan för en balanserad kupong.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5 space-y-3">
            <h3 className="text-sm font-semibold">Bana & förutsättningar</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <p>
                Bergsåker är en bana där både starka hästar och offensiva kuskar ofta får utdelning.
                Tempot kan bli högt, och det öppnar för skrällar om favoriterna kör mot varandra.
              </p>
              <p>
                Titta gärna extra på hästar som trivs på vinterunderlag och klarar lite tyngre bana om vädret
                blir tufft.
              </p>
            </div>
          </div>
        </section>

        <section id="nycklar" className="scroll-mt-24 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Spikar, skrällar och varningar</h2>
            <p className="text-xs text-slate-500">
              Använd dessa som grund – komplettera med egna idéer för rätt balans i systemet.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(nycklar).map(([key, item]) => {
              const tone =
                item.tone === "green"
                  ? "bg-emerald-50 border-emerald-200"
                  : item.tone === "yellow"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-rose-50 border-rose-200";
              const label =
                key === "spik" ? "Spik" : key === "skrall" ? "Skräll" : "Varning";

              return (
                <div
                  key={key}
                  className={`rounded-2xl border shadow-sm p-4 flex flex-col gap-2 ${tone}`}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                    {label}
                  </div>
                  <h3 className="text-base font-semibold">{item.titel}</h3>
                  <p className="text-sm text-slate-700 flex-1">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="guide" className="scroll-mt-24 grid lg:grid-cols-[1.5fr,1fr] gap-6">
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5 space-y-3">
            <h2 className="text-lg font-semibold">Så funkar V85</h2>
            <p className="text-sm text-slate-700">
              V85 är ett streckspel från ATG där du ska hitta vinnaren i åtta lopp. Du vinner på 8, 7
              och 6 rätt, och utdelningen beror på hur många som har samma rad som du.
            </p>
            <ul className="text-sm text-slate-700 space-y-1.5 mt-1">
              <li>• Du markerar en eller flera hästar i varje avdelning (V85–1 till V85–8).</li>
              <li>• Ju fler hästar du tar med, desto dyrare blir systemet – men också lättare att sätta.</li>
              <li>• En enkelrad kostar 1 krona. Ett system med många hästar kan delas i andelar.</li>
              <li>• Du kan spela själv, i ett andelsspel eller i ett Tillsammans-lag hos ATG.</li>
            </ul>
            <p className="text-sm text-slate-700 mt-2">
              Tanken med Omgångskollen är att samla omgångsfakta, länkar, idéer och veckans tips så att du
              snabbt får en överblick och kan bygga din kupong smartare.
            </p>
          </div>
          <div className="rounded-2xl bg-sky-900 text-sky-50 p-5 space-y-3">
            <h3 className="text-sm font-semibold">Snabbguide – bygg en smart V85-kupong</h3>
            <ul className="text-sm space-y-1.5">
              <li>1. Hitta 1–2 riktigt stabila spikar.</li>
              <li>2. Välj 1–2 lopp där du jagar skräll och garderar brett.</li>
              <li>3. Håll nere systemkostnaden – hellre lite mindre system med tydlig idé.</li>
              <li>4. Kolla värmningar, balansändringar och senaste nytt nära spelstopp.</li>
            </ul>
            <a
              href="https://www.atg.se/hjalp/spelguiden/v86"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center mt-2 px-4 py-2.5 rounded-xl bg-white text-sky-900 text-xs font-semibold hover:bg-sky-50 transition"
            >
              Läs mer om streckspel hos ATG
            </a>
          </div>
        </section>

        <section id="tips-lankar" className="scroll-mt-24 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Tips, analyser och gratislänkar</h2>
            <p className="text-xs text-slate-500">
              Kombinera flera källor – men spela alltid efter din egen känsla.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-white border border-slate-100 p-5 space-y-3">
              <h3 className="text-sm font-semibold">ATG – V85-tips</h3>
              <ul className="text-sm text-sky-700 space-y-1.5">
                <li>
                  <a
                    href="https://www.atg.se/V85/tips"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    ATG:s samlade V85-tips
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/fem-tippar-v85"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Fem tippar V85
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/v85-med-fernlund-lordag"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    V85 med Fernlund
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/251104-lordag-811-tips-till-v85-pa-bergsaker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    ATG:s huvudtips till veckans omgång
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/korsdragaren-fran-vi-tippa-v85"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Korsdragaren från Vi Tippa (V85)
                  </a>
                </li>
              </ul>
              <a
                href="https://assets.ctfassets.net/hkip2osr81id/39uvrIW4wvyccGJij4j7X7/e48d16ad41ce42b912807ef8195f21db/251108_BERGSAKER_GP_V85_1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center mt-3 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition"
              >
                Öppna gratisprogram för omgången (PDF)
              </a>
            </div>
            <div className="rounded-2xl bg-white border border-slate-100 p-5 space-y-3">
              <h3 className="text-sm font-semibold">Övriga tips & analyser</h3>
              <ul className="text-sm text-sky-700 space-y-1.5">
                <li>
                  <a
                    href="https://travstugan.se/v86"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Travstugan – analyser och spelförslag
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.aftonbladet.se/sportbladet/trav365/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Trav365 (Aftonbladet)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.travronden.se/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Travronden – fördjupade analyser
                  </a>
                  <span className="ml-1 text-[11px] text-slate-500">(betalsajt)</span>
                </li>
                <li>
                  <a
                    href="https://thomasuhrberg.se/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Thomas Uhrberg – kusk, tränare och tips
                  </a>
                </li>
              </ul>
              <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-700">Spela med Omgångskollen</p>
                <p>
                  Här kan du senare lägga in en direktlänk till ditt ATG Tillsammans-lag, till exempel
                  “Team Wästman”.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-[11px] text-slate-500">
          Spela ansvarsfullt. 18+ | Stödlinjen 020-81 91 00 | Denna sida är fristående och inte
          officiellt kopplad till ATG.
        </footer>
      </main>
    </div>
  );
}

export default App;
