import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Hämta data.json
  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, []);

  // Nedräkning
  useEffect(() => {
    if (!data?.omgang) return;

    let target;
    if (data.omgang.spelstopp) {
      target = new Date(data.omgang.spelstopp);
    } else {
      // Fallback: nästa lördag 16:20
      const now = new Date();
      const d = new Date(now);
      const day = d.getDay(); // 0 = sön, 6 = lör
      const daysToSat = (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + daysToSat);
      d.setHours(16, 20, 0, 0);
      target = d;
    }

    const tick = () => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ done: true });
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      setTimeLeft({ days, hours, minutes, done: false });
    };

    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [data]);

  const omgang = data?.omgang;
  const nycklar = data?.nycklar;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="./omgangskollen-dark.png"
              alt="Omgångskollen"
              className="h-8 w-auto"
            />
            <span className="font-semibold tracking-tight text-slate-900">
              Omgångskollen
            </span>
          </div>
          <ul className="hidden md:flex gap-4 text-sm text-slate-600">
            <li>
              <a href="#swish" className="hover:text-slate-900">
                💸 Swish-tipset
              </a>
            </li>
            <li>
              <a href="#omgang" className="hover:text-slate-900">
                🏁 Veckans omgång
              </a>
            </li>
            <li>
              <a href="#guide" className="hover:text-slate-900">
                📘 V85-guide
              </a>
            </li>
            <li>
              <a href="#tips" className="hover:text-slate-900">
                🧩 Gratis tips
              </a>
            </li>
            <li>
              <a href="#nycklar" className="hover:text-slate-900">
                🎯 Spikar & skrällar
              </a>
            </li>
            <li>
              <a href="#kupong" className="hover:text-slate-900">
                🧾 Veckans kupong
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

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* HERO + NEDRÄKNING + SWISH-KORT */}
        <section className="grid lg:grid-cols-[1.4fr,1fr] gap-6 items-stretch">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.18em] text-sky-700 font-semibold">
              Veckans V85
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Omgångskollen – allt inför helgens V85
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Samlad info, gratislänkar och spelidéer inför lördagens omgång.
              Tanken är att du ska slippa ha 15 flikar öppna – börja här.
            </p>

            {/* Nedräkning + snabbfakta */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3 flex flex-col justify-between">
                <div className="text-xs font-semibold text-sky-700 uppercase">
                  Nedräkning till spelstopp
                </div>
                <div className="mt-1 text-sm font-mono text-slate-900">
                  {timeLeft == null ? (
                    <span>⏳ Ej uppdaterat</span>
                  ) : timeLeft.done ? (
                    <span>🔚 Omgången har startat</span>
                  ) : (
                    <span>
                      {timeLeft.days} d {timeLeft.hours} h {timeLeft.minutes} min
                    </span>
                  )}
                </div>
                {omgang && (
                  <div className="mt-2 text-[11px] text-slate-500">
                    Spelstopp ca {omgang.startTid ?? "16:20"}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
                <div className="text-xs font-semibold text-emerald-700 uppercase">
                  Jackpott
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {omgang?.jackpot ? omgang.jackpot : "Ingen info ännu"}
                </div>
                <p className="mt-1 text-[11px] text-emerald-800">
                  Extra pengar i potten – håll koll på spikarna!
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs font-semibold text-slate-700 uppercase">
                  Bana
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {omgang?.bana ?? "Ej uppdaterad"}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  {omgang?.datum ?? "Datum kommer inom kort"}
                </div>
              </div>
            </div>
          </div>

          {/* Swish-tipset kort (överst på sidan) */}
          <section
            id="swish"
            className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white/90 shadow-sm px-4 py-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase">
                💸 Swish-tipset
                <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-[1px] text-[10px] font-medium text-sky-800">
                  Veckans kupong – 100 kr
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">
                Låst V85-rad – skickas via SMS
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Tipset kostar{" "}
                <span className="font-semibold text-slate-900">19 kr</span>. När
                du swishat skickas raden manuellt via SMS till numret du
                anger i meddelandet.
              </p>

              <div className="mt-3 rounded-lg bg-sky-50 border border-sky-100 px-3 py-2 text-xs text-sky-900">
                <div className="font-semibold mb-1">Så gör du:</div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Öppna Swish-appen.</li>
                  <li>
                    Skanna QR-koden nedan. Spelar du från mobilen kan du
                    öppna sidan på en annan enhet eller spara en skärmdump
                    av QR-koden.
                  </li>
                  <li>
                    Skriv ditt mobilnummer i meddelandet – raden skickas via
                    SMS.
                  </li>
                </ol>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 max-w-[60%]">
                Raden är låst här på sidan – du får den efter betalning. Spela
                ansvarsfullt. 18+.
              </div>
              <div className="shrink-0">
                <img
                  src="./swish-qr.png"
                  alt="Swish QR-kod för veckans V85-tips"
                  className="h-24 w-24 rounded-md border border-slate-200 bg-white object-contain"
                />
              </div>
            </div>
          </section>
        </section>

        {/* VECKANS OMGÅNG */}
        <section
          id="omgang"
          className="scroll-mt-24 space-y-3 border-t border-slate-200 pt-6"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            🏁 Veckans omgång
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 space-y-2">
            {omgang ? (
              <>
                <p className="text-sm sm:text-base text-slate-900">
                  <span className="font-semibold">{omgang.bana}</span> –{" "}
                  {omgang.datum}
                </p>
                {omgang.beskrivning && (
                  <p className="text-sm text-slate-600">
                    {omgang.beskrivning}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-600">
                Omgången är inte uppdaterad ännu.
              </p>
            )}
            <div className="text-[11px] text-slate-500">
              Gratisprogram:{" "}
              <a
                href="https://assets.ctfassets.net/hkip2osr81id/39uvrIW4wvyccGJij4j7X7/e48d16ad41ce42b912807ef8195f21db/251108_BERGSAKER_GP_V85_1.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-900 font-medium underline"
              >
                Öppna PDF för veckans omgång
              </a>
            </div>
          </div>
        </section>

        {/* V85-GUIDE */}
        <section
          id="guide"
          className="scroll-mt-24 space-y-3 border-t border-slate-200 pt-6"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            📘 Så funkar V85
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-2">
              <h3 className="font-semibold text-slate-900 text-base">
                Upplägget
              </h3>
              <p className="text-sm text-slate-600">
                V85 är ett streckspel där du ska hitta vinnaren i åtta lopp.
                Du spelar med minst en häst i varje avdelning – ju fler hästar
                du tar med, desto större chans att överleva omgången, men
                också högre radkostnad.
              </p>
              <p className="text-sm text-slate-600">
                Radpriset är{" "}
                <span className="font-semibold text-slate-900">
                  0,50 kr per rad
                </span>
                . En enkelrad med en häst i varje lopp kostar 0,50 kr. Lägger
                du till fler hästar multipliceras priset snabbt – därför är
                spikar viktiga.
              </p>
              <p className="text-sm text-slate-600">
                Du spelar antingen via{" "}
                <a
                  href="https://www.atg.se"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 hover:text-sky-900 font-medium underline"
                >
                  atg.se
                </a>{" "}
                eller i butik/ombud.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-2">
              <h3 className="font-semibold text-slate-900 text-base">
                Utbetalningar & 30/50/70-nyheten
              </h3>
              <p className="text-sm text-slate-600">
                V85 kan ge utbetalning på 8, 7 och ibland 6 rätt – beroende på
                hur svår omgången blir. ATG kan justera fördelningen mellan
                utdelningsnivåerna beroende på omsättning och svårighetsgrad.
              </p>
              <p className="text-sm text-slate-600">
                En nyhet i systemvärlden är att många andelssystem jobbar med
                principer som{" "}
                <span className="font-semibold text-slate-900">
                  30 / 50 / 70
                </span>
                . Det är ett sätt att tänka kring hur stor del av insatsen som
                ska läggas på favoritbetonade lopp respektive mer chansartade
                avdelningar – för att hitta rätt balans mellan säkerhet och
                potential.
              </p>
              <p className="text-sm text-slate-600">
                Kort sagt: du vill kombinera stabila spikar med smarta
                skrällgarderingar – så att systemet både kan överleva och
                skjuta iväg i värde när det smäller.
              </p>
            </div>
          </div>
        </section>

        {/* GRATIS TIPS & ANALYSER */}
        <section
          id="tips"
          className="scroll-mt-24 space-y-3 border-t border-slate-200 pt-6"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            🧩 Gratis tips & analyser
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <p className="text-sm text-slate-600 mb-3">
              Här är några ställen där du kan läsa mer inför omgången:
            </p>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/251108-lordag-811-tips-till-v85-pa-bergsaker"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    ATG – Omgångens tips
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/vass-eller-kass-v85-lordag"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    Vass eller Kass – V85
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/bjornkollen-v85-lordag"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    Björnkollen – V85
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/251107-stallsnack-v85-bergsaker-multijackpot"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    Stallsnack – Bergsåker
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/V85/tips/korsdragaren-fran-vi-tippa-v85"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    Korsdragaren – Vi Tippa V85
                  </a>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://gratistravtips.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    Gratistravtips.se
                  </a>
                </li>
                <li>
                  <a
                    href="https://travstugan.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    Travstugan
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.aftonbladet.se/sportbladet/trav365/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    Trav365 – Aftonbladet
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.travronden.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    Travronden (premium)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.thomasuhrberg.se/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    Thomas Uhrberg – tips & analyser
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.atg.se/tillsammans/lagsida/teameastman" 
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-medium"
                  >
                    Spela med Omgångskollen (Team Wästman)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SPIK / SKRÄLL / VARNING */}
        <section
          id="nycklar"
          className="scroll-mt-24 space-y-3 border-t border-slate-200 pt-6"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            🎯 Spikar & skrällar
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 sm:p-5 space-y-2">
              <div className="text-xs font-semibold text-emerald-800 uppercase">
                Spik
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {nycklar?.spik?.titel ?? "2 Shogun R.R"}
              </h3>
              <p className="text-sm text-emerald-900">
                {nycklar?.spik?.text ??
                  "Stark spik i ett annars öppet lopp – kan bära systemet."}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 space-y-2">
              <div className="text-xs font-semibold text-amber-800 uppercase">
                Skräll
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {nycklar?.skrall?.titel ?? "12 Funny Guy & 6 Cuelebre"}
              </h3>
              <p className="text-sm text-amber-900">
                {nycklar?.skrall?.text ??
                  "Två roliga streck som kan rensa rejält om favoriten faller."}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 sm:p-5 space-y-2">
              <div className="text-xs font-semibold text-rose-800 uppercase">
                Varning
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {nycklar?.varning?.titel ?? "12 Freeloader"}
              </h3>
              <p className="text-sm text-rose-900">
                {nycklar?.varning?.text ??
                  "Glöms lätt bort, men har både form och kunnande för att vinna."}
              </p>
            </div>
          </div>
        </section>

        {/* VECKANS KUPONG – LÅST INFO, INGEN RAD VISAS */}
        <section
          id="kupong"
          className="scroll-mt-24 space-y-3 border-t border-slate-200 pt-6"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            🧾 Veckans kupong (låst)
          </h2>
          <div className="grid md:grid-cols-[1.3fr,1fr] gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase">
                💡 Veckans kupong är låst
              </div>
              <p className="text-sm text-slate-600">
                Raden visas inte här på sidan. Tipset kostar{" "}
                <span className="font-semibold text-slate-900">19 kr</span> och
                efter att du swishat skickas den manuellt via SMS till numret
                du anger i meddelandet.
              </p>
              <p className="text-sm text-slate-600">
                Kupongen är byggd för cirka{" "}
                <span className="font-semibold text-slate-900">100 kr</span>,
                med en blandning av tryggare spikar och chansartade lopp där vi
                går för bra värde.
              </p>
              <p className="text-xs text-slate-500">
                Spela alltid ansvarsfullt. Se spelet som underhållning – aldrig
                som en genväg till pengar.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 sm:p-5 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Betalning via Swish
              </h3>
              <p className="text-sm text-slate-700">
                Använd QR-koden under{" "}
                <span className="font-semibold">Swish-tipset</span> högst upp
                på sidan. Kom ihåg att alltid skriva ditt{" "}
                <span className="font-semibold">mobilnummer i meddelandet</span>
                , så att raden kan skickas till rätt person.
              </p>
            </div>
          </div>
        </section>

        {/* OM OMGÅNGSKOLLEN */}
        <section
          id="om-omgangskollen"
          className="scroll-mt-24 space-y-3 border-t border-slate-200 pt-6 pb-10"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            ℹ️ Om Omgångskollen
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">
              Allt började redan när jag var en liten kille.
            </p>
            <p>
              Min mamma jobbade i toton på Jägersro, och varje tisdag och under
              de stora tävlingsdagarna fick jag hänga med henne till banan. Jag
              minns ljudet av hovarna mot banan, doften av stall och spänningen
              i luften när loppen drog igång. Där väcktes mitt hästintresse – och
              en fascination för travet som hängt med hela livet.
            </p>
            <p>
              När jag blev äldre började jag själv jobba i toton. Det blev många
              kvällar med både kunder, kollegor och den där speciella stämningen
              som bara finns på en travbana. Jag och min kusin har sedan dess
              följt travet nära, och varje helg är det självklart att vi kikar
              på V85 och diskuterar loppen in i minsta detalj.
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
    </div>
  );
}

export default App;










