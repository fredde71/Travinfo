import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoadingStatus(false);
      })
      .catch(() => {
        setLoadingStatus(false);
      });
  }, []);

  const bana = data?.omgang?.bana || "Bergsåker";
  const datum = data?.omgang?.datum || "Lördag 8 november";
  const jackpott = data?.omgang?.jackpott || "Jackpott ca 50 miljoner";
  const beskrivning =
    data?.omgang?.beskrivning ||
    "Klassisk vinterbana där styrka och spurtförmåga ofta avgör. Upploppet är medellångt och vädret kan snabbt spela in – perfekt för skrällar.";

  const statusLabel = data?.status?.label || "Ej uppdaterat";
  const statusText =
    data?.status?.text ||
    "Väntar på analys och uppdaterade tips för veckans omgång.";
  const updatedAt = data?.status?.updatedAt || "";

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900">
      <Header statusLabel={statusLabel} />
      <main className="pb-16">
        <Hero bana={bana} datum={datum} jackpott={jackpott} />
        <PremiumTipSection />
        <OmgangSection
          bana={bana}
          datum={datum}
          jackpott={jackpott}
          beskrivning={beskrivning}
          statusLabel={statusLabel}
          statusText={statusText}
          updatedAt={updatedAt}
          loading={loadingStatus}
        />
        <KeyTips />
        <FreeLinksSection />
        <V85GuideSection />
        <SwishInfoSection />
      </main>
      <Footer />
    </div>
  );
}

function Header({ statusLabel }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-sky-100">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2">
          <img
            src="./omgangskollen-dark.png"
            alt="Omgångskollen"
            className="h-7 w-auto"
          />
          <span className="font-semibold tracking-tight text-slate-900">
            Omgångskollen
          </span>
        </a>
        <ul className="hidden md:flex items-center gap-5 text-sm text-slate-600">
          <li>
            <a href="#omgang" className="hover:text-sky-700">
              🏁 Omgång
            </a>
          </li>
          <li>
            <a href="#veckans-kupong" className="hover:text-sky-700">
              💰 Veckans kupong
            </a>
          </li>
          <li>
            <a href="#nycklar" className="hover:text-sky-700">
              🎯 Spik & skräll
            </a>
          </li>
          <li>
            <a href="#tips" className="hover:text-sky-700">
              🧩 Tips
            </a>
          </li>
          <li>
            <a href="#v85-guide" className="hover:text-sky-700">
              📘 V85-guide
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sky-100 text-sky-800 text-[11px] px-3 py-1 font-medium">
            {statusLabel}
          </span>
        </div>
      </nav>
    </header>
  );
}

function Hero({ bana, datum, jackpott }) {
  return (
    <section id="top" className="max-w-6xl mx-auto px-4 pt-6 pb-4">
      <div className="grid md:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)] gap-6 items-center">
        <div>
          <p className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
            Nästa omgång · V85
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight text-slate-900">
            Omgångskollen – allt inför {bana}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Snabb överblick, spikar, skrällar, gratislänkar och{" "}
            <span className="font-semibold">veckans kupong</span> samlat på ett
            ställe.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <div className="rounded-xl bg-white border border-sky-100 px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-500">Bana & datum</p>
              <p className="font-semibold text-slate-900">{bana}</p>
              <p className="text-xs text-slate-600">{datum}</p>
            </div>
            <div className="rounded-xl bg-indigo-600 text-indigo-50 px-4 py-3 shadow-sm">
              <p className="text-xs text-indigo-100">Jackpott</p>
              <p className="font-semibold">{jackpott}</p>
              <p className="text-[11px] text-indigo-100 mt-1">
                Håll koll på strecken – jackpottomgångar ger ofta hög utdelning.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 text-slate-50 p-5 shadow-md">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Snabbstatus
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>Omgång</span>
              <span className="font-medium">V85 · {bana}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Spelstopp</span>
              <span className="font-medium">Lördag ca 16:20</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Veckans kupong</span>
              <span className="font-medium text-emerald-300">Från 19 kr</span>
            </li>
          </ul>
          <a
            href="#veckans-kupong"
            className="mt-4 inline-flex justify-center items-center w-full rounded-xl bg-emerald-400 text-emerald-950 text-sm font-semibold py-2.5 hover:bg-emerald-300 transition"
          >
            Se veckans kupong
          </a>
        </div>
      </div>
    </section>
  );
}

function PremiumTipSection() {
  return (
    <section
      id="veckans-kupong"
      className="max-w-6xl mx-auto px-4 mt-8 scroll-mt-24"
    >
      <div className="grid md:grid-cols-[minmax(0,2fr),minmax(0,1.3fr)] gap-5 items-stretch">
        <div className="rounded-2xl bg-white shadow-sm border border-sky-100 p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-700">
            <span className="inline-flex h-6 items-center rounded-full bg-amber-50 px-3">
              💰 Veckans kupong – 100 kr
            </span>
            <span className="text-amber-600">Intropris 19 kr</span>
          </div>
          <h2 className="mt-3 text-xl font-bold text-slate-900">
            Köp systemförslag från Omgångskollen
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Ett färdigbyggt V85-system anpassat för lördagens omgång. Swisha 19
            kr så skickar vi systemet som PDF – redo att läggas in på ATG.
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-sky-50 px-3 py-2">
              <dt className="text-sky-700 font-medium">Spelstorlek</dt>
              <dd className="text-slate-700 mt-1">
                Ca 100 kr (192 rader × 0,50 kr)
              </dd>
            </div>
            <div className="rounded-lg bg-sky-50 px-3 py-2">
              <dt className="text-sky-700 font-medium">Profil</dt>
              <dd className="text-slate-700 mt-1">
                2 spikar, offensiv skrällprofil
              </dd>
            </div>
          </dl>

          <div className="mt-4 rounded-xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-3 text-sm">
            <p className="font-semibold text-emerald-800">Så gör du</p>
            <ol className="mt-1 list-decimal pl-4 space-y-1 text-emerald-900">
              <li>
                Swisha 19 kr till{" "}
                <span className="font-semibold">123 000 00 00</span>.
              </li>
              <li>Skriv din e-post eller mobilnummer i meddelandet.</li>
              <li>Du får systemet som PDF så snart kupongen är klar.</li>
            </ol>
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            Swishnumret ovan är ett exempel – byt till ditt riktiga nummer när
            du är redo att börja ta betalt.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 text-slate-50 p-5 flex flex-col justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Systemskiss (dold)
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Förhandsvy av hur systemet är uppbyggt. Själva hästarna visas
              suddigt.
            </p>
            <div className="mt-3 rounded-xl bg-slate-800 px-4 py-3 text-[11px] leading-relaxed font-mono">
              <p className="blur-sm hover:blur-none transition duration-300 cursor-help whitespace-pre-wrap">
                Avd 1: 15
                {"\n"}
                Avd 2: 4, 1
                {"\n"}
                Avd 3: 11, 6
                {"\n"}
                Avd 4: 4, 8, 7, 1
                {"\n"}
                Avd 5: 6, 9
                {"\n"}
                Avd 6: 2
                {"\n"}
                Avd 7: 2, 6, 12
                {"\n"}
                Avd 8: 4, 10
              </p>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-slate-400">
            Radfördelning ger 192 rader. Tänk på att inget spel är säkert –
            spela alltid ansvarsfullt.
          </p>
        </div>
      </div>
    </section>
  );
}

function OmgangSection({
  bana,
  datum,
  jackpott,
  beskrivning,
  statusLabel,
  statusText,
  updatedAt,
  loading,
}) {
  return (
    <section
      id="omgang"
      className="max-w-6xl mx-auto px-4 mt-10 scroll-mt-24"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">🏁 Veckans omgång</h2>
        <div className="text-right">
          <p className="text-xs font-medium text-slate-500">{statusLabel}</p>
          <p className="text-[11px] text-slate-400">
            {loading ? "Laddar status..." : updatedAt}
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-white shadow-sm border border-sky-100 p-5 space-y-3">
        <p className="text-sm">
          <span className="font-semibold">{bana}</span> – {datum}
        </p>
        <p className="text-sm text-sky-800 font-medium">{jackpott}</p>
        <p className="text-sm text-slate-700">{beskrivning}</p>
        <p className="text-xs text-slate-500 mt-1">{statusText}</p>
      </div>
    </section>
  );
}

function KeyTips() {
  return (
    <section
      id="nycklar"
      className="max-w-6xl mx-auto px-4 mt-10 scroll-mt-24"
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        🎯 Spikar, Skrällar & Varningar
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <h3 className="font-semibold text-green-700">Spik</h3>
          <p className="text-slate-700 text-sm mt-1">2 Shogun R.R</p>
        </div>

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="font-semibold text-yellow-700">Skräll</h3>
          <p className="text-slate-700 text-sm mt-1">
            12 Funny Guy, 6 Cuelebre
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h3 className="font-semibold text-red-700">Varning</h3>
          <p className="text-slate-700 text-sm mt-1">12 Freeloader</p>
        </div>
      </div>
    </section>
  );
}

function FreeLinksSection() {
  return (
    <section
      id="tips"
      className="max-w-6xl mx-auto px-4 mt-10 scroll-mt-24"
    >
      <h2 className="text-2xl font-bold text-slate-900">
        🧩 Gratis tips & analyser
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Samlade länkar till gratistips inför veckans V85. Öppnas i ny flik.
      </p>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <a
          href="https://www.atg.se/V85/tips/fem-tippar-v85"
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl bg-white border border-sky-100 p-4 shadow-sm hover:border-sky-300 hover:-translate-y-0.5 transition"
        >
          <p className="text-xs font-medium text-sky-700">ATG</p>
          <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-sky-800">
            Fem tippar V85
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Flera experter lämnar sina idéer – perfekt för att jämföra spikar
            och drag.
          </p>
        </a>

        <a
          href="https://www.atg.se/V85/tips/v85-med-fernlund-lordag"
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl bg-white border border-sky-100 p-4 shadow-sm hover:border-sky-300 hover:-translate-y-0.5 transition"
        >
          <p className="text-xs font-medium text-sky-700">ATG</p>
          <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-sky-800">
            V85 med Fernlund
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Genomgång av omgången med vassa idéer och tidiga drag.
          </p>
        </a>

        <a
          href="https://www.atg.se/V85/tips/251104-lordag-811-tips-till-v85-pa-bergsaker"
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl bg-white border border-sky-100 p-4 shadow-sm hover:border-sky-300 hover:-translate-y-0.5 transition"
        >
          <p className="text-xs font-medium text-sky-700">ATG</p>
          <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-sky-800">
            ATG-expertens tips till Bergsåker
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Officiella tips till just den här omgången.
          </p>
        </a>

        <a
          href="https://www.atg.se/V85/tips/korsdragaren-fran-vi-tippa-v85"
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl bg-white border border-sky-100 p-4 shadow-sm hover:border-sky-300 hover:-translate-y-0.5 transition"
        >
          <p className="text-xs font-medium text-sky-700">ATG / Vi Tippa</p>
          <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-sky-800">
            Kördragaren från Vi Tippa
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Extra skrällidéer från Vi Tippa – perfekt komplement till dina egna
            tankar.
          </p>
        </a>

        <a
          href="https://travstugan.se/v85"
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl bg-white border border-sky-100 p-4 shadow-sm hover:border-sky-300 hover:-translate-y-0.5 transition"
        >
          <p className="text-xs font-medium text-emerald-700">Travstugan</p>
          <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-emerald-800">
            Travstugan – analyser & system
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Många olika spelläggare, både gratisanalyser och andelsspel.
          </p>
        </a>

        <a
          href="https://www.aftonbladet.se/sportbladet/trav365/"
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl bg-white border border-sky-100 p-4 shadow-sm hover:border-sky-300 hover:-translate-y-0.5 transition"
        >
          <p className="text-xs font-medium text-rose-700">Trav365</p>
          <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-rose-800">
            Trav365 – nyheter & tips
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Travnyheter, intervjuer och spelidéer inför omgången.
          </p>
        </a>

        <a
          href="https://www.travronden.se/"
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl bg-white border border-amber-100 p-4 shadow-sm hover:border-amber-300 hover:-translate-y-0.5 transition"
        >
          <p className="text-xs font-medium text-amber-700">
            Travronden (premium)
          </p>
          <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-amber-800">
            Travronden – djupanalys
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            För dig som vill grotta ner dig i intervjuer, ranking och lopparkiv.
          </p>
        </a>

        <a
          href="https://thomasuhrberg.se/"
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl bg-white border border-sky-100 p-4 shadow-sm hover:border-sky-300 hover:-translate-y-0.5 transition"
        >
          <p className="text-xs font-medium text-sky-700">Thomas Uhrberg</p>
          <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-sky-800">
            Uhrbergs travanalyser
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Spelidéer och tankar från en av Sveriges mest rutinerade kuskar.
          </p>
        </a>

        <a
          href="https://www.atg.se/"
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl bg-sky-900 border border-sky-700 p-4 shadow-sm hover:-translate-y-0.5 transition"
        >
          <p className="text-xs font-medium text-sky-200">ATG Tillsammans</p>
          <h3 className="mt-1 font-semibold text-white">
            Spela med Omgångskollen (Team Wästman)
          </h3>
          <p className="mt-1 text-sm text-sky-100">
            Gemensamt spel via ATG Tillsammans. Byt länk till ditt riktiga lag
            när allt är klart.
          </p>
        </a>
      </div>
    </section>
  );
}

function V85GuideSection() {
  return (
    <section
      id="v85-guide"
      className="max-w-6xl mx-auto px-4 mt-12 mb-12 scroll-mt-24"
    >
      <div className="rounded-2xl bg-white shadow-sm border border-sky-100 p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📘</span>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Så funkar V85</h2>
            <p className="text-sm text-slate-600">
              En snabbguide för dig som vill ha koll innan du lämnar in
              kupongen.
            </p>
          </div>
        </div>
        <div className="mt-5 grid md:grid-cols-3 gap-5 text-sm text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900">🎯 Målet med spelet</h3>
            <p className="mt-1">
              På V85 går det ut på att hitta vinnaren i åtta travlopp. Du spelar
              på en kupong med flera hästar i varje avdelning och får utdelning
              på 8, 7 och ibland 6 rätt.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">🧮 Rader & insats</h3>
            <p className="mt-1">
              Varje unik kombination av hästar är en rad. Antalet rader är
              produkten av hur många hästar du valt i varje avdelning. Radpriset
              är normalt 0,50 kr – fler hästar = dyrare men säkrare kupong.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              🟢 Spikar & skrällar
            </h3>
            <p className="mt-1">
              En <strong>spik</strong> är en häst du går helt på i en avdelning.
              En <strong>skräll</strong> är en lågprocentare som kan höja
              utdelningen rejält. Hitta balansen mellan säkra drag och modiga
              chansningar.
            </p>
          </div>
        </div>

        <div className="mt-5 grid md:grid-cols-[minmax(0,1.7fr),minmax(0,1.3fr)] gap-5 text-sm">
          <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
            <h3 className="font-semibold text-slate-900">
              Tips för en smart kupong
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-700">
              <li>Börja med att sätta dina 1–2 bästa spikar.</li>
              <li>Gå kort i loppen där favoriten känns stark.</li>
              <li>
                Ta med fler hästar i öppna lopp – gärna någon skräll som kan
                rensa i kupongen.
              </li>
              <li>
                Jämför flera källor: tränarintervjuer, gratis tipslänkarna ovan
                och din egen magkänsla.
              </li>
            </ul>
          </div>
          <div className="rounded-xl bg-slate-900 text-slate-50 p-4">
            <h3 className="font-semibold">Spela ansvarsfullt</h3>
            <p className="mt-2 text-sm text-slate-200">
              Trav ska vara underhållning – inget sätt att lösa ekonomin.
              Bestäm en budget innan du spelar och håll dig till den, oavsett
              hur det går.
            </p>
            <p className="mt-3 text-[11px] text-slate-400">
              Behöver du hjälp? Besök Stödlinjen (020-81 91 00) eller prata med
              ATG:s kundtjänst.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SwishInfoSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 mt-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-600">
        <p>
          När du samlar in Swish-betalningar och kontaktuppgifter ansvarar du
          själv för att följa GDPR. Spara bara uppgifter så länge de behövs för
          att skicka ut systemet, och radera dem regelbundet.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Omgångskollen. Alla rättigheter reserverade.</p>
        <p>Spela ansvarsfullt. 18+ · Stödlinjen: 020-81 91 00.</p>
      </div>
    </footer>
  );
}

export default App;

