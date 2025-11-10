import { useEffect, useState } from "react";

function Countdown({ targetTime }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetTime) return;

    const target = new Date(targetTime).getTime();

    function update() {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          finished: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        finished: false,
      });
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  if (!timeLeft) {
    return (
      <p className="text-sm text-slate-500">
        Räknar ut tid till spelstopp...
      </p>
    );
  }

  if (timeLeft.finished) {
    return (
      <p className="text-sm font-medium text-rose-600">
        Kupongen är stängd – ny omgång på gång!
      </p>
    );
  }

  return (
    <div className="flex gap-3 text-center text-xs sm:text-sm">
      <div>
        <div className="rounded-md bg-slate-900/90 px-2 py-1 font-mono text-slate-50">
          {timeLeft.days}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
          dagar
        </div>
      </div>
      <div>
        <div className="rounded-md bg-slate-900/90 px-2 py-1 font-mono text-slate-50">
          {String(timeLeft.hours).padStart(2, "0")}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
          timmar
        </div>
      </div>
      <div>
        <div className="rounded-md bg-slate-900/90 px-2 py-1 font-mono text-slate-50">
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
          minuter
        </div>
      </div>
      <div>
        <div className="rounded-md bg-slate-900/90 px-2 py-1 font-mono text-slate-50">
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
          sekunder
        </div>
      </div>
    </div>
  );
}

const defaultNycklar = {
  spik: {
    titel: "2 Shogun R.R",
    text: "Stark och rejäl sort som tål att göra grovjobb – given spik i raden.",
    tone: "green",
  },
  skrall: {
    titel: "12 Funny Guy & 6 Cuelebre",
    text: "Två roliga kantbollar som kan rensa ordentligt om det klaffar.",
    tone: "yellow",
  },
  varning: {
    titel: "12 Freeloader",
    text: "Formstark typ som lätt blir bortglömd – ska med på större system.",
    tone: "red",
  },
};

const gratisTipsLankar = [
  {
    namn: "Fem Tippar V85",
    url: "https://www.atg.se/V85/tips/fem-tippar-v85",
    typ: "ATG",
  },
  {
    namn: "Vass eller Kass – V85 lördag",
    url: "https://www.atg.se/V85/tips/vass-eller-kass-v85-lordag",
    typ: "ATG",
  },
  {
    namn: "Björn Goop – Björnkollen V85",
    url: "https://www.atg.se/V85/tips/bjornkollen-v85-lordag",
    typ: "ATG",
  },
  {
    namn: "V85 med Fernlund",
    url: "https://www.atg.se/V85/tips/v85-med-fernlund-lordag",
    typ: "ATG",
  },
  {
    namn: "ATG – Tips till veckans V85",
    url: "https://www.atg.se/V85/tips/251104-lordag-811-tips-till-v85-pa-bergsaker",
    typ: "ATG",
  },
  {
    namn: "Korsdragaren från Vi Tippa",
    url: "https://www.atg.se/V85/tips/korsdragaren-fran-vi-tippa-v85",
    typ: "ATG",
  },
  {
    namn: "Stallsnack V85 – Bergsåker Multijackpot",
    url: "https://www.atg.se/V85/tips/251107-stallsnack-v85-bergsaker-multijackpot",
    typ: "ATG",
  },
  {
    namn: "Gratistravtips.se",
    url: "https://gratistravtips.se/",
    typ: "Gratis tips",
  },
  {
    namn: "Travstugan",
    url: "https://travstugan.se/",
    typ: "Gratis tips",
  },
  {
    namn: "Trav365 – Sportbladet",
    url: "https://www.aftonbladet.se/sportbladet/trav365/a/Gyv09Q/v85-tips-bergsaker-lordagen-8-november-basta-skrallarna-andelssystem-jackpott-50-miljoner",
    typ: "Analys",
  },
  {
    namn: "Travronden (premium)",
    url: "https://www.travronden.se/",
    typ: "Premium",
  },
];

function App() {
  const [data, setData] = useState(null);
  const [countdownTarget, setCountdownTarget] = useState(null);

  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        if (json?.omgang?.countdownTarget) {
          setCountdownTarget(json.omgang.countdownTarget);
        } else if (json?.omgang?.datum) {
          const dateString = `${json.omgang.datum} 16:20`;
          setCountdownTarget(dateString);
        } else {
          setCountdownTarget("2024-11-08T16:20:00+01:00");
        }
      })
      .catch(() => {
        setData(null);
        setCountdownTarget("2024-11-08T16:20:00+01:00");
      });
  }, []);

  const nycklar = data?.nycklar || defaultNycklar;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img
              src="./omgangskollen-dark.png"
              alt="Omgångskollen logotyp"
              className="h-8 w-auto"
            />
            <span className="text-sm font-semibold tracking-tight">
              Omgångskollen
            </span>
          </div>
          <ul className="flex gap-4 text-xs sm:text-sm text-slate-600">
            <li>
              <a href="#omgang" className="hover:text-slate-900">
                🏁 Omgången
              </a>
            </li>
            <li>
              <a href="#swish-tipset" className="hover:text-slate-900">
                💰 Swish-tipset
              </a>
            </li>
            <li>
              <a href="#v85-guide" className="hover:text-slate-900">
                📘 V85-guide
              </a>
            </li>
            <li>
              <a href="#gratis-tips" className="hover:text-slate-900">
                🆓 Gratis tips
              </a>
            </li>
            <li>
              <a href="#nycklar" className="hover:text-slate-900">
                🎯 Spikar & skrällar
              </a>
            </li>
            <li>
              <a href="#om-omgangskollen" className="hover:text-slate-900">
                ℹ️ Om Omgångskollen
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6">
        <section className="grid gap-4 md:grid-cols-[2fr,1.4fr] md:items-start">
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-sky-600 via-sky-500 to-sky-700 p-[1px] shadow-md">
              <div className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-900/95 p-4 text-slate-50 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">
                    Nästa V85-omgång
                  </p>
                  <h1 className="mt-1 text-2xl font-bold">
                    {data?.omgang?.rubrik || "V85 Bergsåker – Multijackpot"}
                  </h1>
                  <p className="mt-1 text-sm text-sky-100/90">
                    {data?.omgang?.bana || "Bergsåker"}{" "}
                    {data?.omgang?.datum
                      ? `· ${data.omgang.datum}`
                      : "· Lördag 8 november"}
                  </p>
                  <p className="mt-1 text-xs text-sky-100/80">
                    {data?.omgang?.jackpot ||
                      "Jackpott ca 50 miljoner i åttarättspotten."}
                  </p>
                </div>
                <div className="rounded-xl border border-sky-300/40 bg-slate-900/80 px-3 py-2">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-sky-200">
                    Tid kvar till spelstopp
                  </p>
                  <Countdown targetTime={countdownTarget} />
                </div>
              </div>
            </div>

            <section
              id="omgang"
              className="scroll-mt-28 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h2 className="text-base font-semibold">Veckans omgång</h2>
              <p className="text-sm text-slate-700">
                {data?.omgang?.beskrivning ||
                  "Bergsåker bjuder på en lurig V85-omgång med flera öppna lopp, högklassiga hästar och multijackpot. Spelvärdet är högt – både för spikletare och skrälljägare."}
              </p>
              <div className="mt-2 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Bana
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {data?.omgang?.bana || "Bergsåker"}
                  </p>
                  <p className="mt-1 text-xs">
                    Stark vinterbana där form, styrka och rätt balans betyder
                    mycket.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Datum & spelstopp
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {data?.omgang?.datum || "Lördag 8 november"}
                  </p>
                  <p className="mt-1 text-xs">
                    Spelstopp ca 16:20 – dubbelkolla alltid tiden hos ATG.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Jackpott
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {data?.omgang?.jackpot || "Ca 50 miljoner kr"}
                  </p>
                  <p className="mt-1 text-xs">
                    Extra pengar i potten gör att rätt rad kan bli rejält
                    värd.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <a
                  href="https://assets.ctfassets.net/hkip2osr81id/39uvrIW4wvyccGJij4j7X7/e48d16ad41ce42b912807ef8195f21db/251108_BERGSAKER_GP_V85_1.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-3 py-1.5 font-medium text-white shadow-sm hover:bg-sky-700"
                >
                  📄 Gratisprogram Bergsåker
                </a>
                <a
                  href="https://www.atg.se/V85"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 font-medium text-slate-50 hover:bg-black"
                >
                  🎫 Spela V85 hos ATG
                </a>
                <a
                  href="https://thomasuhrberg.se/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-800 hover:border-slate-400"
                >
                  🧠 Thomas Uhrberg – tips & info
                </a>
              </div>
            </section>
          </div>

          <section
            id="swish-tipset"
            className="scroll-mt-28 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Swish-tipset
              </p>
              <h2 className="text-lg font-semibold">
                Veckans 3 kuponger – (tips för 19 kr)
              </h2>
              <p className="text-xs text-slate-600">
                Tre färdiga V85-förslag – du får raderna och spelar dom
                själv på ATG.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-3 text-xs text-amber-900">
              <p className="flex items-center gap-2 text-[13px] font-semibold">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs">
                  💡
                </span>
                Veckans kupong är låst
              </p>
              <p>
                Tipset kostar <span className="font-semibold">19 kr</span>. När
                du har swishat enligt instruktionen nedan skickas raden
                manuellt via SMS till numret du uppger i meddelandet.
              </p>
              <p>
                Betalning sker via Swish med QR-koden eller nummer i appen. Du
                får alltid bekräftelse när tipset är skickat.
              </p>
            </div>

            <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs sm:grid-cols-[1.5fr,1fr]">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Så funkar Swish-tipset
                </p>
                <ol className="list-decimal space-y-1 pl-4 text-slate-700">
                  <li>Öppna Swish-appen på din telefon.</li>
                  <li>
                    Välj{" "}
                    <span className="font-medium">“Skanna QR-kod”</span> och
                    rikta kameran mot QR-koden här bredvid.
                  </li>
                  <li>
                    Belopp: <span className="font-semibold">19 kr</span>.
                  </li>
                  <li>
                    Skriv ditt{" "}
                    <span className="font-semibold">
                      mobilnummer i meddelandet
                    </span>{" "}
                    (dit tipset ska skickas).
                  </li>
                  <li>Godkänn betalningen.</li>
                </ol>
                <p className="mt-1 text-[11px] text-slate-500">
                  När betalningen syns får du veckans kupong via SMS så snart
                  som möjligt.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="rounded-xl border border-slate-200 bg-white p-2">
                  <img
                    src="./swish-qr.png"
                    alt="Swish QR-kod för veckans kupong"
                    className="h-40 w-40 object-contain"
                  />
                </div>
                <p className="text-[11px] text-slate-500 text-center">
                  Skanna QR-koden med Swish-appen för att betala 19 kr och få
                  tipset via SMS.
                </p>
              </div>
            </div>
          </section>
        </section>

        <section
          id="v85-guide"
          className="mt-6 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                För dig som vill fördjupa dig
              </p>
              <h2 className="text-base font-semibold">
                V85 – så funkar spelet och den nya 30/50/70-fördelningen
              </h2>
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-700">
              <h3 className="text-sm font-semibold text-slate-900">
                Grunderna i V85
              </h3>
              <p className="mt-1 text-xs">
                V85 är ett streckspel där du ska hitta vinnaren i åtta lopp.
                Ju fler rätt du har, desto större del av potten får du. Du
                väljer själv hur många hästar du vill gardera med i varje
                avdelning.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                <li>8 avdelningar – minst en häst per lopp.</li>
                <li>
                  Systemkostnad = antal rader × 0,25 kr (eller enligt
                  aktuell radinsats).
                </li>
                <li>
                  Spelas oftast som <span className="font-medium">V86</span>{" "}
                  men med kvällens bana/omgång som fokus.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-3 text-sm text-slate-800">
              <h3 className="text-sm font-semibold text-slate-900">
                Ny utdelningsmodell – 30 / 50 / 70
              </h3>
              <p className="mt-1 text-xs">
                I den nya modellen fördelas potten mellan olika
                vinstpooler på ett lite annorlunda sätt än tidigare, för att
                ge mer stabil utdelning men fortfarande chans på riktigt stora
                pengar.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                <li>
                  Största delen av potten går fortsatt till{" "}
                  <span className="font-medium">8 rätt</span>.
                </li>
                <li>
                  Mindre men viktig del till 7 och 6 rätt – så att fler får
                  tillbaka en slant även med en miss.
                </li>
                <li>
                  Jackpottar byggs upp när utdelningen blir låg eller ingen
                  utdelning ges i någon pott.
                </li>
              </ul>
              <p className="mt-2 text-[11px] text-slate-600">
                Exakta procentsiffror och aktuella regler hittar du alltid hos
                ATG under spelinformationen för V86/V85.
              </p>
            </div>
          </div>
        </section>

        <section
          id="gratis-tips"
          className="mt-6 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Gratis tips & analyser
              </p>
              <h2 className="text-base font-semibold">
                Samlade länkar inför veckans V85
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Här hittar du gratisanalyser, krönikor och idéer som kan hjälpa
                dig bygga din egen kupong.
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {gratisTipsLankar.map((lank) => (
              <a
                key={lank.url}
                href={lank.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-700 hover:border-sky-300 hover:bg-sky-50/80"
              >
                <div>
                  <p className="font-medium text-slate-900">{lank.namn}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {lank.typ}
                  </p>
                </div>
                <span className="mt-1 text-[11px] text-slate-400">
                  Öppna →
                </span>
              </a>
            ))}
          </div>
        </section>

        <section
          id="nycklar"
          className="mt-6 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Nycklar till omgången
              </p>
              <h2 className="text-base font-semibold">
                Spikar, skrällbud och varningar
              </h2>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
            {Object.entries(nycklar).map(([key, item]) => {
              const tone = item.tone || "green";
              const bg =
                tone === "green"
                  ? "bg-emerald-50 border-emerald-200"
                  : tone === "yellow"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-rose-50 border-rose-200";
              const label =
                key === "spik" ? "Spik" : key === "skrall" ? "Skräll" : "Varning";

              return (
                <div
                  key={key}
                  className={`rounded-xl border px-3 py-3 ${bg}`}
                >
                  <div className="text-[11px] font-mono uppercase tracking-wide text-slate-500">
                    {label}
                  </div>
                  <h3 className="mt-1 text-sm font-semibold">{item.titel}</h3>
                  <p className="mt-1 text-xs text-slate-700">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="om-omgangskollen"
          className="mt-6 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Om sidan
              </p>
              <h2 className="text-base font-semibold">Om Omgångskollen</h2>
            </div>
          </div>

          <div className="mt-3 space-y-3 text-sm text-slate-700">
            <p>
              Allt började redan när jag var en liten kille. Min mamma jobbade i
              toton på Jägersro, och varje tisdag och under de stora
              tävlingsdagarna fick jag hänga med henne till banan. Jag minns
              ljudet av hovarna mot banan, doften av stall och spänningen i
              luften när loppen drog igång. Där väcktes mitt hästintresse – och
              en fascination för travet som hängt med hela livet.
            </p>
            <p>
              När jag blev äldre började jag själv jobba i toton. Det blev många
              kvällar med både kunder, kollegor och den där speciella
              stämningen som bara finns på en travbana. Jag och min kusin har
              sedan dess följt travet nära, och varje helg är det självklart att
              vi kikar på V85 och diskuterar loppen in i minsta detalj.
            </p>
            <p>
              Omgångskollen är mitt lilla hobbyprojekt – skapat ur passionen för
              travet och viljan att samla allt på ett ställe. Här hittar du både
              gratis- och betalsidor som lämnar travtips, så du slipper leta
              runt. Dessutom kan du köpa tre olika typer av speltips inför
              helgens V85-omgångar – perfekt för dig som vill ha hjälp att hitta
              rätt vinnare.
            </p>
            <p>
              Omgångskollen är helt enkelt gjort av en traventusiast, för andra
              travälskare.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-[11px] text-slate-500">
        Spela ansvarsfullt. 18+ · Stödlinjen: 020-81 91 00 · Omgångskollen är
        ett fristående hobbyprojekt och inte kopplat till ATG.
      </footer>
    </div>
  );
}

export default App;











