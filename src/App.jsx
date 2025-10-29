import React, { useState, useEffect } from "react";

export default function App() {
  // state där vi lagrar data.json-innehållet
  const [data, setData] = useState(null);
  const [loadingRound, setLoadingRound] = useState(false);

  // hämta data.json vid sidstart
  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        console.error("Kunde inte ladda data.json:", err);
      });
  }, []);

  // Om data inte hunnit laddas ännu.
  if (!data) {
    return (
      <div className="min-h-screen bg-white text-gray-900 antialiased flex items-center justify-center">
        <div className="text-center text-sm text-gray-600">
          Laddar omgång...
        </div>
      </div>
    );
  }

  // plocka ut delar ur data.json så koden blir snyggare
  const { omgang, snabbfakta, nycklar, formbarometer, stallSnack, bana } = data;

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-200 via-green-50 to-white opacity-80 pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0">
                <img
                  src="omgangskollen-dark.png?v=brand"
                  alt="Omgångskollen"
                  className="h-20 w-20 rounded-2xl border-2 border-green-600 object-contain bg-white shadow-md"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Omgångskollen
                </span>
                <span className="text-base text-gray-700 leading-tight">
                  Allt inför veckans travomgång
                </span>

                <div className="mt-3 text-xs text-gray-700 bg-white/70 border border-green-600/30 rounded-lg px-3 py-2 shadow-sm flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <div className="font-semibold text-gray-900">
                    {omgang.bana}
                  </div>
                  <div className="text-gray-600">{omgang.datum}</div>
                  <div className="text-gray-600">
                    Spelstopp {omgang.spelstopp}
                  </div>
                  <div className="text-green-700 font-semibold">
                    {omgang.jackpot} 💰
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-0 flex flex-col items-end gap-4">
              <nav className="flex flex-wrap justify-end gap-4 text-sm font-medium text-gray-700">
                <a href="#omgangen" className="hover:text-green-700 transition">
                  🏇 Omgång
                </a>
                <a href="#nycklar" className="hover:text-green-700 transition">
                  🧠 Spik/Skräll
                </a>
                <a href="#lankar" className="hover:text-green-700 transition">
                  🔗 Tips
                </a>
                <a href="#fakta" className="hover:text-green-700 transition">
                  📘 Fakta
                </a>
                <a href="#form" className="hover:text-green-700 transition">
                  📈 Form
                </a>
                <a href="#stall" className="hover:text-green-700 transition">
                  🎙️ Stall
                </a>
                <a href="#lage" className="hover:text-green-700 transition">
                  🌦️ Bana
                </a>
                <a href="#live" className="hover:text-green-700 transition">
                  📺 Live
                </a>
              </nav>

              <a
                href="https://www.atg.se/v85"
                className="inline-flex items-center rounded-lg bg-green-600 text-white font-semibold text-xs px-3 py-2 shadow hover:bg-green-500 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spela V85 på ATG →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-col">

        {/* SEKTION 1: FUNKTIONSTEST + OMGÅNG */}
        <section className="bg-white scroll-mt-32">
          <div className="mx-auto max-w-7xl px-4 py-12 flex flex-col gap-12">
            {/* test-knappen */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm max-w-md">
              <div className="text-xs text-gray-500 font-mono uppercase tracking-wide mb-2">
                🔍 Funktionstest
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Tryck på knappen för att se att React är igång:
              </p>
              <TestButton
                loadingRound={loadingRound}
                setLoadingRound={setLoadingRound}
              />
            </div>

            <section
              id="omgangen"
              className="grid gap-8 lg:grid-cols-[1fr,360px] lg:items-start scroll-mt-32"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-xs text-gray-500 font-mono uppercase tracking-wide mb-2 flex items-center gap-2">
                  <span>🏇 Aktuell omgång</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 border border-green-300 px-2 py-0.5 text-[10px] font-semibold leading-none">
                    Jackpot
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight">
                  V85 {omgang.bana} – {omgang.datum}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                  <span className="bg-gray-100 border border-gray-300 text-gray-800 rounded-md px-2 py-1 text-xs font-medium">
                    Spelstopp {omgang.spelstopp}
                  </span>
                  <span className="text-green-600 font-semibold">
                    {omgang.jackpot}
                  </span>
                </div>

                <p className="mt-6 text-gray-700 leading-relaxed text-base max-w-xl">
                  {omgang.beskrivning}
                </p>
              </div>

              <aside className="space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
                  <div className="text-xs text-gray-500 uppercase font-mono tracking-wide mb-2">
                    Snabbfakta V85
                  </div>
                  <dl className="text-sm text-gray-800 space-y-2">
                    <Row label="Antal lopp" value={snabbfakta.antalLopp} />
                    <Row label="Radpris" value={snabbfakta.radpris} />
                    <Row label="Utdelning" value={snabbfakta.utdelning} />
                    <Row label="Spelstopp" value={snabbfakta.spelstopp} />
                    <Row
                      label="Återbetalning"
                      value={snabbfakta.aterbetalning}
                    />
                  </dl>
                </div>
              </aside>
            </section>
          </div>
        </section>

        {/* SEKTION 2: SPIK / SKRÄLL / VARNINGAR */}
        <section
          className="bg-gray-50 border-y border-gray-200 scroll-mt-32"
          id="nycklar"
        >
          <div className="mx-auto max-w-7xl px-4 py-12 space-y-6">
            <header className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>🧠 Spik / Skräll / Varningar</span>
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl">
                Snabbt bordssnack innan du bygger kupongen. Dessa är
                sammanfattningar – läs alltid källan innan du spikar tungt.
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <HighlightCard
                badge="Spik-idé"
                title={nycklar.spik.titel}
                desc={nycklar.spik.text}
                tone={nycklar.spik.tone}
              />
              <HighlightCard
                badge="Skrällvarning"
                title={nycklar.skrall.titel}
                desc={nycklar.skrall.text}
                tone={nycklar.skrall.tone}
              />
              <HighlightCard
                badge="Varning på favorit"
                title={nycklar.varning.titel}
                desc={nycklar.varning.text}
                tone={nycklar.varning.tone}
              />
            </div>
          </div>
        </section>

        {/* SEKTION 3: TIPS & LÄNKAR */}
        <section className="bg-white scroll-mt-32" id="lankar">
          <div className="mx-auto max-w-7xl px-4 py-12 space-y-10">
            <header className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>🔗 Tips & länkar</span>
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl">
                Startlistor, rank, systemförslag och andelar. Allt gratis.
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <LinkCard
                title="ATG V85"
                desc="Officiella startlistor, streckfördelning och speltyper."
                href="https://www.atg.se/v85"
              />
              <LinkCard
                title="Travstugan"
                desc="Gratis system och andelar inför V85."
                href="https://travstugan.se/v85"
              />
              <LinkCard
                title="Rekatochklart"
                desc="Rank och värdehästar inför omgången."
                href="https://www.rekatochklart.com/trav/v85-tips/"
              />
              <LinkCard
                title="Trav365"
                desc="Spikar, skrällar och kuskintervjuer."
                href="https://www.aftonbladet.se/sportbladet/trav365/"
              />
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🎥 Gratis analyser & experter</span>
              </h3>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <LinkCard
                  title="🎥 Björnkollen – Björn Goop"
                  desc="Björn Goops genomgång av veckans V85-omgång, direkt från stallet."
                  href="https://www.atg.se/play/video/2367948869449/2025-10-23_bjornkollenv85lordagjagersro"
                />
                <LinkCard
                  title="🎙️ Vass eller Kass"
                  desc="ATG-experternas video: vilka favoriter är spelbara och vilka är överspelade?"
                  href="https://www.atg.se/V85/tips/vass-eller-kass-v85-lordag"
                />
                <LinkCard
                  title="📊 Rekatochklart"
                  desc="Gratis analyser, rank och värdebedömning inför V85."
                  href="https://www.rekatochklart.com/trav/v85-tips/"
                />
                <LinkCard
                  title="📝 Travstugan"
                  desc="System, andelar och expertkommentarer inför V85."
                  href="https://travstugan.se/v85"
                />
                <LinkCard
                  title="💡 GratisTravtips.se"
                  desc="Ranking, statistik och systemförslag – helt gratis."
                  href="https://www.gratistravtips.se/v85"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEKTION 4: SÅ FUNKAR V85 */}
        <section
          className="bg-gray-50 border-y border-gray-200 scroll-mt-32"
          id="fakta"
        >
          <div className="mx-auto max-w-7xl px-4 py-12 space-y-6">
            <header className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>📘 Så funkar V85</span>
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl">
                Ny spelform med åtta lopp, fler vinstchanser och möjlighet att
                sänka din insats men ändå vara med och tävla om hela potten.
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FactCard
                title="Radpris"
                text="0,50 kr per rad som standard."
              />
              <FactCard
                title="Utdelning"
                text="Vinster delas ut på 8, 7, 6 och 5 rätt. Alltså fler sätt att få betalt."
              />
              <FactCard
                title="Jackpot"
                text="Om ingen får alla rätt – eller om en vinstnivå hamnar under 5 kr – kan pengarna gå vidare som jackpot."
              />
              <FactCard
                title="Sänkt insats (30% / 50% / 70%)"
                text="Du kan välja lägre insats på ett matematiskt system med upp till 2 000 rader. Du betalar mindre – och din utdelning blir samma procent av ordinarie utdelning. Exempel: om ordinarie utdelning är 1 000 000 kr och du spelat 50%, då får du 500 000 kr."
              />
              <FactCard
                title="Spelstopp"
                text={`Lördagar kring ${omgang.spelstopp}. Efter spelstopp är kupongen låst.`}
              />
              <FactCard
                title="Antal lopp"
                text="Det är 8 avdelningar istället för 7 som i V75. Du måste hitta vinnaren i varje avdelning."
              />
            </div>

            <div className="rounded-lg border border-gray-300 bg-white shadow-sm p-4 text-[11px] text-gray-600 leading-relaxed max-w-2xl">
              Spela ansvarsfullt. Sätt en budget innan du spelar. 18+.
              Stödlinjen: 020-81 91 00.
            </div>
          </div>
        </section>

        {/* SEKTION 5: FORMBAROMETER */}
        <section className="bg-white scroll-mt-32" id="form">
          <div className="mx-auto max-w-7xl px-4 py-12 space-y-6">
            <header className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>📈 Formbarometer</span>
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl">
                Hetaste hästarna inför omgången. Formraden = senaste tre lopp.
                Lågt streck + bra form = spelvärde.
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formbarometer.map((horse, idx) => (
                <FormCard
                  key={idx}
                  name={horse.name}
                  avd={horse.avd}
                  form={horse.form}
                  streck={horse.streck}
                  signal={horse.signal}
                  color={horse.color}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SEKTION 6: STALL / KUSKSNACK */}
        <section
          className="bg-gray-50 border-y border-gray-200 scroll-mt-32"
          id="stall"
        >
          <div className="mx-auto max-w-7xl px-4 py-12 space-y-6">
            <header className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>🎙️ Stall / kusksnack</span>
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl">
                Signal om läget: toppad för seger, eller mest ett genomkörare?
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stallSnack.map((item, idx) => (
                <StallCard
                  key={idx}
                  name={item.name}
                  avd={item.avd}
                  quote={item.quote}
                  signal={item.signal}
                  color={item.color}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SEKTION 7: BANFÖRUTSÄTTNINGAR */}
        <section className="bg-white scroll-mt-32" id="lage">
          <div className="mx-auto max-w-7xl px-4 py-12 space-y-6">
            <header className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>🌦️ Banförutsättningar & värdeläge</span>
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl">
                Underlag, tempo och jackpotläge påverkar hur du ska spela.
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FactCard
                title="Bana / Underlag"
                text={bana.underlag}
              />
              <FactCard
                title="Spelvärde"
                text={bana.spelvarde}
              />
              <FactCard
                title="Snabbcheck"
                text={bana.snabbcheck}
              />
            </div>
          </div>
        </section>

        {/* SEKTION 8: LIVE */}
        <section
          className="bg-gray-50 border-y border-gray-200 scroll-mt-32"
          id="live"
        >
          <div className="mx-auto max-w-7xl px-4 py-12 space-y-6">
            <header className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>📺 Följ omgången live</span>
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl">
                Värmningar, strykningar, balansändringar och chockskrällar.
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <LinkCard
                title="ATG Live"
                desc="Liverace och intervjuer direkt från banan."
                href="https://www.atg.se/play"
              />
              <LinkCard
                title="Travstugan Live"
                desc="Uppdateringar om spikar och skrällar under eftermiddagen."
                href="https://travstugan.se/v85"
              />
              <LinkCard
                title="Trav365 Live"
                desc="Minut-för-minut och citat från stall och kuskar."
                href="https://www.aftonbladet.se/sportbladet/trav365/"
              />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white text-xs text-gray-500 leading-relaxed">
          <div className="mx-auto max-w-7xl px-4 py-12 border-t border-gray-200 flex flex-col gap-6 sm:flex-row sm:justify-between">
            <div className="max-w-sm">
              <div className="font-semibold text-gray-900">
                Omgångskollen
              </div>
              <div className="text-gray-500">
                Ett samlat läge för travspelare. Alla tips och källor på ett
                ställe.
              </div>
              <div className="mt-3 text-[10px] text-gray-400">
                Nu även på omgångskollen.se
              </div>
            </div>

            <div className="max-w-md text-[11px] text-gray-500">
              Omgångskollen äger inte eller driver inte ATG® eller deras
              produkter. All extern analys, rank och spelinformation tillhör
              respektive källa (ATG, Travstugan, Rekatochklart, Trav365,
              Björnkollen m.fl.). Spela ansvarsfullt. 18+ Stödlinjen:
              020-81 91 00.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* --------- små komponenter --------- */

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}

function TestButton({ loadingRound, setLoadingRound }) {
  return (
    <button
      className="rounded-lg bg-green-600 text-white font-semibold text-sm px-4 py-2 hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loadingRound}
      onClick={() => {
        setLoadingRound(true);
        setTimeout(() => {
          setLoadingRound(false);
          alert("Ny omgång laddas… (demo)");
        }, 800);
      }}
    >
      {loadingRound ? "Jobbar..." : "Ladda nästa omgång"}
    </button>
  );
}

function HighlightCard({ badge, title, desc, tone }) {
  const toneMap = {
    green: "text-green-700 bg-green-50 border-green-300",
    yellow: "text-yellow-700 bg-yellow-50 border-yellow-300",
    red: "text-red-700 bg-red-50 border-red-300",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 flex flex-col hover:shadow-md hover:border-green-400 transition">
      <span
        className={`inline-flex w-fit items-center rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide border ${toneMap[tone]}`}
      >
        {badge}
      </span>
      <div className="mt-3 text-lg font-semibold text-gray-900">{title}</div>
      <p className="mt-2 text-sm text-gray-700 flex-1">{desc}</p>
    </div>
  );
}

function LinkCard({ title, desc, href }) {
  return (
    <a
      className="group rounded-xl border border-gray-200 bg-white shadow-sm p-5 flex flex-col hover:shadow-md hover:border-green-400 transition"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="text-base font-semibold text-gray-900 group-hover:text-green-700 transition">
        {title}
      </div>
      <p className="mt-2 text-sm text-gray-700 flex-1">{desc}</p>
      <div className="mt-4 inline-flex items-center text-xs font-semibold text-gray-800 group-hover:text-green-700 transition">
        Gå till sida →
      </div>
    </a>
  );
}

function FactCard({ title, text }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 flex flex-col hover:shadow-md hover:border-green-400 transition">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <p className="mt-2 text-sm text-gray-700 leading-relaxed flex-1">
        {text}
      </p>
    </div>
  );
}

function FormCard({ name, avd, form, streck, signal, color }) {
  const colorMap = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 flex flex-col hover:shadow-md hover:border-green-400 transition">
      <div className="text-sm font-semibold text-gray-900">{name}</div>
      <div className="text-xs text-gray-500">Avd {avd}</div>

      <dl className="mt-3 text-sm text-gray-700 space-y-1">
        <div className="flex justify-between">
          <dt className="text-gray-500">Form</dt>
          <dd className="font-medium text-gray-900">{form}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Streck</dt>
          <dd className="font-medium text-gray-900">{streck}</dd>
        </div>
      </dl>

      <div
        className={`mt-4 text-[10px] font-semibold uppercase tracking-wide ${colorMap[color]}`}
      >
        {signal}
      </div>
    </div>
  );
}

function StallCard({ name, avd, quote, signal, color }) {
  const colorMap = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 flex flex-col hover:shadow-md hover:border-green-400 transition">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-semibold text-gray-900">{name}</div>
        <div className="text-[10px] text-gray-500">Avd {avd}</div>
      </div>

      <p className="mt-3 text-sm text-gray-700 flex-1">"{quote}"</p>

      <div
        className={`mt-4 text-[10px] font-semibold uppercase tracking-wide ${colorMap[color]}`}
      >
        Signal: {signal}
      </div>
    </div>
  );
}

