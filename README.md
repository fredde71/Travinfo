# Travinfo
Omgångskollen – Projektbeskrivning för ATG (AIS-ansökan)
Översikt

Omgångskollen är ett fristående hobbyprojekt som samlar information, analyser och externa länkar inför varje veckas V85-omgång. Syftet är att presentera en tydlig och lättillgänglig sammanställning av tips och information från olika travsajter, utan koppling till ATG som spelbolag.

Sidan är helt statisk och visar ingen realtidsdata från ATG i dagsläget. All data uppdateras manuellt inför varje omgång. När AIS-licensen aktiveras kommer Omgångskollen att använda ATG:s officiella data på ett kontrollerat sätt för att ge korrekt och uppdaterad information.

Tjänstens syfte

Omgångskollen är byggd för att:

Samla tips, analyser, nyheter, startlistor och länkar inför varje veckas V85-omgång.

Hjälpa användare att snabbt få överblick inför helgens spel.

Presentera information på ett tydligt, mobilvänligt och snabbt sätt.

Ge en neutral och enkel samlingsplats för gratis och betalda travtips.

Sidan erbjuder ingen spelintegration, ingen inloggning och inga funktioner för att spela hos ATG.

Nuvarande datakällor (utan AIS)

Fram till AIS-godkännande används endast:

Publika PDF:er (t.ex. gratisprogram från banor)

Länkar till externa travsajter (Trav365, Travronden, m.fl.)

Manuell sammanställning av analys och startlistor

Öppna väder-API för banförhållanden

Egna formuleringar kring spikar, skrällar och idéer

Ingen automatisk inhämtning sker från ATG:s system.

Planerad användning av ATG:s AIS-data

När AIS-licensen godkänns kommer följande information från ATG användas:

Officiella startlistor

Spelprocent / streckfördelning

Odds

Resultat efter loppen

Eventuella programförändringar

Statistik kopplad till kuskar och tränare

Denna data kommer endast visas i en statisk vy, utan interaktion, utan automatisk uppdatering under spelet, och utan möjlighet att spela direkt via Omgångskollen.

Värde för slutanvändaren

Korrekt och officiell information innan spel lämnas hos ATG.

Samlad information från flera travkällor på ett ställe.

Minimerar behovet att hoppa mellan olika sajter.

Tydlig och ren presentation inför V85 varje lördag.

Teknisk översikt

Byggd i React + Vite

Hostas via GitHub Pages

Domän: www.omgångskollen.se

Deployment sker automatiskt via GitHub Actions

Endast statiska filer (HTML, CSS, JS, JSON)

Ingen backend, inga databaser, inga externa servrar

Användarvolymer

Små volymer då projektet är hobbybaserat

Endast helgtrafik i samband med V85

Lågt API-utnyttjande (endast vid visa-sidtid)

Ansvar & transparens

Omgångskollen:

Är inte kopplad till ATG

Förmedlar inga spel

Samlar endast information

Uppmanar alltid till ansvarsfullt spelande

Innehåller tydlig disclaimers i sidfoten

Exempelvy (visualisering)

Startsidan innehåller:

Nedräkning till spelstopp

Banförhållanden

Spikar, skrällar och varningar

Länkar till tips (gratis och betalt)

Nyheter inför omgången

Guide till V85

Historik över tidigare omgångar

All visning är statisk och icke-interaktiv.

Slutord

Omgångskollen är en renodlad informationssida som kommer dra stor nytta av officiell ATG-data via AIS, främst för att kunna presentera startlistor och procent korrekt.

Projektet kommer att fortsätta vara:

Ansvarsfullt

Transparent

Nogrant avgränsat

Helt utan spelintegration