import { useEffect, useState } from "react";

const fallbackData = {
  omgang: {
    spelform: "V85",
    bana: "Bergsåker",
    datum: "Lördag 8 november 2025",
    jackpot: "Jackpott 50 miljoner",
    startTid: "20:30",
    nedrakning: "2025-11-08T20:30:00+01:00",
    status: "Ej uppdaterat – väntar på analys",
    senastUppdaterad: "",
    beskrivning:
      "Bergsåker är en av landets mest klassiska vinterbanor med långt upplopp och krävande förhållanden. Perfekt för spelare som gillar tempo hela vägen.",
    programUrl:
      "https://assets.ctfassets.net/hkip2osr81id/39uvrIW4wvyccGJij4j7X7/e48d16ad41ce42b912807ef8195f21db/251108_BERGSAKER_GP_V85_1.pdf"
  },
  nycklar: {
    spik: {
      titel: "Spiken kommer när analysen är klar",
      text: "Just nu jobbar vi med att hitta omgångens bästa spik. Titta in igen närmare spelstopp.",
      tone: "yellow"
    },
    skrall: {
      titel: "Skrälljakten",
      text: "Vi letar efter hästar som kan rensa rejält i kuponghögarna. Skrällförslagen dyker upp här.",
      tone: "red"
    },
    varning: {
      titel: "Varningar att ta på allvar",
      text: "Här lyfter vi favoriter som kan vara överstreckade eller lägen som är luriga.",
      tone: "yellow"
    }
  }
};

function useCountdown(targetIso) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetIso) return;

    const target = new Date(targetIso);
    if (isNaN(target.getTime())) return;

    function update() {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ days, hours, minutes, seconds });
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return timeLeft;
}

function StatusPill({ status }) {
  if (!status) return null;

  const lower = status.toLowerCase();
  let color = "bg-amber-500/15 text-amber-200 ring-amber-400/40";
  if (lower.includes("klar") || lower.includes("uppdaterad")) {
    color = "bg-emerald-500/15 text-emerald-200 ring-emerald-400/40";
  } else if (lower.includes("ej uppdaterat") || lower.includes("väntar")) {
    color = "bg-rose-500/15 text-rose-200 ring-rose-400/40";
  }

  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1 " +
        color
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function NyckelKort({ label, data }) {
  if (!data) return null;
  const tone =
    data.tone === "green"
      ? "bg-emerald-950/60 border-emerald-500/40"
      : data.tone === "red"
      ? "bg-rose-950/60 border-rose-500/40"
      : "bg-amber-950/60 border-amber-500/40";

  const labelText =
    label === "spik" ? "Spik" : label === "skrall" ? "Skräll" : "Varning";

  return (
    <div className={"rounded-2xl border px-4 py-4 shadow-sm " + tone}>
      <div className="text-[11px] font-mono uppercase tracking-wide text-slate-300/80">
        {labelText}
      </div>
      <h3 className="mt-1 text-base font-semibold text-slate-50">
        {data.titel}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-200/80">
        {data.text}
      </p>
    </div>
  );
}

function App() {
  const [data, setData] = useState(fallbackData);
  const [hasLiveData, setHasLiveData] = useState(false);

  useEffect(() => {
    fetch("./data.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte läsa data.json");
        return res.json();
      })
      .then((json) => {
        const merged = {
          ...fallbackData,
          ...json,
          omgang: { ...fallbackData.omgang, ...(json.omgang || {}) },
          nycklar: { ...fallbackData.nycklar, ...(json.nycklar || {}) }
        };
        setData(merged);
        setHasLiveData(true);
      })
      .catch(() => {
        setHasLiveData(false);
        setData(fallbackData);
      });
  }, []);

  const countdown = useCountdown(data.omgang.nedrakning);
  const teamWastmanUrl = "https://www.atg.se/andelsspel";
  const veckansKupongInfo =
    "Här publiceras ett färdigt system runt 100 kr när analysen är klar. Perfekt för dig som vill komma igång snabbt utan att bygga eget system.";

  return (
    <div className="min-h-screen bg-sky-950 text-slate-50">
      <header className="sticky top-0 z-40 border-b border-sky-800 bg-sky-950/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="./omgangskollen-dark.png"
              alt="Omgångskollen"
              className="h-7 w-auto rounded-md bg-sky-900/40 p-1 ring-1 ring-sky-500/40"
            />
            <div>
              <div className="text-sm font-semibold tracking-tight">
                Omgångskollen
              </div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-sky-200/70">
                V85 lördagskollen
              </div>
            </div>
          </div>
          <ul className="flex items-center gap-4 text-xs font-medium text-slate-200/80">
            <li>
              <a
                href="#omgang"
                className="rounded-full px-2 py-1 hover:bg-sky-800/70"
              >
                🏁 Omgång
              </a>
            </li>
            <li>
              <a
                href="#veckans-kupong"
                className="rounded-full px-2 py-1 hover:bg-sky-800/70"
              >
                🎫 Veckans kupong
              </a>
            </li>
            <li>
              <a
                href="#v85-guide"
                className="rounded-full px-2 py-1 hover:bg-sky-800/70"
              >
                📘 V85-guide
              </a>
            </li>
            <li>
              <a
                href="#tips"
                className="rounded-full px-2 py-1 hover:bg-sky-800/70"
              >
                🧩 Tips & länkar
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 space-y-12">
        <section
          id="top"
          className="scroll-mt-24 grid gap-6 rounded-3xl border border-sky-800 bg-gradient-to-br from-sky-900/90 via-sky-950 to-slate-950 px-5 py-6 shadow-xl shadow-sky-950/40 md:grid-cols-[2fr,1.2fr]"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-900/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-100 ring-1 ring-sky-400/60">
                {data.omgang.spelform} lördag
              </span>
              <StatusPill
                status={
                  hasLiveData
                    ? data.omgang.status || "Uppdaterad"
                    : data.omgang.status
                }
              />
            </div>
            <h1 className="text-balance text-3xl font-bold leading-tight text-slate-50 md:text-4xl">
              {data.omgang.spelform} {data.omgang.bana}
            </h1>
            <p className="text-sm text-slate-200/85">
              {data.omgang.datum} • {data.omgang.jackpot} • spelstopp ca{" "}
              {data.omgang.startTid}
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-slate-100/80">
              {data.omgang.beskrivning}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              {data.omgang.programUrl && (
                <a
                  href={data.omgang.programUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-4 py-2 text-xs font-semibold text-sky-950 shadow-md shadow-sky-900/50 hover:bg-sky-300"
                >
                  📄 Veckans gratisprogram (PDF)
                </a>
              )}
              <a
                href={teamWastmanUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-400/60 bg-sky-950/60 px-4 py-2 text-xs font-semibold text-sky-100 hover:bg-sky-900/80"
              >
                🤝 Spela med Omgångskollen!
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-sky-700/80 bg-sky-950/80 p-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300/90">
                Nedräkning till spelstopp
              </h2>
              {countdown ? (
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px]">
                  {[
                    ["Dagar", countdown.days],
                    ["Timmar", countdown.hours],
                    ["Min", countdown.minutes],
                    ["Sek", countdown.seconds]
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-slate-900/80 px-2 py-2 ring-1 ring-sky-500/40"
                    >
                      <div className="text-lg font-semibold tabular-nums">
                        {String(value).padStart(2, "0")}
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-200/80">
                  Spelstopp har troligen passerat. Nästa omgång läggs upp så
                  snart schemat är klart.
                </p>
              )}
            </div>

            <div className="rounded-xl bg-slate-900/60 px-3 py-2 text-[11px] text-slate-200/85">
              <p>
                Omgångsdata hämtas från{" "}
                <span className="font-semibold">ATG</span> och kan uppdateras
                under veckan. Kontrollera alltid kupongen på ATG innan du
                lämnar in.
              </p>
            </div>
          </div>
        </section>

        <section
          id="omgang"
          className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-200">
              🏁 Veckans omgång – {data.omgang.bana}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-3">
              <p className="text-sm leading-relaxed text-slate-100/85">
                Bergsåker är känd för sitt långa upplopp och ofta vinterpräglade
                förutsättningar. Hästar som tål tempo hela vägen, klarar tung
                bana och har styrka i benen brukar gynnas här.
              </p>
              <p className="text-xs text-slate-300/90">
                Tänk extra på balans, form och om hästarna är visade på banan
                tidigare – det kan vara skillnaden mellan 7 rätt och full pott.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-sky-700/70 bg-sky-950/80 p-3 text-xs text-slate-100/90">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300/90">Bana</span>
                <span className="font-medium">{data.omgang.bana}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300/90">Dag</span>
                <span className="font-medium">{data.omgang.datum}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300/90">Spelform</span>
                <span className="font-medium">{data.omgang.spelform}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300/90">Jackpott</span>
                <span className="font-medium">{data.omgang.jackpot}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300/90">Spelstopp</span>
                <span className="font-medium">{data.omgang.startTid}</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="veckans-kupong"
          className="scroll-mt-24 space-y-4 rounded-3xl border border-emerald-700/60 bg-emerald-950/80 px-5 py-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">
              🎫 Veckans kupong
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.6fr,1.1fr]">
            <div className="space-y-3 text-sm text-emerald-50/90">
              <p>
                Veckans kupong är tänkt som ett färdigt system runt{" "}
                <span className="font-semibold">100 kr</span>. Perfekt för dig
                som vill vara med på omgången utan att bygga kupongen själv.
              </p>
              <p>{veckansKupongInfo}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-emerald-50/90">
                <li>Byggs för hand med fokus på spelvärde, inte bara favoriter.</li>
                <li>Anpassas efter bana, väder och jackpotläge.</li>
                <li>På sikt kan kupongen köpas direkt via ATG Tillsammans.</li>
              </ul>
            </div>
            <div className="space-y-3 rounded-2xl bg-emerald-900/70 p-3 text-xs">
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200/90">
                  Kommande funktion
                </div>
                <p className="mt-2 text-[13px] text-emerald-50/95">
                  Här kommer du att kunna klicka hem veckans kupong och spelas
                  direkt via ATG när betallösningen är på plats.
                </p>
              </div>
              <a
                href={teamWastmanUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-emerald-950 shadow-md shadow-emerald-900/60 hover:bg-emerald-300"
              >
                🤝 Spela med Omgångskollen (ATG)
              </a>
              <p className="text-[11px] text-emerald-100/80">
                Tills vidare: spela dina system via ATG eller tillsammans-lag
                du litar på. Omgångskollens egna kupong kopplas hit framöver.
              </p>
            </div>
          </div>
        </section>

        <section
          id="nycklar"
          className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-5"
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-200">
            🎯 Spikar, skrällar och varningar
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <NyckelKort label="spik" data={data.nycklar.spik} />
            <NyckelKort label="skrall" data={data.nycklar.skrall} />
            <NyckelKort label="varning" data={data.nycklar.varning} />
          </div>
        </section>

        <section
          id="v85-guide"
          className="scroll-mt-24 space-y-4 rounded-3xl border border-sky-800 bg-sky-950/85 px-5 py-5"
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-100">
            📘 Så fungerar V85
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-100/90">
            <div className="space-y-2">
              <p>
                V85 är ATG:s lördagsflaggskepp. Spelet går ut på att du ska
                hitta vinnarna i <span className="font-semibold">åtta lopp</span>.
                Du vinner på 8, 7, 6 eller 5 rätt.
              </p>
              <p>
                V85 är ett poolspel – alla insatser hamnar i en gemensam pott
                som delas mellan de som har rätt antal vinnare. Radpriset är
                normalt <span className="font-semibold">50 öre per rad</span>.
              </p>
              <p>
                Du bygger ditt system genom att välja en eller flera hästar i
                varje lopp. Ju fler hästar du tar med, desto fler rader – och
                desto dyrare system.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <ul className="list-disc space-y-1 pl-4">
                <li>Spelform: V85 (8 lopp).</li>
                <li>Vinstnivåer: 8, 7, 6 och 5 rätt.</li>
                <li>Radpris: oftast 0,50 kr per rad.</li>
                <li>
                  Reducerad insats: du kan spela för t.ex. 30–70 % av radpriset,
                  med motsvarande andel av utdelningen.
                </li>
                <li>
                  Kupongen lämnas in via ATG.se, appen eller ATG Tillsammans.
                </li>
              </ul>
              <p className="text-xs text-slate-200/80">
                V85 ersätter V75 på lördagar och är gjort för mer action, större
                toppvinster och fler vinnare – men samma grundtänk: hitta
                vinnarna i varje avdelning.
              </p>
            </div>
          </div>
        </section>

        <section
          id="tips"
          className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/85 px-5 py-5"
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-200">
            🧩 Tips, analyser och gratislänkar
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                ATG – officiella tips
              </h3>
              <ul className="space-y-1 text-sky-100/90">
                <li>
                  <a
                    href="https://www.atg.se/V85/tips"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • ATG:s V85-sida (alla tips)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/fem-tippar-v85"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Fem tippar V85
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/v85-med-fernlund-lordag"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • V85 med Fernlund
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/251104-lordag-811-tips-till-v85-pa-bergsaker"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • ATG-experternas tips till Bergsåker
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/korsdragaren-fran-vi-tippa-v85"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Kördragaren (Vi Tippa / ATG)
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                Fler analyser & inspiration
              </h3>
              <ul className="space-y-1 text-sky-100/90">
                <li>
                  <a
                    href="https://travstugan.se/v85"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Travstugan – V85
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.aftonbladet.se/sportbladet/trav365/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Trav365 (Aftonbladet)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.travronden.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Travronden
                  </a>
                </li>
                <li>
                  <a
                    href="https://femtippar.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Fem Tippar
                  </a>
                </li>
                <li>
                  <a
                    href="https://thomasuhrberg.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Thomas Uhrberg
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-[11px] text-slate-300/80">
            Alla länkar går till externa sidor. Använd dem som inspiration –
            men bygg alltid en kupong som passar din egen spelstil och budget.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/95 py-6 text-center text-[11px] text-slate-400">
        <p>Spela ansvarsfullt. 18+ | Stödlinjen: 020-81 91 00.</p>
        <p className="mt-1">
          Omgångskollen är en fristående infosida – kontrollera alltid
          kupongen på ATG innan du lämnar in.
        </p>
      </footer>
    </div>
  );
}

export default App;
