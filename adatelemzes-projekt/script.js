const themeToggleButton = document.querySelector("#theme-toggle");

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("night");
  });
}

const pageTranslations = {
  hu: {
    title: "Microsoft vs Apple",
    nav: ["Vissza a homepage-re", "Projekt", "Diagramok", "Megállapítások", "Források"],
    heroEyebrow: "Adatelemzés és adatvizualizáció",
    heroTitle: "Microsoft és Apple összehasonlítása pénzügyi és üzleti adatok alapján.",
    heroLead:
      "Ez a projekt azt vizsgálja, hogyan különbözik a két technológiai óriás növekedése, profitabilitása és üzleti szerkezete. A weboldal célja, hogy közérthető módon mutassa be a hivatalos vállalati jelentésekből származó adatokat.",
    metrics: ["Vállalatok", "Forrás", "Fókusz"],
    metricValues: ["Microsoft vs Apple", "Hivatalos annual reportok", "Bevétel, profit, szegmensek"],
    heroButtons: ["Projekt áttekintése", "Hangulat váltása"],
    sectionLabels: ["Projektáttekintés", "Elemzési keret", "Vizualizációk", "Fő megállapítások", "Adatfájl", "Módszertan", "Források", "Összegzés"],
    headings: [
      "Mi a kutatási kérdés?",
      "Milyen szempontok mentén hasonlítom össze a két vállalatot?",
      "Összehasonlító diagramok a hivatalos jelentések alapján",
      "Mit mutat az összehasonlítás?",
      "A projekt külön adatállományból dolgozik",
      "Hogyan épül fel ez az összehasonlítás?",
      "Felhasznált hivatalos adatok és hivatkozások",
      "A projekt egy működő, bővíthető adatvizualizációs oldal."
    ],
    projectCards: [
      ["Növekedés", "Hogyan alakult a Microsoft és az Apple árbevétele az elmúlt években, és melyik vállalat tudott egyenletesebben növekedni?"],
      ["Profitabilitás", "Melyik vállalat működik magasabb jövedelmezőséggel, és mennyire látszik a különbség a nettó profitban és a marginokban?"],
      ["Üzleti szerkezet", "Mennyire diverzifikált a két cég bevételi szerkezete, és melyik függ jobban egy-egy domináns üzletágtól?"]
    ],
    timeline: [
      ["1. dimenzió", "Bevételi trendek", "Éves árbevételi adatok alapján megvizsgálom, hogy a két vállalat növekedése milyen mintát követett, és mennyire volt stabil az elmúlt években.", "Fő mutatók: revenue, year-over-year growth."],
      ["2. dimenzió", "Profit és marzsok", "Nem csak a bevétel fontos, hanem az is, hogy abból mennyi profit marad. Itt a nettó profitot, operating income-ot és a marginokat vetem össze.", "Fő mutatók: net income, operating income, profit margin."],
      ["3. dimenzió", "Üzletági bontás", "A Microsoft több nagy üzleti szegmensre épül, míg az Apple esetében az iPhone és a Services kiemelten fontos. Ez a rész a bevételszerkezetet mutatja be.", "Fő mutatók: business segments, product categories."],
      ["4. dimenzió", "Értelmezési korlátok", "A két cég üzleti modellje nem teljesen azonos, és a pénzügyi éveik sem ugyanakkor zárulnak. Ezért az összehasonlításnál a kontextust is külön jelzem.", "Megjegyzés: Microsoft FY2025 vége 2025. június 30., Apple FY2025 vége 2025. szeptember 27."]
    ],
    chartCards: [
      ["Éves árbevétel összehasonlítása", "Oszlop- vagy vonaldiagram az éves revenue adatokhoz, hogy jól látszódjon a növekedési pálya."],
      ["Nettó profit összehasonlítása", "Megmutatja, melyik vállalat tudott több nyereséget termelni és mennyire ingadozott a teljesítmény."],
      ["Profitmarzsok", "Egy százalékos alapú vizualizáció, amely jobban összehasonlíthatóvá teszi a két céget méretkülönbség mellett is."],
      ["Bevételi szerkezet", "Szegmens- vagy termékkategória szerinti bontás, hogy látszódjon a diverzifikáció mértéke."]
    ],
    insights: [
      ["Az Apple nagyobb árbevételt ér el", "Az éves revenue alapján az Apple mindhárom vizsgált évben nagyobb összbevételt ért el, ami jól mutatja a vállalat méretét és globális piaci súlyát."],
      ["A Microsoft profitabilitása erősebb", "A nettó profitmarzs adatok alapján a Microsoft hatékonyabban alakítja át bevételét nyereséggé, ami különösen a szoftver- és cloudalapú modell erejét emeli ki."],
      ["Eltérő üzleti szerkezet", "A Microsoft bevétele több nagy szegmens között oszlik meg, míg az Apple-nél az iPhone továbbra is domináns. Ez a diverzifikációs különbség fontos stratégiai eltérés."]
    ],
    summary: [["Összkép", "Apple: nagyobb bevétel"], ["Hatékonyság", "Microsoft: magasabb marzs"], ["Szerkezet", "Microsoft: diverzifikáltabb"]],
    dataParagraphs: [
      "Az összehasonlításhoz használt adatokat külön JSON fájlban tárolom, így a vizualizációk és a weboldal tartalma nincsenek közvetlenül beégetve a HTML-be. Ez azért hasznos, mert ha új pénzügyi év adatai jelennek meg, vagy további mutatókat szeretnék hozzáadni, akkor elég az adatállományt frissíteni, és az oldal ugyanarra a struktúrára építve tovább használható marad.",
      "A fájl jelenleg tartalmazza a Microsoft és az Apple 2023, 2024 és 2025-ös éves árbevételét, operating income értékeit, nettó profitját, profitmarzsait, valamint a 2025-ös bevételi szerkezet fő kategóriáit. Ez jó alapot ad az összehasonlító elemzéshez, és később további évekkel, régiós bontásokkal vagy részletesebb üzletági adatokkal is bővíthető.",
      "Ez a megoldás módszertanilag is előnyös: az adatok elkülönülnek a megjelenítéstől, ezért a projekt átláthatóbb, újrahasznosíthatóbb és könnyebben ellenőrizhető. Ugyanebből az adatfájlból több különböző diagram is felépíthető."
    ],
    dataFile: "Adatfájl: ",
    methods: [
      ["1. Adatgyűjtés", "Az adatok a Microsoft és az Apple hivatalos befektetői és éves jelentéseiből származnak, így elsődleges és ellenőrizhető forrásokra épülnek."],
      ["2. Adattisztítás", "Az adatokat egységes szerkezetbe rendeztem egy külön JSON fájlban, hogy ugyanaz a forrás több diagramot is ki tudjon szolgálni."],
      ["3. Vizualizáció", "A weboldal JavaScript segítségével tölti be és jeleníti meg az adatokat, így a grafikonok frissíthetők és újrahasznosíthatók."]
    ],
    methodNote: "Fontos korlát: a cégek pénzügyi évei eltérő időpontban zárulnak, ezért az eredmények értelmezésénél ezt a kontextust figyelembe kell venni.",
    sourceLinks: ["Microsoft Annual Report FY2025", "Microsoft Investor Relations", "Apple Investor Relations", "Apple SEC Filings", "Apple FY2025 Q4 Results"],
    closing: [
      "Az oldal bemutatja, hogyan lehet vállalati pénzügyi adatokat külön adatfájlban kezelni, majd ezekből strukturált és vizuálisan értelmezhető webes megjelenítést készíteni.",
      "A Microsoft vs Apple összehasonlítás jó példa arra, hogy az adatvizualizáció nemcsak számok bemutatása, hanem üzleti mintázatok, különbségek és következtetések feltárása is."
    ],
    footer: ["Készítette: Adatelemzés és adatvizualizáció projekt", "Téma: Microsoft vs Apple pénzügyi összehasonlítás"],
    chartLabels: {
      msft: "Microsoft",
      aapl: "Apple",
      revenueTitle: "Éves árbevétel",
      profitTitle: "Nettó profit",
      marginTitle: "Nettó profitmarzs",
      segmentsTitle: "2025-ös bevételi szerkezet",
      microsoftSegments: "Microsoft 2025 szegmensek",
      appleSegments: "Apple 2025 kategóriák",
      fallback: "Az adatblokkok helyi file megnyitásnál nem mindig töltődnek be. Böngészős szerverrel vagy GitHub Pages-en működnek biztosan."
    }
  },
  en: {
    title: "Microsoft vs Apple",
    nav: ["Back to homepage", "Project", "Charts", "Findings", "Sources"],
    heroEyebrow: "Data analysis and visualization",
    heroTitle: "Comparing Microsoft and Apple through financial and business data.",
    heroLead:
      "This project explores how the two technology giants differ in growth, profitability, and business structure. The goal of the website is to present data from official corporate reports in a clear and accessible way.",
    metrics: ["Companies", "Source", "Focus"],
    metricValues: ["Microsoft vs Apple", "Official annual reports", "Revenue, profit, segments"],
    heroButtons: ["Project overview", "Toggle mood"],
    sectionLabels: ["Project overview", "Analytical framework", "Visualizations", "Key findings", "Data file", "Methodology", "Sources", "Summary"],
    headings: [
      "What is the research question?",
      "Which dimensions are used to compare the two companies?",
      "Comparative charts based on official reports",
      "What does the comparison show?",
      "The project works from a separate data file",
      "How is this comparison built?",
      "Official data sources and references used",
      "The project is a working, extensible data visualization website."
    ],
    projectCards: [
      ["Growth", "How did Microsoft and Apple revenues evolve in recent years, and which company grew more steadily?"],
      ["Profitability", "Which company operates with stronger profitability, and how visible is the difference in net income and margins?"],
      ["Business structure", "How diversified is each company's revenue structure, and which one depends more on dominant business lines?"]
    ],
    timeline: [
      ["Dimension 1", "Revenue trends", "Using annual revenue data, I examine the growth pattern of both companies and how stable it has been over the last few years.", "Main metrics: revenue, year-over-year growth."],
      ["Dimension 2", "Profit and margins", "Revenue alone is not enough; what matters is how much profit remains. Here I compare net income, operating income, and margins.", "Main metrics: net income, operating income, profit margin."],
      ["Dimension 3", "Segment breakdown", "Microsoft relies on several major business segments, while Apple is strongly shaped by iPhone and Services. This section presents revenue structure.", "Main metrics: business segments, product categories."],
      ["Dimension 4", "Interpretation limits", "The two companies do not share identical business models and their fiscal years do not end at the same time. That context is therefore highlighted separately.", "Note: Microsoft FY2025 ended on June 30, 2025; Apple FY2025 ended on September 27, 2025."]
    ],
    chartCards: [
      ["Annual revenue comparison", "A bar or line view of yearly revenue to make the growth path clearly visible."],
      ["Net income comparison", "Shows which company generated more profit and how much performance fluctuated."],
      ["Profit margins", "A percentage-based visualization that makes the two companies easier to compare despite size differences."],
      ["Revenue structure", "A segment or product-category breakdown to show the extent of diversification."]
    ],
    insights: [
      ["Apple reaches higher revenue", "Based on annual revenue, Apple generated greater total revenue in all three examined years, highlighting its scale and global market weight."],
      ["Microsoft shows stronger profitability", "Net margin figures suggest Microsoft converts revenue into profit more efficiently, underlining the strength of its software and cloud-driven model."],
      ["Different business structure", "Microsoft revenue is spread across multiple large segments, while Apple still depends heavily on the iPhone. This diversification gap is a key strategic difference."]
    ],
    summary: [["Overall picture", "Apple: higher revenue"], ["Efficiency", "Microsoft: higher margin"], ["Structure", "Microsoft: more diversified"]],
    dataParagraphs: [
      "The comparison data is stored in a separate JSON file, so neither the visualizations nor the website content are directly hardcoded into the HTML. This is useful because if new fiscal-year data appears or if I want to add more indicators, I only need to update the data file and the site can continue using the same structure.",
      "The file currently contains Microsoft and Apple annual revenue, operating income, net income, profit margins, and key 2025 revenue structure categories for 2023, 2024, and 2025. This provides a strong base for comparative analysis and can later be expanded with more years, regional breakdowns, or more detailed segment data.",
      "This solution is also methodologically beneficial: data is separated from presentation, making the project more transparent, reusable, and easier to verify. Multiple different charts can be built from the same data file."
    ],
    dataFile: "Data file: ",
    methods: [
      ["1. Data collection", "The data comes from official investor and annual reports of Microsoft and Apple, so the project relies on primary and verifiable sources."],
      ["2. Data structuring", "I organized the data into a unified structure inside a separate JSON file so that the same source can power multiple charts."],
      ["3. Visualization", "The website loads and displays the data with JavaScript, making the charts easy to refresh and reuse."]
    ],
    methodNote: "Important limitation: the companies' fiscal years end at different times, so this context must be considered when interpreting the results.",
    sourceLinks: ["Microsoft Annual Report FY2025", "Microsoft Investor Relations", "Apple Investor Relations", "Apple SEC Filings", "Apple FY2025 Q4 Results"],
    closing: [
      "The page demonstrates how corporate financial data can be handled in a separate data file and then transformed into a structured and visually interpretable web presentation.",
      "The Microsoft vs Apple comparison is a good example of how data visualization is not only about presenting numbers, but also about revealing business patterns, differences, and conclusions."
    ],
    footer: ["Created for a data analysis and visualization project", "Topic: Microsoft vs Apple financial comparison"],
    chartLabels: {
      msft: "Microsoft",
      aapl: "Apple",
      revenueTitle: "Annual revenue",
      profitTitle: "Net income",
      marginTitle: "Net profit margin",
      segmentsTitle: "2025 revenue structure",
      microsoftSegments: "Microsoft 2025 segments",
      appleSegments: "Apple 2025 categories",
      fallback: "These data blocks may not load when the page is opened directly from a local file. They work reliably through a local server or GitHub Pages."
    }
  },
  ro: {
    title: "Microsoft vs Apple",
    nav: ["Înapoi la homepage", "Proiect", "Grafice", "Concluzii", "Surse"],
    heroEyebrow: "Analiză și vizualizare de date",
    heroTitle: "Comparație între Microsoft și Apple pe baza datelor financiare și de business.",
    heroLead:
      "Acest proiect analizează modul în care cei doi giganți tehnologici diferă din punct de vedere al creșterii, profitabilității și structurii de business. Scopul site-ului este să prezinte într-un mod clar date provenite din rapoarte oficiale ale companiilor.",
    metrics: ["Companii", "Sursă", "Focus"],
    metricValues: ["Microsoft vs Apple", "Rapoarte anuale oficiale", "Venituri, profit, segmente"],
    heroButtons: ["Prezentarea proiectului", "Schimbă atmosfera"],
    sectionLabels: ["Prezentarea proiectului", "Cadru de analiză", "Vizualizări", "Concluzii principale", "Fișier de date", "Metodologie", "Surse", "Rezumat"],
    headings: [
      "Care este întrebarea de cercetare?",
      "După ce criterii compar cele două companii?",
      "Grafice comparative bazate pe rapoarte oficiale",
      "Ce arată comparația?",
      "Proiectul folosește un fișier de date separat",
      "Cum este construită această comparație?",
      "Surse oficiale și referințe utilizate",
      "Proiectul este un site de vizualizare a datelor funcțional și extensibil."
    ],
    projectCards: [
      ["Creștere", "Cum au evoluat veniturile Microsoft și Apple în ultimii ani și care companie a crescut mai stabil?"],
      ["Profitabilitate", "Care companie operează cu o profitabilitate mai ridicată și cât de vizibilă este diferența în profitul net și marje?"],
      ["Structură de business", "Cât de diversificată este structura veniturilor fiecărei companii și care depinde mai mult de linii dominante de business?"]
    ],
    timeline: [
      ["Dimensiunea 1", "Tendințe ale veniturilor", "Pe baza datelor anuale privind veniturile, analizez modelul de creștere al celor două companii și cât de stabil a fost în ultimii ani.", "Indicatori principali: revenue, year-over-year growth."],
      ["Dimensiunea 2", "Profit și marje", "Nu contează doar venitul, ci și cât profit rămâne. Aici compar net income, operating income și marjele.", "Indicatori principali: net income, operating income, profit margin."],
      ["Dimensiunea 3", "Structura pe segmente", "Microsoft se bazează pe mai multe segmente importante, în timp ce Apple este puternic influențată de iPhone și Services. Această parte prezintă structura veniturilor.", "Indicatori principali: business segments, product categories."],
      ["Dimensiunea 4", "Limite de interpretare", "Cele două companii nu au modele de business identice și nici anii fiscali nu se încheie în același moment. Acest context este menționat separat.", "Notă: Microsoft FY2025 s-a încheiat la 30 iunie 2025, iar Apple FY2025 la 27 septembrie 2025."]
    ],
    chartCards: [
      ["Comparația veniturilor anuale", "O vizualizare de tip bară sau linie pentru veniturile anuale, astfel încât traseul creșterii să fie clar vizibil."],
      ["Comparația profitului net", "Arată care companie a generat mai mult profit și cât de mult a fluctuat performanța."],
      ["Marjele de profit", "O vizualizare bazată pe procente care face cele două companii mai ușor de comparat, chiar și cu diferențe de dimensiune."],
      ["Structura veniturilor", "O împărțire pe segmente sau categorii de produse pentru a evidenția gradul de diversificare."]
    ],
    insights: [
      ["Apple obține venituri mai mari", "Pe baza veniturilor anuale, Apple a generat venituri totale mai mari în toți cei trei ani analizați, evidențiind dimensiunea și greutatea sa pe piața globală."],
      ["Microsoft are o profitabilitate mai puternică", "Valorile marjei nete sugerează că Microsoft transformă veniturile în profit mai eficient, evidențiind puterea modelului său bazat pe software și cloud."],
      ["Structură de business diferită", "Veniturile Microsoft sunt distribuite între mai multe segmente mari, în timp ce Apple depinde încă puternic de iPhone. Această diferență de diversificare este un contrast strategic important."]
    ],
    summary: [["Imagine generală", "Apple: venituri mai mari"], ["Eficiență", "Microsoft: marjă mai ridicată"], ["Structură", "Microsoft: mai diversificat"]],
    dataParagraphs: [
      "Datele utilizate pentru comparație sunt stocate într-un fișier JSON separat, astfel încât nici vizualizările și nici conținutul site-ului nu sunt introduse direct în HTML. Acest lucru este util deoarece, dacă apar date noi pentru un an fiscal sau dacă vreau să adaug noi indicatori, este suficient să actualizez fișierul de date.",
      "Fișierul conține în prezent veniturile anuale, operating income, profitul net, marjele de profit și principalele categorii de structură a veniturilor pentru 2023, 2024 și 2025 pentru Microsoft și Apple. Acesta oferă o bază bună pentru analiza comparativă și poate fi extins ulterior cu mai mulți ani, descompuneri regionale sau segmente mai detaliate.",
      "Această soluție este avantajoasă și din punct de vedere metodologic: datele sunt separate de prezentare, ceea ce face proiectul mai transparent, reutilizabil și mai ușor de verificat. Din același fișier de date pot fi construite mai multe grafice diferite."
    ],
    dataFile: "Fișier de date: ",
    methods: [
      ["1. Colectarea datelor", "Datele provin din rapoartele oficiale pentru investitori și rapoartele anuale ale Microsoft și Apple, astfel încât proiectul se bazează pe surse primare și verificabile."],
      ["2. Structurarea datelor", "Am organizat datele într-o structură unificată într-un fișier JSON separat, astfel încât aceeași sursă să poată alimenta mai multe grafice."],
      ["3. Vizualizare", "Site-ul încarcă și afișează datele cu ajutorul JavaScript, ceea ce face graficele ușor de actualizat și reutilizat."]
    ],
    methodNote: "Limitare importantă: anii fiscali ai companiilor se încheie în momente diferite, deci acest context trebuie luat în considerare la interpretarea rezultatelor.",
    sourceLinks: ["Raport anual Microsoft FY2025", "Microsoft Investor Relations", "Apple Investor Relations", "Apple SEC Filings", "Rezultate Apple FY2025 Q4"],
    closing: [
      "Pagina arată cum pot fi gestionate datele financiare corporative într-un fișier separat și transformate apoi într-o prezentare web structurată și ușor de interpretat vizual.",
      "Comparația Microsoft vs Apple este un bun exemplu al faptului că vizualizarea datelor nu înseamnă doar afișarea numerelor, ci și evidențierea tiparelor de business, a diferențelor și a concluziilor."
    ],
    footer: ["Creat pentru un proiect de analiză și vizualizare a datelor", "Temă: comparație financiară Microsoft vs Apple"],
    chartLabels: {
      msft: "Microsoft",
      aapl: "Apple",
      revenueTitle: "Venit anual",
      profitTitle: "Profit net",
      marginTitle: "Marja profitului net",
      segmentsTitle: "Structura veniturilor în 2025",
      microsoftSegments: "Segmente Microsoft 2025",
      appleSegments: "Categorii Apple 2025",
      fallback: "Aceste blocuri de date s-ar putea să nu se încarce atunci când pagina este deschisă direct dintr-un fișier local. Ele funcționează sigur printr-un server local sau GitHub Pages."
    }
  }
};

let currentLanguage = window.SiteLanguage.getCurrentLanguage();

const formatUsdMillions = (value) =>
  `$${new Intl.NumberFormat("en-US").format(value)}M`;

const buildLegend = (items) =>
  `
    <div class="chart-legend">
      ${items
        .map(
          (item) => `
            <span class="legend-item">
              <span class="legend-swatch ${item.className}"></span>
              <span>${item.label}</span>
            </span>
          `
        )
        .join("")}
    </div>
  `;

const renderPairedBarChart = (container, title, microsoftData, appleData, key) => {
  const labels = pageTranslations[currentLanguage].chartLabels;
  const maxValue = Math.max(
    ...microsoftData.map((entry) => entry[key]),
    ...appleData.map((entry) => entry[key])
  );
  const chartHeight = 112;
  const baseline = 140;
  const barWidth = 22;
  const pairStep = 58;

  const bars = microsoftData
    .map((entry, index) => {
      const groupX = 20 + index * pairStep;
      const microsoftHeight = (entry[key] / maxValue) * chartHeight;
      const appleHeight = (appleData[index][key] / maxValue) * chartHeight;

      return `
        <rect class="bar msft" x="${groupX}" y="${baseline - microsoftHeight}" width="${barWidth}" height="${microsoftHeight}" rx="6"></rect>
        <rect class="bar aapl" x="${groupX + barWidth + 6}" y="${baseline - appleHeight}" width="${barWidth}" height="${appleHeight}" rx="6"></rect>
        <text class="axis-label" x="${groupX + barWidth}" y="160" text-anchor="middle">${entry.year}</text>
      `;
    })
    .join("");

  const rows = microsoftData
    .map(
      (entry, index) => `
        <div class="mini-row">
          <strong>${entry.year}</strong>
          <span>${labels.msft}: ${formatUsdMillions(entry[key])}</span>
          <span>${labels.aapl}: ${formatUsdMillions(appleData[index][key])}</span>
        </div>
      `
    )
    .join("");

  container.innerHTML = `
    <div class="chart-shell">
      <p class="chart-data-title">${title}</p>
      ${buildLegend([
        { className: "msft", label: labels.msft },
        { className: "aapl", label: labels.aapl }
      ])}
      <svg class="chart-svg" viewBox="0 0 210 170" aria-label="${title}">
        <line class="grid-line" x1="14" y1="${baseline}" x2="196" y2="${baseline}"></line>
        ${bars}
      </svg>
      <div class="mini-table">${rows}</div>
    </div>
  `;
};

const buildLinePath = (values) => {
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const xPositions = [22, 95, 168];
  const top = 24;
  const chartHeight = 98;
  const range = Math.max(maxValue - minValue, 1);

  const points = values.map((value, index) => {
    const y = top + chartHeight - ((value - minValue) / range) * chartHeight;
    return { x: xPositions[index], y };
  });

  return {
    path: points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" "),
    points
  };
};

const renderMarginChart = (container, microsoftData, appleData) => {
  const labels = pageTranslations[currentLanguage].chartLabels;
  const microsoftPath = buildLinePath(microsoftData.map((entry) => entry.netMarginPct));
  const applePath = buildLinePath(appleData.map((entry) => entry.netMarginPct));

  const microsoftPoints = microsoftPath.points
    .map((point) => `<circle class="point msft" cx="${point.x}" cy="${point.y}" r="4"></circle>`)
    .join("");
  const applePoints = applePath.points
    .map((point) => `<circle class="point aapl" cx="${point.x}" cy="${point.y}" r="4"></circle>`)
    .join("");

  const labelsMarkup = microsoftData
    .map(
      (entry, index) => `
        <text class="axis-label" x="${[22, 95, 168][index]}" y="147" text-anchor="middle">${entry.year}</text>
      `
    )
    .join("");

  const rows = microsoftData
    .map(
      (entry, index) => `
        <div class="mini-row">
          <strong>${entry.year}</strong>
          <span>${labels.msft}: ${entry.netMarginPct}%</span>
          <span>${labels.aapl}: ${appleData[index].netMarginPct}%</span>
        </div>
      `
    )
    .join("");

  container.innerHTML = `
    <div class="chart-shell">
      <p class="chart-data-title">${labels.marginTitle}</p>
      ${buildLegend([
        { className: "msft", label: labels.msft },
        { className: "aapl", label: labels.aapl }
      ])}
      <svg class="chart-svg" viewBox="0 0 190 160" aria-label="${labels.marginTitle}">
        <line class="grid-line" x1="14" y1="124" x2="176" y2="124"></line>
        <line class="grid-line" x1="14" y1="75" x2="176" y2="75"></line>
        <path class="line msft" d="${microsoftPath.path}"></path>
        <path class="line aapl" d="${applePath.path}"></path>
        ${microsoftPoints}
        ${applePoints}
        ${labelsMarkup}
      </svg>
      <div class="mini-table">${rows}</div>
    </div>
  `;
};

const renderSegments = (container, microsoftSegments, appleSegments) => {
  const labels = pageTranslations[currentLanguage].chartLabels;
  const microsoftMax = Math.max(...microsoftSegments.map((segment) => segment.revenue));
  const appleMax = Math.max(...appleSegments.map((segment) => segment.revenue));

  const microsoftRows = microsoftSegments
    .map(
      (segment) => `
        <div class="segment-item">
          <div class="segment-meta">
            <span class="segment-name">${segment.name}</span>
            <span class="segment-value">${formatUsdMillions(segment.revenue)}</span>
          </div>
          <div class="segment-track">
            <span class="segment-fill" style="width: ${(segment.revenue / microsoftMax) * 100}%"></span>
          </div>
        </div>
      `
    )
    .join("");

  const appleRows = appleSegments
    .map(
      (segment) => `
        <div class="segment-item">
          <div class="segment-meta">
            <span class="segment-name">${segment.name}</span>
            <span class="segment-value">${formatUsdMillions(segment.revenue)}</span>
          </div>
          <div class="segment-track">
            <span class="segment-fill aapl" style="width: ${(segment.revenue / appleMax) * 100}%"></span>
          </div>
        </div>
      `
    )
    .join("");

  container.innerHTML = `
    <div class="chart-shell">
      <p class="chart-data-title">${labels.segmentsTitle}</p>
      ${buildLegend([
        { className: "msft", label: labels.microsoftSegments },
        { className: "aapl", label: labels.appleSegments }
      ])}
      <p class="chart-data-title">${labels.microsoftSegments}</p>
      <div class="segment-list">${microsoftRows}</div>
      <p class="chart-data-title">${labels.appleSegments}</p>
      <div class="segment-list">${appleRows}</div>
    </div>
  `;
};

const setFallbackMessage = () => {
  const message = pageTranslations[currentLanguage].chartLabels.fallback;
  ["chart-revenue", "chart-profit", "chart-margin", "chart-segments"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = message;
    }
  });
};

const applyPageLanguage = (lang) => {
  currentLanguage = lang;
  const copy = pageTranslations[lang] || pageTranslations.hu;
  document.title = copy.title;

  document.querySelectorAll(".nav-links .nav-link").forEach((link, index) => {
    link.textContent = copy.nav[index];
  });
  document.querySelector(".hero-content .eyebrow").textContent = copy.heroEyebrow;
  document.querySelector(".hero-content h1").textContent = copy.heroTitle;
  document.querySelector(".hero-content .lead").textContent = copy.heroLead;

  document.querySelectorAll(".metric-label").forEach((item, index) => {
    item.textContent = copy.metrics[index];
  });
  document.querySelectorAll(".metric strong").forEach((item, index) => {
    item.textContent = copy.metricValues[index];
  });

  const heroButtons = document.querySelectorAll(".hero-actions .button");
  heroButtons[0].textContent = copy.heroButtons[0];
  heroButtons[1].textContent = copy.heroButtons[1];

  document.querySelectorAll(".section-label").forEach((item, index) => {
    item.textContent = copy.sectionLabels[index];
  });
  document.querySelectorAll(".panel-heading h2").forEach((item, index) => {
    item.textContent = copy.headings[index];
  });

  document.querySelectorAll(".card-grid .card").forEach((card, index) => {
    card.querySelector("h3").textContent = copy.projectCards[index][0];
    card.querySelector("p").textContent = copy.projectCards[index][1];
  });

  document.querySelectorAll(".timeline-item").forEach((item, index) => {
    item.querySelector(".timeline-step").textContent = copy.timeline[index][0];
    item.querySelector("h3").textContent = copy.timeline[index][1];
    item.querySelectorAll("p")[1].textContent = copy.timeline[index][2];
    item.querySelector(".checkpoint").textContent = copy.timeline[index][3];
  });

  document.querySelectorAll(".chart-card").forEach((card, index) => {
    card.querySelector("h3").textContent = copy.chartCards[index][0];
    card.querySelector("p").textContent = copy.chartCards[index][1];
  });

  document.querySelectorAll(".insight-card").forEach((card, index) => {
    card.querySelector("h3").textContent = copy.insights[index][0];
    card.querySelectorAll("p")[1].textContent = copy.insights[index][1];
  });

  document.querySelectorAll(".summary-item").forEach((item, index) => {
    item.querySelector(".metric-label").textContent = copy.summary[index][0];
    item.querySelector("strong").textContent = copy.summary[index][1];
  });

  const dataParagraphs = document.querySelectorAll(".panel:nth-of-type(5) .accent-text");
  dataParagraphs.forEach((paragraph, index) => {
    paragraph.textContent = copy.dataParagraphs[index];
  });
  document.querySelector(".data-file-link").innerHTML = `${copy.dataFile}<code>data/microsoft-apple-data.json</code>`;

  document.querySelectorAll(".method-card").forEach((card, index) => {
    card.querySelector("h3").textContent = copy.methods[index][0];
    card.querySelector("p").textContent = copy.methods[index][1];
  });
  document.querySelector(".method-note").textContent = copy.methodNote;

  document.querySelectorAll(".source-link").forEach((link, index) => {
    link.textContent = copy.sourceLinks[index];
  });

  const closingParagraphs = document.querySelectorAll(".accent-panel .accent-text");
  closingParagraphs.forEach((paragraph, index) => {
    paragraph.textContent = copy.closing[index];
  });

  document.querySelectorAll(".site-footer p").forEach((paragraph, index) => {
    paragraph.textContent = copy.footer[index];
  });
};

const renderDataCards = async () => {
  try {
    const response = await fetch("./data/microsoft-apple-data.json");
    if (!response.ok) {
      throw new Error("Data file could not be loaded.");
    }

    const data = await response.json();
    const microsoftAnnual = data.companies.microsoft.annual;
    const appleAnnual = data.companies.apple.annual;

    renderPairedBarChart(document.getElementById("chart-revenue"), pageTranslations[currentLanguage].chartLabels.revenueTitle, microsoftAnnual, appleAnnual, "revenue");
    renderPairedBarChart(document.getElementById("chart-profit"), pageTranslations[currentLanguage].chartLabels.profitTitle, microsoftAnnual, appleAnnual, "netIncome");
    renderMarginChart(document.getElementById("chart-margin"), microsoftAnnual, appleAnnual);
    renderSegments(document.getElementById("chart-segments"), data.companies.microsoft.segments2025, data.companies.apple.segments2025);
  } catch (error) {
    setFallbackMessage();
  }
};

window.addEventListener("site-language-change", async (event) => {
  applyPageLanguage(event.detail.lang);
  await renderDataCards();
});

window.SiteLanguage.initializeLanguageSwitcher();
applyPageLanguage(currentLanguage);
renderDataCards();
