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
      <p className="text-xs text-slate-300">
        Räknar ut tid till spelstopp...
      </p>
    );
  }

  if (timeLeft.finished) {
    return (
      <p className="text-sm font-medium text-lime-300">
        Kupongen är stängd – ny omgång på gång!
      </p>
    );
  }

  const Item = ({ label, value }) => (
    <div className="flex flex-col items-center">
      <div className="rounded-lg bg-slate-950/60 px-2 py-1.5 font-mono text-sm text-lime-200">
        {value}
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-3 text-center text-xs">
      <Item label="dagar" value={timeLeft.days} />
      <Item
        label="timmar"
        value={String(timeLeft.hours).padStart(2, "0")}
      />
      <Item
        label="minuter"
        value={String(timeLeft.minutes).padStart(2, "0")}
      />
      <Item
        label="sekunder"
        value={String(timeLeft.seconds).padStart(2, "0")}
      />
    </div>
  );
}

const defaultNycklar = {
  spik: {
    titel: "2 Shogun R.R",
    text: "Stark och rejäl sort som tål att göra grovjobb – given spik i raden.",
  },
  skrall: {
    titel: "12 Funny Guy & 6 Cuelebre",
    text: "Två roliga kantbollar som kan rensa ordentligt om det klaffar.",
  },
  varning: {
    titel: "12 Freeloader",
    text: "Formstark typ som lätt blir bortglömd – ska med på större system.",
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
          setVader({ temp, wind, precip });
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
      <p className="mt-3 text-xs text-slate-400">
        Kunde inte hämta väderdata just nu.
      </p>
    );
  }

  if (!vader) {
    return (
      <p className="mt-3 text-xs text-slate-400">
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
    <div className="mt-4 rounded-2xl border border-indigo-900/50 bg-slate-900/80 p-4 text-xs text-slate-100">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
        Banförhållanden just nu
      </p>
      <p className="mt-2 text-sm">
        🌡️ <span className="font-semibold">{vader.temp} °C</span> · 💨{" "}
        <span className="font-semibold">{vader.wind} m/s</span> · 🌧️{" "}
        <span className="font-semibold">{vader.precip} mm</span>
      </p>
      <p className="mt-2 text-[11px] italic text-slate-300">{tungBanaText}</p>
      {beskrivning && (
        <p className="mt-2 text-[11px] text-slate-300">{beskrivning}</p>
      )}
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [countdownTarget, setCountdownTarget] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
  const startlistor = data?.startlistor || [];
  const banaStatistik = data?.banaStatistik || { kuskar: [], tranare: [] };
  const nyheter = data?.nyheter || [];
  const historik = data?.historik || defaultHistorik;
  const gratisTips = data?.gratisTips || [];
  const snabbfakta = data?.snabbfakta || null;

  const gratisLankar = gratisTips.filter((lank) => {
    const t = String(lank.typ || "").toLowerCase();
    return !t.includes("betal");
  });

  const betalLankar = gratisTips.filter((lank) => {
    const t = String(lank.typ || "").toLowerCase();
    return t.includes("betal");
  });

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

  const spelaUrl =
    data?.omgang?.spelaUrl ||
    "https://www.atg.se/spel/2025-11-22/V85/solvalla/avd/1";

  const programUrl =
    data?.omgang?.programUrl ||
    "https://assets.ctfassets.net/hkip2osr81id/39uvrIW4wvyccGJij4j7X7/e48d16ad41ce42b912807ef8195f21db/251108_BERGSAKER_GP_V85_1.pdf";

  const sectionNav = [
    { id: "oversikt", label: "Översikt" },
    { id: "nycklar", label: "Nycklar" },
    { id: "senaste-nytt", label: "Senaste nytt" },
    { id: "lankar", label: "Länkar" },
    { id: "swish-tipset", label: "Swish-tipset" },
    { id: "v85-guide", label: "V85-guide" },
    { id: "faq", label: "FAQ" },
    { id: "om-omgangskollen", label: "Om sidan" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img
              src="./omgangskollen-dark.png"
              alt="Omgångskollen logotyp"
              className="h-7 w-auto"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold tracking-tight">
                Omgångskollen
              </span>
              <span className="text-[10px] text-slate-400">
                V85 · travtips & översikt
              </span>
            </div>
          </div>

          {/* Desktopnav: väldigt diskret */}
          <nav className="hidden items-center gap-3 text-[11px] text-slate-300 lg:flex">
            <a
              href="#oversikt"
              className="hover:text-lime-300 transition-colors"
            >
              Översikt
            </a>
            <a
              href="#nycklar"
              className="hover:text-lime-300 transition-colors"
            >
              Nycklar
            </a>
            <a
              href="#lankar"
              className="hover:text-lime-300 transition-colors"
            >
              Länkar
            </a>
            <a
              href="#swish-tipset"
              className="hover:text-lime-300 transition-colors"
            >
              Swish-tipset
            </a>
            <a
              href={spelaUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-lime-400/70 bg-lime-400/10 px-3 py-1 text-[11px] font-semibold text-lime-200 hover:bg-lime-400/20"
            >
              🎫 Spela hos ATG
            </a>
          </nav>

          {/* Mobilmeny-knapp */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm lg:hidden"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-label="Öppna meny"
          >
            {mobileNavOpen ? (
              <span className="flex items-center gap-1">
                <span>Stäng</span>
                <span className="text-base leading-none">✕</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span>Meny</span>
                <span className="text-base leading-none">☰</span>
              </span>
            )}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-slate-800 bg-slate-950 lg:hidden">
            <nav className="mx-auto max-w-6xl px-4 py-2">
              <ul className="flex flex-col gap-1 text-sm text-slate-100">
                <li>
                  <a
                    href="#oversikt"
                    className="block rounded-md px-2 py-1 hover:bg-slate-900"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Översikt
                  </a>
                </li>
                <li>
                  <a
                    href="#nycklar"
                    className="block rounded-md px-2 py-1 hover:bg-slate-900"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Nycklar & spikar
                  </a>
                </li>
                <li>
                  <a
                    href="#senaste-nytt"
                    className="block rounded-md px-2 py-1 hover:bg-slate-900"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Senaste nytt
                  </a>
                </li>
                <li>
                  <a
                    href="#lankar"
                    className="block rounded-md px-2 py-1 hover:bg-slate-900"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Länkar & analyser
                  </a>
                </li>
                <li>
                  <a
                    href="#swish-tipset"
                    className="block rounded-md px-2 py-1 hover:bg-slate-900"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Swish-tipset
                  </a>
                </li>
                <li>
                  <a
                    href="#v85-guide"
                    className="block rounded-md px-2 py-1 hover:bg-slate-900"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    V85-guide
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="block rounded-md px-2 py-1 hover:bg-slate-900"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#om-omgangskollen"
                    className="block rounded-md px-2 py-1 hover:bg-slate-900"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Om sidan
                  </a>
                </li>
                <li className="mt-1">
                  <a
                    href={spelaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-full border border-lime-400/70 bg-lime-400/10 px-3 py-1.5 text-center text-[12px] font-semibold text-lime-200"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    🎫 Spela V85 hos ATG
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6">
        {/* HERO / ÖVERSIKT */}
        <section id="oversikt" className="scroll-mt-20">
          {senastUppdateradText && (
            <div className="mb-2 flex justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300">
                <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(190,242,100,0.8)]" />
                Uppdaterad {senastUppdateradText}
              </span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-[1.8fr,1.2fr] md:items-stretch">
            {/* Vänster: info + countdown */}
            <div className="relative overflow-hidden rounded-2xl border border-indigo-700/70 bg-gradient-to-br from-indigo-800 via-indigo-900 to-slate-950 p-4 shadow-lg">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(190,242,100,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.15),_transparent_55%)]" />
              <div className="relative z-10 flex flex-col justify-between gap-4 md:h-full">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-200/90">
                    Nästa omgång · {data?.omgang?.typ || "V85"}
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                    {data?.omgang?.rubrik || "V85 – veckans omgång"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-200/90">
                    {data?.omgang?.bana || "Travbana"}{" "}
                    {data?.omgang?.datum ? `· ${data.omgang.datum}` : null}
                  </p>
                  <p className="mt-2 text-xs text-indigo-100/90">
                    {data?.omgang?.jackpot ||
                      "Jackpott eller extra pengar i potten kan ge rejäl utdelning."}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                  <a
                    href={programUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-lime-400 px-3 py-1.5 text-[12px] font-semibold text-slate-950 shadow hover:bg-lime-300"
                  >
                    📄{" "}
                    {data?.omgang?.programLabel ||
                      "Öppna gratisprogram"}
                  </a>
                  <a
                    href={spelaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-lime-300/70 bg-slate-950/40 px-3 py-1.5 text-[12px] font-semibold text-lime-200 hover:bg-slate-900"
                  >
                    🎫 Spela V85 hos ATG
                  </a>
                </div>

                <div className="mt-4 grid gap-3 text-xs sm:grid-cols-[1.6fr,1.4fr]">
                  <div className="rounded-xl border border-indigo-500/40 bg-slate-950/50 px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-200">
                      Tid kvar till spelstopp
                    </p>
                    <div className="mt-2">
                      <Countdown targetTime={countdownTarget} />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-300">
                      Spelstopp:{" "}
                      <span className="font-semibold">
                        {data?.omgang?.spelstopp || "16:20"}
                      </span>{" "}
                      · dubbelkolla alltid hos ATG innan du lämnar in.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                      Spelhumör i omgången
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-50">
                      {barometer.favoritProcent}% favoritläge
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {barometer.text}
                    </p>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-lime-400 via-yellow-300 to-amber-400"
                        style={{
                          width: `${Math.max(
                            10,
                            Math.min(barometer.favoritProcent, 100)
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                      <span>Mycket skrällchans</span>
                      <span>Starka favoriter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Höger: snabbfakta & kort intro */}
            <div className="flex flex-col gap-3">
              {snabbfakta && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
                    Snabbfakta om spelet
                  </p>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] text-slate-400">Antal lopp</p>
                      <p className="text-sm font-semibold">
                        {snabbfakta.antalLopp}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Radpris</p>
                      <p className="text-sm font-semibold">
                        {snabbfakta.radpris}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Utdelning</p>
                      <p className="text-sm font-semibold">
                        {snabbfakta.utdelning}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">
                        Återbetalning
                      </p>
                      <p className="text-sm font-semibold">
                        {snabbfakta.aterbetalning}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Överblick
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-100">
                  {data?.omgang?.introText ||
                    "Veckans V85-omgång bjuder på en blandning av starka favoriter och öppna lopp där skrällarna lurar runt hörnet."}
                </p>

                <BaneVader
                  beskrivning={
                    data?.omgang?.banaVaderText || data?.omgang?.beskrivning
                  }
                  lat={banaLat}
                  lon={banaLon}
                />
              </div>
            </div>
          </div>

          {/* Sekundär navigering – chips under hero */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 text-[11px] text-slate-200">
            {sectionNav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-900 px-3 py-1 hover:border-lime-400/70 hover:text-lime-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </section>

        {/* NYCKLAR */}
        <section
          id="nycklar"
          className="mt-8 scroll-mt-20 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Nycklar till omgången
              </p>
              <h2 className="text-base font-semibold text-slate-50">
                Spikar, skrällbud och varningar i korthet
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Dessa tre rutor ger dig en snabb känsla för hur du kan bygga
                systemet.
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
            {Object.entries(nycklar).map(([key, item]) => {
              const label =
                key === "spik" ? "Spik" : key === "skrall" ? "Skräll" : "Varning";

              let border = "";
              let badge = "";
              if (key === "spik") {
                border =
                  "border-lime-400/70 bg-gradient-to-br from-lime-500/10 to-slate-900";
                badge = "bg-lime-400/20 text-lime-200 border border-lime-400/60";
              } else if (key === "skrall") {
                border =
                  "border-amber-400/70 bg-gradient-to-br from-amber-500/10 to-slate-900";
                badge =
                  "bg-amber-400/20 text-amber-100 border border-amber-400/60";
              } else {
                border =
                  "border-rose-400/70 bg-gradient-to-br from-rose-500/10 to-slate-900";
                badge = "bg-rose-400/20 text-rose-100 border border-rose-400/60";
              }

              return (
                <article
                  key={key}
                  className={`relative overflow-hidden rounded-2xl border px-3 py-3 ${border}`}
                >
                  <div className="absolute right-0 top-0 h-16 w-16 translate-x-6 -translate-y-6 rounded-full bg-white/5 blur-2xl" />
                  <div className="relative z-10">
                    <span
                      className={`inline-flex rounded-full px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide ${badge}`}
                    >
                      {label}
                    </span>
                    <h3 className="mt-2 text-sm font-semibold text-slate-50">
                      {item.titel}
                    </h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-100">
                      {item.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SENASTE NYTT */}
        {nyheter.length > 0 && (
          <section
            id="senaste-nytt"
            className="mt-8 scroll-mt-20 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Senaste nytt
                </p>
                <h2 className="text-base font-semibold text-slate-50">
                  Viktiga uppdateringar inför omgången
                </h2>
                <p className="mt-1 text-xs text-slate-300">
                  Strykningar, balansändringar och analyser – bra att skumma
                  igenom innan du spikar.
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
                  className="flex items-start justify-between gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-200 hover:border-indigo-400/80 hover:bg-slate-900"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-50">
                      {nytt.rubrik}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {nytt.kalla}
                      {nytt.tid ? ` · ${nytt.tid}` : ""}
                    </p>
                  </div>
                  <span className="mt-1 text-[11px] text-indigo-300">
                    Läs →
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* LÄNKAR – GRATIS / BETAL */}
        <section
          id="lankar"
          className="mt-8 scroll-mt-20 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Tips & analyser
              </p>
              <h2 className="text-base font-semibold text-slate-50">
                Samlade länkar inför veckans V85
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Ett ställe att börja på – både gratissidor och betaltips samlade
                på rad.
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-300">
                Gratissajter
              </h3>
              <p className="mt-1 text-[11px] text-slate-400">
                Öppna analyser, startlistor och idéer utan inloggning.
              </p>
              <div className="mt-2 space-y-2">
                {gratisLankar.map((lank) => (
                  <a
                    key={lank.url}
                    href={lank.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start justify-between gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 hover:border-lime-300/80 hover:bg-slate-900"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-50">
                        {lank.namn}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {lank.typ}
                      </p>
                    </div>
                    <span className="mt-1 text-[11px] text-lime-300">
                      Öppna →
                    </span>
                  </a>
                ))}
                {gratisLankar.length === 0 && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    Inga gratissajter inlagda ännu.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
                Betalsajter
              </h3>
              <p className="mt-1 text-[11px] text-slate-400">
                Premiumtips och fördjupande material.
              </p>
              <div className="mt-2 space-y-2">
                {betalLankar.length === 0 && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    Inga betalsajter inlagda just nu.
                  </p>
                )}
                {betalLankar.map((lank) => (
                  <a
                    key={lank.url}
                    href={lank.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start justify-between gap-2 rounded-2xl border border-amber-500/50 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 hover:border-amber-300 hover:bg-slate-900"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-50">
                          {lank.namn}
                        </p>
                        <span className="inline-flex rounded-full bg-amber-400/20 px-2 py-[2px] text-[10px] font-medium text-amber-100">
                          Betal
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {lank.typ}
                      </p>
                    </div>
                    <span className="mt-1 text-[11px] text-amber-200">
                      Öppna →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SWISH-TIPSET */}
        <section
          id="swish-tipset"
          className="mt-8 scroll-mt-20 rounded-2xl border border-amber-500/60 bg-gradient-to-br from-amber-900 via-slate-950 to-slate-950 p-4"
        >
          <div className="grid gap-4 md:grid-cols-[1.7fr,1.3fr] md:items-start">
            <div className="space-y-3 text-xs text-amber-50">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
                  Swish-tipset
                </p>
                <h2 className="text-lg font-semibold text-amber-50">
                  Veckans tre speltips – 19 kr
                </h2>
                <p className="mt-1 text-[13px] text-amber-50/90">
                  Tre genomarbetade V85-förslag inför lördagens omgång. Du får
                  raderna via SMS senast en timme innan spelstopp och spelar
                  alltid själv hos ATG.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl border border-amber-400/60 bg-amber-900/40 px-3 py-3 text-xs">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-amber-50">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-200/90 text-xs text-amber-900">
                    💡
                  </span>
                  Veckans tre speltips är låsta
                </p>
                <p>
                  Tipset kostar{" "}
                  <span className="font-semibold text-amber-50">19 kr</span>.
                  När du har swishat enligt instruktionen nedan skickas tre
                  färdiga V85-förslag manuellt via SMS till numret du uppger i
                  meddelandet.
                </p>
                <p>
                  Du spelar alltid systemen själv hos ATG. Omgångskollen säljer
                  endast spelförslag och är ett fristående hobbyprojekt.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/40 bg-slate-950/50 p-3 text-xs text-amber-50">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200">
                  Så funkar Swish-tipset
                </p>
                <ol className="mt-2 list-decimal space-y-1 pl-4">
                  <li>Öppna Swish-appen på din telefon.</li>
                  <li>
                    Välj <span className="font-medium">“Skanna QR-kod”</span>{" "}
                    och rikta kameran mot QR-koden här bredvid.
                  </li>
                  <li>
                    Belopp:{" "}
                    <span className="font-semibold text-amber-50">
                      19 kr
                    </span>
                    .
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

                <div className="mt-3 rounded-lg bg-slate-950/70 p-3 text-[11px]">
                  <p className="font-semibold text-amber-100">
                    📱 Surfar du direkt i mobilen?
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-amber-50/90">
                    <li>Ta en skärmdump på QR-koden här på sidan.</li>
                    <li>Öppna Swish-appen.</li>
                    <li>
                      Välj funktionen för att skanna QR-kod från bild (om appen
                      har det), annars skriv in uppgifterna manuellt.
                    </li>
                    <li>
                      Ange belopp 19 kr och skriv ditt mobilnummer i
                      meddelandefältet.
                    </li>
                    <li>
                      Godkänn betalningen – tipset skickas via SMS så snart som
                      möjligt.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-amber-400/40 bg-slate-950/70 p-3">
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-2">
                <img
                  src="./swish-qr.png"
                  alt="Swish QR-kod för veckans tre speltips"
                  className="h-40 w-40 object-contain"
                />
              </div>
              <p className="text-center text-[11px] text-amber-100/90">
                Skanna QR-koden med Swish-appen för att betala 19 kr och få
                speltipsen via SMS.
              </p>
            </div>
          </div>
        </section>

        {/* STARTLISTOR + STATISTIK om det finns */}
        {(startlistor.length > 0 ||
          (banaStatistik.kuskar?.length || 0) > 0 ||
          (banaStatistik.tranare?.length || 0) > 0) && (
          <section className="mt-8 scroll-mt-20 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              {startlistor.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Kort startlista
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Snabb överblick – topp 3 per avdelning.
                  </p>
                  <div className="mt-2 space-y-1.5 text-xs text-slate-100">
                    {startlistor.map((lopp) => (
                      <div
                        key={lopp.avd}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
                      >
                        <span className="font-semibold text-slate-50">
                          {lopp.avd}
                        </span>
                        <span className="text-[11px] text-slate-300">
                          {lopp.kort}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(banaStatistik.kuskar?.length || 0) > 0 ||
              (banaStatistik.tranare?.length || 0) > 0 ? (
                <div className="space-y-3 text-xs text-slate-100">
                  {banaStatistik.kuskar?.length > 0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Vinstrikaste kuskar på banan
                      </p>
                      <ul className="mt-2 space-y-1">
                        {banaStatistik.kuskar.map((kusk) => (
                          <li key={kusk.namn}>
                            <span className="font-medium">{kusk.namn}</span>{" "}
                            <span className="text-slate-400">
                              – {kusk.segerprocent}% segrar
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {banaStatistik.tranare?.length > 0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Formstarka tränare
                      </p>
                      <ul className="mt-2 space-y-1">
                        {banaStatistik.tranare.map((tr) => (
                          <li key={tr.namn}>
                            <span className="font-medium">{tr.namn}</span>{" "}
                            <span className="text-slate-400">
                              – {tr.segerprocent}% segrar
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </section>
        )}

        {/* GUIDE */}
        <section
          id="v85-guide"
          className="mt-8 scroll-mt-20 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                För dig som vill fördjupa dig
              </p>
              <h2 className="text-base font-semibold text-slate-50">
                V85 – grunderna & utdelningen
              </h2>
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-sm text-slate-100">
              <h3 className="text-sm font-semibold text-slate-50">
                Grunderna i V85
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-200">
                V85 är ett streckspel där du ska hitta vinnaren i åtta lopp på
                lördagen. Ju fler rätt du har, desto större del av potten får
                du. Du väljer själv hur många hästar du vill gardera med i varje
                avdelning.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] text-slate-200">
                <li>8 avdelningar – minst en häst per lopp.</li>
                <li>
                  Systemkostnad = antal rader × 0,25 kr (eller den radinsats
                  som gäller för V85).
                </li>
                <li>
                  Fokus här är alltid helgens V85-omgång – sidan är byggd för
                  lördagsspelet.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-indigo-600/60 bg-slate-950/80 p-3 text-sm text-slate-100">
              <h3 className="text-sm font-semibold text-slate-50">
                Utdelning och jackpottar
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-200">
                Potten delas mellan olika vinstnivåer, där störst del går till
                full pott. Lägre nivåer gör att fler kan få tillbaka en slant,
                även om någon spik missar.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] text-slate-200">
                <li>Största delen av potten går till högsta vinstnivån.</li>
                <li>
                  Lägre vinstnivåer ger chans till återbäring trots en eller
                  två missar.
                </li>
                <li>
                  Jackpottar byggs upp när utdelningen blir låg eller inte
                  delas ut.
                </li>
              </ul>
              <p className="mt-2 text-[11px] text-slate-400">
                Exakta procentsiffror och aktuella regler hittar du alltid hos
                ATG under spelinformationen för V85.
              </p>
            </div>
          </div>
        </section>

        {/* HISTORIK */}
        {historik && historik.length > 0 && (
          <section
            id="historik"
            className="mt-8 scroll-mt-20 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Tidigare omgångar
                </p>
                <h2 className="text-base font-semibold text-slate-50">
                  Senaste V85-omgångarna
                </h2>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-slate-100">
              {historik.map((rad) => (
                <div
                  key={`${rad.bana}-${rad.datum}`}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-slate-50">
                      {rad.bana} – {rad.datum}
                    </p>
                    {rad.etikett && (
                      <p className="text-[11px] text-slate-400">
                        {rad.etikett}
                      </p>
                    )}
                  </div>
                  {rad.url && (
                    <a
                      href={rad.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-medium text-lime-300 hover:underline"
                    >
                      Visa →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section
          id="faq"
          className="mt-8 scroll-mt-20 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Vanliga frågor
            </p>
            <h2 className="text-base font-semibold text-slate-50">
              FAQ – frågor & svar
            </h2>
          </div>

          <div className="mt-3 grid gap-3 text-sm text-slate-100 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
              <p className="font-semibold">
                Hur ofta uppdateras tipsen inför V85?
              </p>
              <p className="mt-1 text-[12px] text-slate-200">
                Sidan uppdateras normalt torsdag–lördag inför omgången. Vid sena
                strykningar eller nya uppgifter kan sidan uppdateras närmare
                spelstopp.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
              <p className="font-semibold">Är tipsen gratis?</p>
              <p className="mt-1 text-[12px] text-slate-200">
                Analysdelarna på sidan är gratis att läsa. Swish-tipset kostar
                19 kr och då får du tre färdiga speltips som du själv spelar hos
                ATG.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
              <p className="font-semibold">
                Var kommer startlistor och övrig data ifrån?
              </p>
              <p className="mt-1 text-[12px] text-slate-200">
                All information på sidan sammanställs manuellt inför varje
                omgång. Målet är att på sikt använda officiella data via ATG:s
                AIS-tjänst.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
              <p className="font-semibold">
                Garanti på vinst eller “säkra” system?
              </p>
              <p className="mt-1 text-[12px] text-slate-200">
                Nej. Trav är ett spel med risk och slump. Tipsen är endast idéer
                och inspiration – spela alltid ansvarsfullt och bara för pengar
                du har råd att förlora.
              </p>
            </div>
          </div>
        </section>

        {/* OM SIDAN */}
        <section
          id="om-omgangskollen"
          className="mt-8 scroll-mt-20 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Om sidan
              </p>
              <h2 className="text-base font-semibold text-slate-50">
                Om Omgångskollen
              </h2>
            </div>
          </div>

          <div className="mt-3 space-y-3 text-sm text-slate-100">
            <p>
              Allt började redan när jag var en liten kille. Min mamma jobbade i
              toton på Jägersro, och varje tisdag och under de stora
              tävlingsdagarna fick jag hänga med henne till banan. Jag minns
              ljudet av hovarna mot banan, doften av stall och spänningen i
              luften när loppen drog igång.
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
              runt. Dessutom kan du köpa speltips inför helgens V85-omgångar –
              perfekt som stöd när du bygger egna system.
            </p>
            <p>
              Omgångskollen är helt enkelt gjort av en traventusiast, för andra
              travälskare.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-[11px] text-slate-500">
        Spela ansvarsfullt. 18+ · Stödlinjen: 020-81 91 00 · Omgångskollen är
        ett fristående hobbyprojekt och inte kopplat till ATG.
      </footer>
    </div>
  );
}

export default App;