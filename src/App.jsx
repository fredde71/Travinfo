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

const defaultBarometer = {
  favoritProcent: 60,
  text: "Lite blandad känsla – några starka favoriter men också läge för skrällar i ett par avdelningar.",
};

const defaultHistorik = [];

function BaneVader({ beskrivning, lat, lon }) {
  const [vader, setVader] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchVader() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.current_weather) {
          const temp = json.current_weather.temperature;
          const wind = json.current_weather.windspeed;
          const precip =
            json.hourly && Array.isArray(json.hourly.precipitation)
              ? json.hourly.precipitation[0]
              : 0;
          setVader({
            temp,
            wind,
            precip,
          });
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    }
    fetchVader();
  }, [lat, lon]);

  if (error) {
    return (
      <p className="mt-3 text-xs text-slate-500">
        Kunde inte hämta väderdata just nu.
      </p>
    );
  }

  if (!vader) {
    return (
      <p className="mt-3 text-xs text-slate-500">
        Hämtar väderdata för banan...
      </p>
    );
  }

  const tungBana =
    (typeof vader.precip === "number" && vader.precip > 2) ||
    (typeof vader.wind === "number" && vader.wind > 8);

  const tungBanaText = tungBana
    ? "Förutsättningarna talar för lite tyngre bana – håll koll på hästar som trivs med kraftigare underlag."
    : "Inga tydliga tecken på tung bana just nu, mer normala förutsättningar att vänta.";

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Banförhållanden just nu
      </p>
      <p className="mt-1">
        🌡️ Temperatur: <span className="font-semibold">{vader.temp} °C</span> ·{" "}
        💨 Vind: <span className="font-semibold">{vader.wind} m/s</span> · 🌧️{" "}
        Nederbörd: <span className="font-semibold">{vader.precip} mm</span>
      </p>
      <p className="mt-1 italic text-slate-600">{tungBanaText}</p>
      {beskrivning && (
        <p className="mt-2 text-[11px] text-slate-600">{beskrivning}</p>
      )}
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [countdownTarget, setCountdownTarget] = useState(null);

  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        if (json?.omgang?.nedrakning) {
          setCountdownTarget(json.omgang.nedrakning);
        } else if (json?.omgang?.datum) {
          const dateString = `${json.omgang.datum} ${
            json.omgang.spelstopp || "16:20"
          }`;
          setCountdownTarget(dateString);
        } else {
          setCountdownTarget("2025-11-22T16:20:00+01:00");
        }
      })
      .catch(() => {
        setData(null);
        setCountdownTarget("2025-11-22T16:20:00+01:00");
      });
  }, []);

  const nycklar = data?.nycklar || defaultNycklar;
  const barometer = data?.barometer || defaultBarometer;
  const startlistor = data?.startlistor || null;
  const banaStatistik = data?.banaStatistik || null;
  const nyheter = data?.nyheter || [];
  const historik = data?.historik || defaultHistorik;
  const gratisTips = data?.gratisTips || [];

  // 🔄 Beräkna text till "Uppdaterad"-badgen
  let senastUppdateradText = null;
  if (data?.omgang?.senastUppdaterad) {
    senastUppdateradText = data.omgang.senastUppdaterad;
  } else if (typeof document !== "undefined" && document.lastModified) {
    const d = new Date(document.lastModified);
    senastUppdateradText = d.toLocaleString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const banaLat = data?.omgang?.banaLat || 59.379;
  const banaLon = data?.omgang?.banaLon || 16.554;

  // 🔗 Säker V85-länk – använder data.omgang.spelaUrl om den finns, annars fallback
  const spelaUrl =
    data?.omgang?.spelaUrl ||
    "https://www.atg.se/spel/2025-11-22/V85/solvalla/avd/1";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/40 to-slate-100 text-slate-900">
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
              <a href="#senaste-nytt" className="hover:text-slate-900">
                📰 Senaste nytt
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
              <a href="#faq" className="hover:text-slate-900">
                ❓ FAQ
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
            {/* Uppdaterad-badge ovanför huvudrutan */}
            {senastUppdateradText && (
              <div className="mb-1 flex justify-start">
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200 shadow-sm">
                  🔄 Uppdaterad {senastUppdateradText}
                </span>
              </div>
            )}

            <div className="rounded-2xl bg-gradient-to-br from-sky-600 via-sky-500 to-sky-700 p-[1px] shadow-md">
              <div className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-900/95 p-4 text-slate-50 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">
                    Nästa V85-omgång
                  </p>
                  <h1 className="mt-1 text-2xl font-bold">
                    {data?.omgang?.rubrik || "V85 – veckans omgång"}
                  </h1>
                  <p className="mt-1 text-sm text-sky-100/90">
                    {data?.omgang?.bana || "Travbana"}{" "}
                    {data?.omgang?.datum
                      ? `· ${data.omgang.datum}`
                      : "· lördag"}
                  </p>
                  <p className="mt-1 text-xs text-sky-100/80">
                    {data?.omgang?.jackpot ||
                      "Jackpott eller extra pengar i potten kan ge rejäl utdelning."}
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

            <div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-xs text-slate-800 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600">
                    Spelhumör i omgången
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    Favorit–/skrällbarometer: {barometer.favoritProcent} %
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    {barometer.text}
                  </p>
                </div>
                <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-white text-sky-700 shadow-inner sm:flex">
                  <span className="text-sm font-semibold">
                    {barometer.favoritProcent}%
                  </span>
                </div>
              </div>
            </div>

            <section
              id="omgang"
              className="scroll-mt-28 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h2 className="text-base font-semibold">Veckans omgång</h2>
              <p className="text-sm text-slate-700">
                {data?.omgang?.introText ||
                  data?.omgang?.beskrivning ||
                  "Veckans V85-omgång bjuder på en blandning av starka favoriter och öppna lopp där skrällarna lurar runt hörnet."}
              </p>
              <div className="mt-2 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Bana
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {data?.omgang?.bana || "Travbana"}
                  </p>
                  <p className="mt-1 text-xs">
                    Lokala förutsättningar, form på stallet och balans kan göra
                    stor skillnad här.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Datum & spelstopp
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {data?.omgang?.datum || "lördag"}
                  </p>
                  <p className="mt-1 text-xs">
                    Spelstopp {data?.omgang?.spelstopp || "16:20"} – dubbelkolla
                    alltid tiden hos ATG.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Jackpott
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {data?.omgang?.jackpot || "Ingen jackpottinfo"}
                  </p>
                  <p className="mt-1 text-xs">
                    Extra pengar i potten kan göra bra rader riktigt värdefulla.
                  </p>
                </div>
              </div>

              <BaneVader
                beskrivning={
                  data?.omgang?.banaVaderText || data?.omgang?.beskrivning
                }
                lat={banaLat}
                lon={banaLon}
              />

              {startlistor && startlistor.length > 0 && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-700">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Kort startlista – topp 3 per avdelning
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {startlistor.map((lopp) => (
                      <p key={lopp.avd}>
                        <span className="font-semibold">{lopp.avd}:</span>{" "}
                        <span>{lopp.kort}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {banaStatistik &&
                ((banaStatistik.kuskar &&
                  banaStatistik.kuskar.length > 0) ||
                  (banaStatistik.tranare &&
                    banaStatistik.tranare.length > 0)) && (
                  <div className="mt-3 grid gap-3 text-xs text-slate-700 sm:grid-cols-2">
                    {banaStatistik.kuskar &&
                      banaStatistik.kuskar.length > 0 && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Bästa kuskar på banan
                          </p>
                          <ul className="mt-1 space-y-1">
                            {banaStatistik.kuskar.map((kusk) => (
                              <li key={kusk.namn}>
                                <span className="font-medium">
                                  {kusk.namn}
                                </span>{" "}
                                <span className="text-slate-500">
                                  – {kusk.segerprocent}% segrar
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {banaStatistik.tranare &&
                      banaStatistik.tranare.length > 0 && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Formstarka tränare
                          </p>
                          <ul className="mt-1 space-y-1">
                            {banaStatistik.tranare.map((tr) => (
                              <li key={tr.namn}>
                                <span className="font-medium">
                                  {tr.namn}
                                </span>{" "}
                                <span className="text-slate-500">
                                  – {tr.segerprocent}% segrar
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <a
                  href={
                    data?.omgang?.programUrl ||
                    "https://assets.ctfassets.net/hkip2osr81id/39uvrIW4wvyccGJij4j7X7/e48d16ad41ce42b912807ef8195f21db/251108_BERGSAKER_GP_V85_1.pdf"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-3 py-1.5 font-medium text-white shadow-sm hover:bg-sky-700"
                >
                  📄{" "}
                  {data?.omgang?.programLabel ||
                    "Gratisprogram till omgången"}
                </a>
                <a
                  href={spelaUrl}
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
                Tre färdiga V85-förslag – du får raderna och spelar dem
                själv på ATG.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-3 text-xs text-amber-900">
              <p className="flex items-center gap-2 text-[13px] font-semibold">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs">
                  💡
                </span>
                Veckans kuponger är låsta
              </p>
              <p>
                Tipset kostar <span className="font-semibold">19 kr</span>. När
                du har swishat enligt instruktionen nedan skickas raderna
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
                <div className="mt-3 rounded-lg bg-slate-900/5 p-3 text-[11px] text-slate-700">
                  <p className="font-semibold text-slate-900">
                    📱 Surfar du direkt i mobilen?
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    <li>Ta en skärmdump på QR-koden här på sidan.</li>
                    <li>Öppna Swish-appen.</li>
                    <li>
                      Välj funktionen för att skanna QR-kod från bild (om din
                      app har det), annars skriv in uppgifterna manuellt.
                    </li>
                    <li>
                      Ange belopp 19 kr och skriv ditt mobilnummer i
                      meddelandefältet.
                    </li>
                    <li>
                      Godkänn betalningen – tipset skickas sedan via SMS.
                    </li>
                  </ul>
                </div>
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
                V85 – så funkar spelet och utdelningen
              </h2>
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-700">
              <h3 className="text-sm font-semibold text-slate-900">
                Grunderna i V85
              </h3>
              <p className="mt-1 text-xs">
                V85 är ett streckspel där du ska hitta vinnaren i åtta lopp på
                lördagen. Ju fler rätt du har, desto större del av potten får
                du. Du väljer själv hur många hästar du vill gardera med i varje
                avdelning.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                <li>8 avdelningar – minst en häst per lopp.</li>
                <li>
                  Systemkostnad = antal rader × 0,25 kr (eller den radinsats
                  som gäller för V85 hos ATG).
                </li>
                <li>
                  Fokus här är alltid helgens V85-omgång – en sida för trav
                  på lördagar.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-3 text-sm text-slate-800">
              <h3 className="text-sm font-semibold text-slate-900">
                Utdelning och jackpottar
              </h3>
              <p className="mt-1 text-xs">
                Potten delas mellan olika vinstnivåer, där störst del går till
                full pott. Lägre nivåer ger oftare lite tillbaka även om en
                spik eller idé missar.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                <li>Största delen av potten går till högsta vinstnivån.</li>
                <li>
                  Lägre vinstnivåer gör att fler får tillbaka en slant även med
                  någon miss.
                </li>
                <li>
                  Jackpottar byggs upp när utdelningen blir låg eller inte
                  delas ut.
                </li>
              </ul>
              <p className="mt-2 text-[11px] text-slate-600">
                Exakta procentsiffror och aktuella regler hittar du alltid hos
                ATG under spelinformationen för V85.
              </p>
            </div>
          </div>
        </section>

        {nyheter.length > 0 && (
          <section
            id="senaste-nytt"
            className="mt-6 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Senaste nytt
                </p>
                <h2 className="text-base font-semibold">
                  Nyheter inför veckans omgång
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  Strukna hästar, balansändringar och analyser från travmedia.
                </p>
              </div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {nyheter.map((nytt) => (
                <a
                  key={nytt.url}
                  href={nytt.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-700 hover:border-sky-300 hover:bg-sky-50/90"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {nytt.rubrik}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {nytt.kalla}
                      {nytt.tid ? ` · ${nytt.tid}` : ""}
                    </p>
                  </div>
                  <span className="mt-1 text-[11px] text-slate-400">
                    Läs →
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

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
            {gratisTips.map((lank) => (
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
                  : tone === "gray"
                  ? "bg-slate-50 border-slate-200"
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

        {historik && historik.length > 0 && (
          <section
            id="historik"
            className="mt-6 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Tidigare omgångar
                </p>
                <h2 className="text-base font-semibold">
                  Senaste V85-omgångarna
                </h2>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-slate-700">
              {historik.map((rad) => (
                <div
                  key={`${rad.bana}-${rad.datum}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {rad.bana} – {rad.datum}
                    </p>
                    {rad.etikett && (
                      <p className="text-[11px] text-slate-500">
                        {rad.etikett}
                      </p>
                    )}
                  </div>
                  {rad.url && (
                    <a
                      href={rad.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-medium text-sky-700 hover:underline"
                    >
                      Visa →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ-sektion */}
        <section
          id="faq"
          className="mt-6 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Vanliga frågor
            </p>
            <h2 className="text-base font-semibold">FAQ – Frågor & svar</h2>
          </div>

          <div className="mt-3 space-y-4 text-sm text-slate-700">
            <div>
              <p className="font-semibold">
                Hur ofta uppdateras tipsen inför V85?
              </p>
              <p className="text-xs mt-1">
                Sidan uppdateras normalt torsdag–lördag inför omgången. Vid sena
                strykningar eller uppgifter som påverkar loppen kan sidan
                uppdateras närmare spelstopp.
              </p>
            </div>

            <div>
              <p className="font-semibold">Är tipsen gratis?</p>
              <p className="text-xs mt-1">
                Analysdelarna på sidan är gratis att läsa. Swish-tipset kostar
                19 kr och då får du tre färdiga kuponger via SMS som du själv
                spelar på ATG.
              </p>
            </div>

            <div>
              <p className="font-semibold">
                Var kommer startlistor och övrig data ifrån?
              </p>
              <p className="text-xs mt-1">
                All information sammanställs manuellt inför varje omgång.
                Ambitionen är att på sikt hämta mer data automatiskt via öppna
                API:er om det blir möjligt.
              </p>
            </div>

            <div>
              <p className="font-semibold">
                Garanti på vinst eller “säkra” system?
              </p>
              <p className="text-xs mt-1">
                Nej. Trav är ett spel med risk och slump. Tipsen är endast
                idéer och inspiration – spela alltid ansvarsfullt och bara för
                pengar du har råd att förlora.
              </p>
            </div>
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