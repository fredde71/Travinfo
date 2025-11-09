import React, { useEffect, useState } from "react";

const WEEK_TICKET = [
  { race: 1, horses: "15" },
  { race: 2, horses: "4, 1" },
  { race: 3, horses: "11, 6" },
  { race: 4, horses: "4, 8, 7, 1" },
  { race: 5, horses: "6, 9" },
  { race: 6, horses: "2" },
  { race: 7, horses: "2, 6, 12" },
  { race: 8, horses: "4, 10" },
];

const START_TIME = new Date("2025-11-08T16:20:00+01:00").getTime();

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(target - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (timeLeft <= 0) {
    return { d: 0, h: 0, m: 0, s: 0 };
  }

  const total = Math.floor(timeLeft / 1000);
  const d = Math.floor(total / (60 * 60 * 24));
  const h = Math.floor((total % (60 * 60 * 24)) / (60 * 60));
  const m = Math.floor((total % (60 * 60)) / 60);
  const s = total % 60;

  return { d, h, m, s };
}

export default function App() {
  const { d, h, m, s } = useCountdown(START_TIME);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.08),_transparent_55%)]" />
      <div className="relative z-10">
        <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
          <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <img
                src="/omgangskollen-dark.png"
                alt="Omgångskollen"
                className="h-9 w-auto"
              />
              <span className="text-sm font-semibold tracking-tight text-slate-50">
                Omgångskollen
              </span>
            </div>
            <ul className="flex gap-4 text-xs md:text-sm text-slate-300">
              <li>
                <a href="#omgang" className="hover:text-sky-400">
                  🏁 Omgång
                </a>
              </li>
              <li>
                <a href="#v85-guide" className="hover:text-sky-400">
                  📘 V85-guide
                </a>
              </li>
              <li>
                <a href="#gratis-tips" className="hover:text-sky-400">
                  🎁 Gratis tips
                </a>
              </li>
              <li>
                <a href="#nycklar" className="hover:text-sky-400">
                  🎯 Spikar & skrällar
                </a>
              </li>
              <li>
                <a href="#swish" className="hover:text-sky-400">
                  💰 Swish-tipset
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-12 pt-6">
          <section className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-100">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Omgångskollen
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
                V85 – Omgångskollen
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Samlar gratislänkar, nyckelhästar och ett låst systemförslag
                inför veckans V85. Spela ansvarsfullt – 18+.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-500/40 bg-slate-900/80 px-4 py-3 text-xs text-slate-200 shadow-lg md:min-w-[260px]">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-semibold text-sky-100">
                  ⏱️ Nedräkning till spelstopp
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[0.65rem] text-slate-300">
                  Lördag 8 nov
                </span>
              </div>
              <div className="mt-1 grid grid-cols-4 gap-2 text-center font-mono">
                <div>
                  <div className="rounded-lg bg-slate-800 px-2 py-1 text-sm">
                    {String(d).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[0.65rem] text-slate-400">dagar</div>
                </div>
                <div>
                  <div className="rounded-lg bg-slate-800 px-2 py-1 text-sm">
                    {String(h).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[0.65rem] text-slate-400">timmar</div>
                </div>
                <div>
                  <div className="rounded-lg bg-slate-800 px-2 py-1 text-sm">
                    {String(m).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[0.65rem] text-slate-400">min</div>
                </div>
                <div>
                  <div className="rounded-lg bg-slate-800 px-2 py-1 text-sm">
                    {String(s).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[0.65rem] text-slate-400">sek</div>
                </div>
              </div>
              <p className="mt-2 text-[0.7rem] text-slate-400">
                Utdelning och villkor enligt ATG. Spela alltid med pengar du har
                råd att förlora.
              </p>
            </div>
          </section>

          <section
            id="omgang"
            className="mb-10 scroll-mt-24 grid gap-4 md:grid-cols-[minmax(0,_2fr)_minmax(0,_1.4fr)]"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-50">
                  🏁 Veckans omgång – Bergsåker
                </h2>
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[0.7rem] font-semibold text-amber-300 border border-amber-500/30">
                  Ej uppdaterat – väntar på analys
                </span>
              </div>
              <p className="text-sm text-slate-200">
                Lördag 8 november – V85 på Bergsåker med{" "}
                <span className="font-semibold">jackpott 50 miljoner</span> i
                potten. Bergsåker är känd för vintriga förhållanden, lite
                krävande bana och ett upplopp som ofta bjuder in formstarka
                hästar bakifrån.
              </p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-200 md:grid-cols-3">
                <li className="rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2">
                  <div className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                    Bana
                  </div>
                  <div className="font-semibold">Bergsåker</div>
                </li>
                <li className="rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2">
                  <div className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                    Datum
                  </div>
                  <div className="font-semibold">Lör 8 november</div>
                </li>
                <li className="rounded-xl bg-slate-900/80 border border-amber-500/40 px-3 py-2">
                  <div className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                    Jackpott
                  </div>
                  <div className="font-semibold text-amber-300">
                    ca 50 miljoner
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
              <h3 className="mb-2 text-sm font-semibold text-slate-100">
                🎫 Gratisprogram
              </h3>
              <p className="mb-3 text-xs text-slate-300">
                ATG:s officiella program med startlistor och fakta:
              </p>
              <a
                href="https://assets.ctfassets.net/hkip2osr81id/39uvrIW4wvyccGJij4j7X7/e48d16ad41ce42b912807ef8195f21db/251108_BERGSAKER_GP_V85_1.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow hover:bg-sky-400"
              >
                📄 Öppna gratisprogram (PDF)
              </a>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <h4 className="mb-2 text-sm font-semibold text-slate-100">
                  🧑‍✈️ Tränare i fokus
                </h4>
                <p className="text-xs text-slate-300">
                  För mer känsla, lyssna gärna på{" "}
                  <a
                    href="https://thomasuhrberg.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 underline-offset-2 hover:underline"
                  >
                    Thomas Uhrberg
                  </a>{" "}
                  och andra rutinerade röster – perfekt komplement till
                  omgångsanalysen.
                </p>
              </div>
            </div>
          </section>

          <section
            id="v85-guide"
            className="mb-10 scroll-mt-24 max-w-5xl mx-auto"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center justify-center rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-300">
                  Om spelet
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-50">
                  V85 – så fungerar spelet
                </h2>
              </div>

              <p className="mb-4 text-sm md:text-base text-slate-200">
                V85 är ett streckspel där du ska hitta vinnarna i åtta lopp.
                Spelet bygger på samma omgång som V86 men ger möjlighet att
                sänka insatsen. Radpriset är normalt{" "}
                <span className="font-semibold">0,50 kr per rad</span> och du kan
                få utdelning på{" "}
                <span className="font-semibold">8, 7, 6 och 5 rätt</span>.
              </p>

              <div className="mb-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-slate-100">
                    Utdelning på V85
                  </h3>
                  <ul className="space-y-1 text-sm text-slate-200">
                    <li>• 8 rätt – ca 35 % av potten</li>
                    <li>• 7 rätt – ca 15 % av potten</li>
                    <li>• 6 rätt – ca 15 % av potten</li>
                    <li>• 5 rätt – ca 35 % av potten</li>
                  </ul>
                  <p className="mt-2 text-[0.7rem] text-slate-400">
                    Exakta nivåer styrs av ATG:s regler, men grundtanken är att
                    både fullträff och femrättspotten ger bra betalt.
                  </p>
                </div>

                <div className="rounded-xl border border-sky-500/60 bg-slate-950/90 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-slate-100">
                    Nytt: 30 / 50 / 70 % insats
                  </h3>
                  <p className="mb-2 text-sm text-slate-200">
                    En nyhet på V85/V86 är att du kan spela med{" "}
                    <span className="font-semibold">sänkt insats</span>. Du kan
                    välja till exempel:
                  </p>
                  <ul className="mb-2 space-y-1 text-sm text-slate-200">
                    <li>• 30 % av ordinarie insats</li>
                    <li>• 50 % av ordinarie insats</li>
                    <li>• 70 % av ordinarie insats</li>
                  </ul>
                  <p className="text-sm text-slate-200">
                    Väljer du ett lägre procentläge sänks insatsen – men också
                    din del av eventuell utdelning. Spelar du på{" "}
                    <span className="font-semibold">50 %</span> får du{" "}
                    <span className="font-semibold">halva utdelningen</span> om
                    systemet går in. Ett sätt att komma billigare undan på
                    större system.
                  </p>
                </div>
              </div>

              <p className="text-sm md:text-base text-slate-200">
                På Omgångskollen fokuserar vi på analys, gratislänkar och
                idéer som hjälper dig att optimera dina system – oavsett om du
                spelar full insats eller med 30, 50 eller 70 procent.
              </p>
            </div>
          </section>

          <section
            id="gratis-tips"
            className="mb-10 scroll-mt-24 max-w-5xl mx-auto"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-50">
                  🎁 Gratis tips & analyser
                </h2>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-[0.7rem] text-slate-300">
                  Kombinera flera källor
                </span>
              </div>
              <p className="mb-4 text-sm text-slate-300">
                Bra översikt på omgången får du genom att kombinera flera
                olika källor. Här är några gratislänkar:
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2 text-sm">
                  <a
                    href="https://www.atg.se/V85/tips/fem-tippar-v85"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-sky-500/60"
                  >
                    ⭐ ATG – Fem Tippar V85
                  </a>
                  <a
                    href="https://www.atg.se/V85/tips/bjornkollen-v85-lordag"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-sky-500/60"
                  >
                    🎥 Björnkollen – V85
                  </a>
                  <a
                    href="https://www.atg.se/V85/tips/vass-eller-kass-v85-lordag"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-sky-500/60"
                  >
                    🔍 Vass eller Kass – V85
                  </a>
                  <a
                    href="https://www.atg.se/V85/tips/251107-stallsnack-v85-bergsaker-multijackpot"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-sky-500/60"
                  >
                    🎙️ Stallsnack – V85 Bergsåker
                  </a>
                  <a
                    href="https://www.atg.se/V85/tips/korsdragaren-fran-vi-tippa-v85"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-sky-500/60"
                  >
                    💣 Kördragaren – Vi Tippa
                  </a>
                </div>
                <div className="space-y-2 text-sm">
                  <a
                    href="https://gratistravtips.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-sky-500/60"
                  >
                    💬 Gratistravtips.se
                  </a>
                  <a
                    href="https://travstugan.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-sky-500/60"
                  >
                    🌲 Travstugan
                  </a>
                  <a
                    href="https://www.atg.se/V85/tips"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-sky-500/60"
                  >
                    📚 ATG – samlade V85-tips
                  </a>
                  <a
                    href="https://www.aftonbladet.se/sportbladet/trav365/a/Gyv09Q/v85-tips-bergsaker-lordagen-8-november-basta-skrallarna-andelssystem-jackpott-50-miljoner"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-sky-500/60"
                  >
                    📰 Trav365 – Aftonbladet
                  </a>
                  <a
                    href="https://www.travronden.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 hover:border-amber-400"
                  >
                    💼 Travronden (premium)
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section
            id="nycklar"
            className="mb-10 scroll-mt-24 max-w-5xl mx-auto"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-50">
                🎯 Spikar, skrällar & varningar
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/60 bg-emerald-500/10 p-4 shadow">
                <div className="text-[0.7rem] font-mono uppercase tracking-wide text-emerald-200">
                  Spik
                </div>
                <h3 className="mt-1 text-lg font-semibold text-emerald-50">
                  2 Shogun R.R
                </h3>
                <p className="mt-1 text-xs text-emerald-100/90">
                  Trolig vinnare med bra läge. Bygger mycket system runt den här
                  spiken.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-500/60 bg-amber-500/10 p-4 shadow">
                <div className="text-[0.7rem] font-mono uppercase tracking-wide text-amber-200">
                  Skrällar
                </div>
                <h3 className="mt-1 text-lg font-semibold text-amber-50">
                  12 Funny Guy & 6 Cuelebre
                </h3>
                <p className="mt-1 text-xs text-amber-100/90">
                  Två roliga drag som kan rensa rejält om de får rätt lopp.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-500/60 bg-rose-500/10 p-4 shadow">
                <div className="text-[0.7rem] font-mono uppercase tracking-wide text-rose-200">
                  Varning
                </div>
                <h3 className="mt-1 text-lg font-semibold text-rose-50">
                  12 Freeloader
                </h3>
                <p className="mt-1 text-xs text-rose-100/90">
                  Häst som riskerar att bli bortglömd i procenten, men har
                  högre segerchans än vad strecken visar.
                </p>
              </div>
            </div>
          </section>

          <section
            id="swish"
            className="mb-12 scroll-mt-24 max-w-5xl mx-auto"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-50">
                💰 Swish-tipset – veckans låsta kupong
              </h2>
              <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-[0.7rem] font-semibold text-emerald-300">
                19 kr • 100 kr system
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-[minmax(0,_1.2fr)_minmax(0,_1fr)]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
                  <p className="mb-2 text-sm text-slate-200">
                    <span className="mr-1">💡</span>
                    <span className="font-semibold">
                      Veckans kupong är låst
                    </span>
                    . Tipset kostar{" "}
                    <span className="font-semibold">19 kr</span>. Efter att du
                    swishat skickas raden manuellt via SMS till det nummer du
                    anger i meddelandet.
                  </p>
                  <p className="text-xs text-slate-400">
                    Betalning sker via Swish genom QR-koden här bredvid.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg">
                  <div className="pointer-events-none absolute inset-0 backdrop-blur-sm bg-slate-950/70" />
                  <div className="relative">
                    <h3 className="text-sm font-semibold text-slate-100">
                      🔒 Veckans kupong – 100 kr
                    </h3>
                    <p className="mt-1 text-xs text-slate-300">
                      Systemet visas inte här på sidan. Efter betalning
                      skickas kupongen manuellt via SMS.
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                      {WEEK_TICKET.map((row) => (
                        <div
                          key={row.race}
                          className="rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-1"
                        >
                          <div className="text-[0.65rem] uppercase tracking-wide text-slate-400">
                            Avd {row.race}
                          </div>
                          <div className="font-mono text-slate-100">
                            {row.horses}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[0.7rem] text-slate-400">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[0.7rem]">
                        🚫
                      </span>
                      <span>
                        Kupongen visas endast för dig som har betalat och får
                        den via SMS.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-sky-500/50 bg-slate-950/90 p-5 text-sm text-slate-200 shadow-lg">
                  <h3 className="mb-2 text-sm font-semibold text-slate-50">
                    📲 Betala med Swish
                  </h3>
                  <p className="mb-2 text-xs text-slate-300">
                    1. Öppna Swish-appen och scanna QR-koden här nedanför – eller
                    skriv in uppgifterna manuellt om du spelar från mobilen.
                  </p>
                  <p className="mb-2 text-xs text-slate-300">
                    2. Belopp:{" "}
                    <span className="font-semibold text-slate-50">
                      19 kr
                    </span>
                  </p>
                  <p className="mb-2 text-xs text-slate-300">
                    3. Meddelande: skriv{" "}
                    <span className="font-semibold">
                      &quot;V85 Bergsåker&quot; + ditt mobilnummer
                    </span>{" "}
                    så att kupongen kan skickas till rätt person.
                  </p>
                  <p className="text-[0.7rem] text-slate-400">
                    När betalningen är genomförd skickas kupongen manuellt via
                    SMS till numret du angav.
                  </p>

                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-[0.7rem] text-slate-300">
                    <p className="mb-1 font-semibold text-slate-100">
                      Om du spelar från mobilen:
                    </p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>
                        Ta en skärmdump av QR-koden och spara i dina bilder.
                      </li>
                      <li>
                        Öppna Swish, tryck på kamera-ikonen och välj bilden med
                        QR-koden.
                      </li>
                      <li>
                        Eller fyll i belopp och mottagare manuellt enligt
                        instruktionerna.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
                  <p className="mb-2 text-xs text-slate-300">
                    Scanna QR-koden i Swish-appen:
                  </p>
                  <div className="rounded-xl bg-white p-2">
                    <img
                      src="/qrKod.png"
                      alt="Swish QR-kod för veckans kupong"
                      className="h-40 w-40 object-contain"
                    />
                  </div>
                  <p className="mt-2 text-[0.65rem] text-slate-400 text-center">
                    Säkerställ att mottagare och belopp stämmer innan du
                    godkänner betalningen.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <footer className="border-t border-slate-800 pt-4 text-center text-[0.7rem] text-slate-500">
            Spela ansvarsfullt. 18+ • Stödlinjen: 020-81 91 00 • Informationen
            på sidan är inofficiell och fristående från ATG.
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;










