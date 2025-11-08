import React, { useEffect, useState } from "react";

const defaultData = {
  omgang: {
    bana: "Bergsåker",
    datum: "Lördag 8 november",
    beskrivning:
      "Bergsåker bjuder på en rolig V85-omgång med 50 miljoner i potten. Medelstor bana, ofta utslagsgivande upplopp och chans till bra betalt om man vågar gå emot favoriterna.",
    jackpott: "Jackpott – 50 miljoner i potten",
  },
  nycklar: {
    spik: {
      titel: "2 Shogun R.R (Avd 6)",
      text: "Stark spikidé i ett överskådligt lopp. Bra läge, hög segerchans och fin form.",
      tone: "green",
    },
    skrall: {
      titel: "12 Funny Guy & 6 Cuelebre (Avd 7)",
      text: "Två roliga skrällbud som kan rensa rejält i kuponghögen om det löser sig med positionerna.",
      tone: "yellow",
    },
    varning: {
      titel: "12 Freeloader (Avd 3)",
      text: "Var försiktig med att lämna denna helt utanför – kapacitet finns för att överraska.",
      tone: "red",
    },
  },
};

const premiumCoupon = [
  { avd: 1, horses: "15" },
  { avd: 2, horses: "4, 1" },
  { avd: 3, horses: "11, 6" },
  { avd: 4, horses: "4, 8, 7, 1" },
  { avd: 5, horses: "6, 9" },
  { avd: 6, horses: "2" },
  { avd: 7, horses: "2, 6, 12" },
  { avd: 8, horses: "4, 10" },
];

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetDate) return;
    function update() {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function CountdownBadge({ datumText }) {
  const nextStart = new Date("2025-11-08T16:20:00+01:00");
  const timeLeft = useCountdown(nextStart);
  if (!timeLeft) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
        <span>✅ Omgången är igång</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 border border-sky-200">
      <span>⏱️ Start {datumText}</span>
      <span className="font-mono">
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </span>
  );
}

function PremiumTipSection({ hasAccess, onConfirmPaid }) {
  return (
    <section
      id="veckans-kupong"
      className="scroll-mt-24 max-w-6xl mx-auto px-4 py-6"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        <div className="rounded-2xl bg-white border border-sky-100 shadow-sm p-5">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                Veckans kupong
              </p>
              <h2 className="text-xl font-bold text-slate-900">
                V85-system för 100 kr
              </h2>
            </div>
            <div className="text-right">
              <div className="inline-flex items-baseline gap-1 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-200">
                <span className="text-xs text-emerald-700 font-medium">
                  Pris tips
                </span>
                <span className="text-sm font-bold text-emerald-800">
                  19 kr
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-3">
            Ett färdigbyggt V85-system för 100 kr som du kan spela direkt hos
            ATG. Betala med Swish så får du kupongen synlig här på sidan.
          </p>

          <ol className="space-y-2 text-sm text-slate-700 mb-4 list-decimal list-inside">
            <li>Swisha 19 kr till nummer nedan och skriv ”V85 tipset” i meddelandet.</li>
            <li>Klicka sedan på knappen ”Jag har swishat, visa kupongen”.</li>
            <li>
              När kupongen visas: mata in samma hästar i ditt{" "}
              <a
                href="https://www.atg.se/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 text-sky-700 hover:text-sky-900"
              >
                ATG-spel
              </a>{" "}
              för 100 kr.
            </li>
          </ol>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="text-sm">
              <p className="font-semibold text-slate-900">Swishnummer</p>
              <p className="font-mono text-lg text-sky-800">0761&nbsp;39&nbsp;01&nbsp;99</p>
              <p className="text-xs text-slate-500 mt-1">
                Belopp: 19 kr • Meddelande: ”V85 tipset”
              </p>
            </div>
            <button
              type="button"
              onClick={onConfirmPaid}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition"
            >
              Jag har swishat, visa kupongen
            </button>
          </div>

          <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
            Informationen på denna sida är inte spelråd utan inspiration. Du är
            alltid själv ansvarig för dina spel. Spela ansvarsfullt.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-900/95 text-slate-50 p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Kupong – V85 Bergsåker</h3>
            <span className="text-xs rounded-full bg-slate-800 px-2 py-1 border border-slate-700">
              100 kr system
            </span>
          </div>

          {!hasAccess && (
            <div className="flex flex-col items-center justify-center text-center py-10 px-3">
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                <span className="text-3xl">🔒</span>
              </div>
              <p className="text-sm font-medium mb-1">
                Kupongen är låst tills betalning är gjord.
              </p>
              <p className="text-xs text-slate-400">
                Swisha först, klicka sedan på knappen ”Jag har swishat, visa
                kupongen” för att låsa upp hästarna.
              </p>
            </div>
          )}

          {hasAccess && (
            <div className="space-y-3">
              <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-sm">
                {premiumCoupon.map((row) => (
                  <React.Fragment key={row.avd}>
                    <div className="text-slate-300 font-mono">Avd {row.avd}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-50">
                        {row.horses}
                      </span>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wide">
                        V85
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Dubbelkolla alltid hästnummer och avdelning innan du lämnar in
                din kupong hos ATG.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NycklarSection({ data }) {
  const nycklar = data?.nycklar ?? defaultData.nycklar;
  const cards = [
    { key: "spik", label: "Spik" },
    { key: "skrall", label: "Skräll" },
    { key: "varning", label: "Varning" },
  ];
  return (
    <section
      id="nycklar"
      className="scroll-mt-24 max-w-6xl mx-auto px-4 py-8 space-y-4"
    >
      <h2 className="text-xl font-bold text-slate-900">Spikar, skrällar & varningar</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((c) => {
          const item = nycklar[c.key];
          if (!item) return null;
          const tone =
            item.tone === "green"
              ? "bg-emerald-50 border-emerald-200"
              : item.tone === "yellow"
              ? "bg-amber-50 border-amber-200"
              : "bg-rose-50 border-rose-200";
          return (
            <div
              key={c.key}
              className={`rounded-2xl p-4 border shadow-sm ${tone}`}
            >
              <div className="text-xs font-mono text-slate-500 uppercase mb-1">
                {c.label}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                {item.titel}
              </h3>
              <p className="text-sm text-slate-800">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FreeLinksSection() {
  return (
    <section
      id="tips"
      className="scroll-mt-24 max-w-6xl mx-auto px-4 py-8 space-y-4"
    >
      <h2 className="text-xl font-bold text-slate-900">Tips & analyser</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">
            ATG – V85-tips
          </h3>
          <ul className="space-y-1 text-sm text-slate-700">
            <li>
              <a
                href="https://www.atg.se/V85/tips"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-900 underline underline-offset-2"
              >
                ATG:s samlade V85-tips
              </a>
            </li>
            <li>
              <a
                href="https://www.atg.se/V85/tips/fem-tippar-v85"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-900 underline underline-offset-2"
              >
                Fem tippar V85
              </a>
            </li>
            <li>
              <a
                href="https://www.atg.se/V85/tips/v85-med-fernlund-lordag"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-900 underline underline-offset-2"
              >
                V85 med Fernlund
              </a>
            </li>
            <li>
              <a
                href="https://www.atg.se/V85/tips/251104-lordag-811-tips-till-v85-pa-bergsaker"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-900 underline underline-offset-2"
              >
                ATG:s tips till Bergsåker-omgången
              </a>
            </li>
            <li>
              <a
                href="https://www.atg.se/V85/tips/korsdragaren-fran-vi-tippa-v85"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-900 underline underline-offset-2"
              >
                Kördragaren från Vi Tippa
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">
            Andra gratisresurser
          </h3>
          <ul className="space-y-1 text-sm text-slate-700">
            <li>
              <a
                href="https://travstugan.se/v85"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-900 underline underline-offset-2"
              >
                Travstugan – analyser & system
              </a>
            </li>
            <li>
              <a
                href="https://www.aftonbladet.se/sportbladet/trav365/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-900 underline underline-offset-2"
              >
                Trav365 (Aftonbladet)
              </a>
            </li>
            <li>
              <a
                href="https://www.travronden.se/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 hover:text-sky-900 underline underline-offset-2"
              >
                Travronden (premium)
              </a>
            </li>
          </ul>

          <div className="mt-4 rounded-xl bg-sky-50 border border-sky-100 px-3 py-2 text-xs text-sky-900">
            Tipset: kombinera egna idéer med flera källor, så bygger du ett
            starkare system än om du bara följer en skribent.
          </div>
        </div>
      </div>
    </section>
  );
}

function V85GuideSection() {
  return (
    <section
      id="v85-guide"
      className="scroll-mt-24 max-w-6xl mx-auto px-4 py-8 space-y-4"
    >
      <h2 className="text-xl font-bold text-slate-900">Så fungerar V85</h2>
      <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Grunderna i spelet
          </h3>
          <p>
            V85 är ett streckspel där du ska hitta vinnaren i åtta
            travlopp. Varje häst du streckar är en rad, och insatsen är
            oftast 1 krona per rad. Ju fler hästar du tar med i varje avdelning,
            desto dyrare blir systemet – men också större chans att du överlever
            omgången.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Vinstnivåer: 8 rätt, 7 rätt och 6 rätt.</li>
            <li>Du spelar via ATG – antingen ensam eller i andelssystem.</li>
            <li>Omgångarna körs på svenska travbanor med olika karaktär.</li>
          </ul>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Spikar, garderingar och systemtänk
          </h3>
          <p>
            Nyckeln i V85 är balansen mellan starka spikar och modiga
            skrällgarderingar. Spiken låser systemet, skrällen skapar värde.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Spik: du går fullt ut på en häst i en avdelning.
            </li>
            <li>
              Gardera: du tar med flera hästar, ofta där du tycker loppet känns
              öppet.
            </li>
            <li>
              Bygg systemet utifrån hur du tror loppet körs, inte bara efter
              streckprocenten.
            </li>
          </ul>
          <p>
            Omgångskollen samlar nycklar, länkar och idéer – sedan bestämmer du
            själv hur offensiv eller defensiv du vill vara.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [hasAccessToCoupon, setHasAccessToCoupon] = useState(false);

  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, []);

  const omgang = data?.omgang ?? defaultData.omgang;

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-sky-100">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2">
            <img
              src="./omgangskollen-dark.png"
              alt="Omgångskollen"
              className="h-7 w-auto"
            />
            <span className="font-semibold tracking-tight text-slate-900">
              Omgångskollen
            </span>
          </a>
          <ul className="hidden sm:flex gap-4 text-xs font-medium text-slate-600">
            <li>
              <a href="#omgang" className="hover:text-slate-900">
                🏁 Omgång
              </a>
            </li>
            <li>
              <a href="#veckans-kupong" className="hover:text-slate-900">
                🎟️ Veckans kupong
              </a>
            </li>
            <li>
              <a href="#nycklar" className="hover:text-slate-900">
                🎯 Spikar
              </a>
            </li>
            <li>
              <a href="#tips" className="hover:text-slate-900">
                🧩 Tips
              </a>
            </li>
            <li>
              <a href="#v85-guide" className="hover:text-slate-900">
                📘 V85-guide
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section
          id="hero"
          className="scroll-mt-24 max-w-6xl mx-auto px-4 py-8 text-center"
        >
          <img
            src="./omgangskollen-dark.png"
            alt="Omgångskollen"
            className="h-24 mx-auto mb-3"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Omgångskollen – V85 Bergsåker
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Samlar allt du behöver inför veckans V85: omgångsinfo, nycklar,
            länkar, veckans kupong och en enkel väg vidare till ditt ATG-spel.
          </p>
          <div className="mt-4 flex flex-col items-center gap-2">
            <CountdownBadge datumText={omgang.datum} />
            <p className="text-xs text-slate-500">
              Spela ansvarsfullt. 18+ • Stödlinjen 020-81&nbsp;91&nbsp;00
            </p>
          </div>
        </section>

        <PremiumTipSection
          hasAccess={hasAccessToCoupon}
          onConfirmPaid={() => setHasAccessToCoupon(true)}
        />

        <section
          id="omgang"
          className="scroll-mt-24 max-w-6xl mx-auto px-4 space-y-4 pb-4"
        >
          <h2 className="text-xl font-bold text-slate-900">Veckans omgång</h2>
          <div className="grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-4 items-start">
            <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
              <p className="text-sm">
                <strong>{omgang.bana}</strong> – {omgang.datum}
              </p>
              {omgang.jackpott && (
                <p className="mt-1 text-xs font-semibold text-emerald-700">
                  💰 {omgang.jackpott}
                </p>
              )}
              <p className="text-sm text-slate-700 mt-2">{omgang.beskrivning}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <a
                  href="https://www.atg.se/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-sky-600 text-white px-3 py-1 font-medium hover:bg-sky-700"
                >
                  Spela V85 hos ATG
                </a>
                <a
                  href="https://assets.ctfassets.net/hkip2osr81id/39uvrIW4wvyccGJij4j7X7/e48d16ad41ce42b912807ef8195f21db/251108_BERGSAKER_GP_V85_1.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-white text-sky-700 px-3 py-1 font-medium border border-sky-200 hover:bg-sky-50"
                >
                  📄 Gratis program (PDF)
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm text-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Bergsåker – snabbfakta
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Medelstor bana med ofta utslagsgivande upplopp.</li>
                  <li>Ofta krävande vinterförhållanden – se upp med balans.</li>
                  <li>Skrällvänlig bana när tempo och positioner låser sig.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-xs text-sky-900">
                Ett bra sätt att börja bygga systemet är att utgå från dina
                egna idéer i några lopp, komplettera med tipslänkarna nedan och
                sedan bestämma hur hårt du vill gå på favoritduo respektive
                skrällar.
              </div>
            </div>
          </div>
        </section>

        <NycklarSection data={data} />

        <FreeLinksSection />

        <V85GuideSection />
      </main>

      <footer className="border-t border-slate-200 text-center py-6 text-xs text-slate-500 mt-8">
        Omgångskollen • Ett hobbyprojekt för travälskare. Spela ansvarsfullt.
      </footer>
    </div>
  );
}


