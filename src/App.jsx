import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import robiPortrait from "../beadndo/assets/Robi.png";

const HubAppView = lazy(() => import("./components/HubAppView.jsx"));

function withBasePath(path) {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

const APPS = [
  {
    slug: "waste-to-energy",
    href: withBasePath("apps/waste-to-energy/"),
    accent: "featured",
    year: "2026",
    kind: { hu: "Adatvizualizáció", en: "Data visualization", ro: "Vizualizare de date" },
    title: "Waste-to-Energy and Sustainability in Europe",
    description: {
      hu: "Többnyelvű, interaktív projekt az európai hulladékkezelési rendszerekről, energia-visszanyerésről és fenntarthatósági mutatókról.",
      en: "A multilingual interactive project about European waste systems, energy recovery, and sustainability indicators.",
      ro: "Un proiect interactiv multilingv despre sistemele europene de gestionare a deșeurilor, recuperarea energiei și indicatorii de sustenabilitate."
    },
    highlights: {
      hu: ["Lokális, tisztított adatok", "Interaktív dashboard", "Románia és Magyarország fókusz"],
      en: ["Clean local datasets", "Interactive dashboard", "Romania and Hungary focus"],
      ro: ["Seturi de date locale curate", "Dashboard interactiv", "Focus pe România și Ungaria"]
    },
    details: {
      hu: ["Stack: React, Vite, Vega-Lite", "Megvalósítás: többnyelvű story-oldal, imperatív chart runtime, dashboard és szűrők"],
      en: ["Stack: React, Vite, Vega-Lite", "Implementation: multilingual story page, imperative chart runtime, dashboard and filters"],
      ro: ["Stack: React, Vite, Vega-Lite", "Implementare: pagină narativă multilingvă, runtime imperativ pentru grafice, dashboard și filtre"]
    }
  },
  {
    slug: "microsoft-vs-apple",
    href: withBasePath("apps/microsoft-vs-apple/"),
    accent: "analysis",
    year: "2025",
    kind: { hu: "Pénzügyi elemzés", en: "Financial analysis", ro: "Analiză financiară" },
    title: "Microsoft vs Apple",
    description: {
      hu: "Narratív összehasonlító oldal a két vállalat bevételéről, profitabilitásáról és üzleti szerkezetéről.",
      en: "A narrative comparison page covering the two companies' revenue, profitability, and business structure.",
      ro: "O pagină comparativă narativă despre veniturile, profitabilitatea și structura de business a celor două companii."
    },
    highlights: {
      hu: ["Éves riportokra épül", "Diagramok és témaváltás", "Elemző történetmesélés"],
      en: ["Built from annual reports", "Charts and theme switch", "Analytical storytelling"],
      ro: ["Bazat pe rapoarte anuale", "Grafice și schimbare de temă", "Storytelling analitic"]
    },
    details: {
      hu: ["Stack: HTML, CSS, JavaScript, JSON adatok", "Megvalósítás: narratív felépítésű pénzügyi összehasonlító oldal témaváltással"],
      en: ["Stack: HTML, CSS, JavaScript, JSON data", "Implementation: narrative financial comparison page with theme switching"],
      ro: ["Stack: HTML, CSS, JavaScript, date JSON", "Implementare: pagină narativă de comparație financiară cu schimbare de temă"]
    }
  },
  {
    slug: "last-ring-arena",
    href: withBasePath("apps/last-ring-arena/"),
    accent: "game",
    year: "2025",
    kind: { hu: "Játék", en: "Game", ro: "Joc" },
    title: "Last Ring Arena",
    description: {
      hu: "Saját survival arena projektem hullámrendszerrel, fejlesztésekkel, témaválasztóval és leaderboarddal.",
      en: "My own survival arena project with waves, upgrades, theme switching, and a leaderboard.",
      ro: "Proiectul meu survival arena cu valuri, upgrade-uri, schimbare de teme și leaderboard."
    },
    highlights: {
      hu: ["Canvas alapú játékmenet", "Két külön vizuális téma", "Folyamatosan bővített saját projekt"],
      en: ["Canvas gameplay", "Two visual themes", "Continuously expanded personal project"],
      ro: ["Gameplay pe canvas", "Două teme vizuale", "Proiect personal extins continuu"]
    },
    details: {
      hu: ["Stack: HTML, CSS, JavaScript, Canvas", "Megvalósítás: survival arena loop, hullámrendszer, képességek és leaderboard"],
      en: ["Stack: HTML, CSS, JavaScript, Canvas", "Implementation: survival arena loop, wave system, abilities, and leaderboard"],
      ro: ["Stack: HTML, CSS, JavaScript, Canvas", "Implementare: loop de survival arena, sistem de valuri, abilități și leaderboard"]
    }
  },
  {
    slug: "danube-street-stories",
    href: withBasePath("apps/danube-street-stories/"),
    accent: "game",
    year: "2026",
    kind: { hu: "Játék", en: "Game", ro: "Joc" },
    title: "Danube Street Stories",
    description: {
      hu: "GTA-hangulatú, webes mini open-world játék NPC-kkel, küldetésekkel, pénzrendszerrel, autóval, motorral és fegyverváltással.",
      en: "A GTA-inspired web mini open world with NPCs, missions, money systems, cars, bikes, and weapon switching.",
      ro: "Un mini open world web inspirat de GTA, cu NPC-uri, misiuni, bani, mașini, motociclete și schimbare de arme."
    },
    highlights: {
      hu: ["Pseudo-3D városi pálya", "Három játszható küldetés", "Autó, motor, bolt és heat rendszer"],
      en: ["Pseudo-3D city map", "Three playable missions", "Car, bike, shop, and heat system"],
      ro: ["Hartă urbană pseudo-3D", "Trei misiuni jucabile", "Mașină, motor, shop și sistem heat"]
    },
    details: {
      hu: ["Stack: React, Vite, Three.js, React Three Fiber, Rapier", "Megvalósítás: desktop-first FPS sandbox budapesti városi snapshotból, küldetésekkel, hostile AI-val és járművekkel"],
      en: ["Stack: React, Vite, Three.js, React Three Fiber, Rapier", "Implementation: desktop-first FPS sandbox built from a Budapest city snapshot with missions, hostile AI, and vehicles"],
      ro: ["Stack: React, Vite, Three.js, React Three Fiber, Rapier", "Implementare: sandbox FPS desktop-first construit dintr-un snapshot urban din Budapesta, cu misiuni, AI ostil și vehicule"]
    }
  },
  {
    slug: "romanian-cities-population",
    href: withBasePath("apps/romanian-cities-population/"),
    accent: "archive",
    year: "2024",
    kind: { hu: "Korábbi munka", en: "Earlier work", ro: "Lucrare anterioară" },
    title: "Romanian Cities: A Decade of Population Change",
    description: {
      hu: "Korábbi adatvizualizációs projekt a romániai városok népességváltozásáról 2010 és 2019 között.",
      en: "An earlier data visualization project about population change in Romanian cities between 2010 and 2019.",
      ro: "Un proiect anterior de vizualizare a datelor despre schimbarea populației în orașele din România între 2010 și 2019."
    },
    highlights: {
      hu: ["Vega-Lite vizualizációk", "Egyrészes történetmesélő oldal", "Demográfiai fókusz"],
      en: ["Vega-Lite visualizations", "Single-page story layout", "Demographic focus"],
      ro: ["Vizualizări Vega-Lite", "Layout narativ pe o singură pagină", "Focus demografic"]
    },
    details: {
      hu: ["Stack: HTML, beágyazott CSS, Vega-Lite", "Megvalósítás: egyoldalas adatvizualizációs történet romániai városadatokra"],
      en: ["Stack: HTML, embedded CSS, Vega-Lite", "Implementation: single-page data-story about Romanian city population data"],
      ro: ["Stack: HTML, CSS integrat, Vega-Lite", "Implementare: poveste de date pe o singură pagină despre populația orașelor din România"]
    }
  }
];

const COPY = {
  hu: {
    lang: "hu",
    nav: ["Kezdőlap", "Munkák"],
    eyebrow: "Projektportfólió",
    title: "Szakács Róbert digitális projektjei egy helyen.",
    lead:
      "Ez a gyökéroldal most már tényleg a portfólió kezdőpontja: innen lehet belépni az egyes munkákba, legyen szó adatvizualizációról, elemző oldalról vagy saját játékról.",
    primary: "Waste-to-Energy megnyitása",
    secondary: "Összes munka",
    panelLabel: "Kiemelt munka",
    panelTitle: "Waste-to-Energy and Sustainability in Europe",
    panelText:
      "A legerősebb és legösszetettebb projekt jelenleg ez a többnyelvű adatvizualizációs oldal, amely az európai hulladékkezelési mintákat és fenntarthatósági összefüggéseket vizsgálja.",
    panelMeta: [
      ["Forma", "Interaktív webes projekt"],
      ["Fókusz", "Hulladékkezelés, energia, fenntarthatóság"]
    ],
    worksEyebrow: "Válogatás",
    worksTitle: "Kiemelt munkák",
    open: "Megnyitás",
    openStandalone: "Külön oldalon",
    backToHub: "Vissza a hubra",
    infoLabel: "Részletek",
    stackLabel: "Stack",
    runtimeLabel: "Betöltés",
    lazyRuntime: "Csak ezen a nézeten töltődik be",
    webglRuntime: "WebGL csak megnyitás után inicializálódik",
    loadingLabel: "Lazy launch",
    loadingText: "Az app külön nézetként töltődik be, ezért a hub kezdőbetöltése könnyű marad.",
    footer: ["Szakács Róbert", "Projektportfólió"]
  },
  en: {
    lang: "en",
    nav: ["Home", "Work"],
    eyebrow: "Project Portfolio",
    title: "Róbert Szakács's digital projects in one place.",
    lead:
      "This root page now works as the actual portfolio entry point: from here you can open each project, whether it is a data visualization piece, an analysis page, or a personal game project.",
    primary: "Open Waste-to-Energy",
    secondary: "All projects",
    panelLabel: "Featured work",
    panelTitle: "Waste-to-Energy and Sustainability in Europe",
    panelText:
      "The strongest and most ambitious project at the moment is this multilingual data visualization site about European waste systems and broader sustainability patterns.",
    panelMeta: [
      ["Format", "Interactive web project"],
      ["Focus", "Waste systems, energy, sustainability"]
    ],
    worksEyebrow: "Selection",
    worksTitle: "Selected work",
    open: "Open",
    openStandalone: "Open standalone",
    backToHub: "Back to hub",
    infoLabel: "Details",
    stackLabel: "Stack",
    runtimeLabel: "Loading",
    lazyRuntime: "Loaded only when this view is opened",
    webglRuntime: "WebGL initializes only after launch",
    loadingLabel: "Lazy launch",
    loadingText: "This app is mounted as a separate view, so the hub keeps its initial payload light.",
    footer: ["Róbert Szakács", "Project portfolio"]
  },
  ro: {
    lang: "ro",
    nav: ["Acasă", "Lucrări"],
    eyebrow: "Portofoliu de proiecte",
    title: "Proiectele digitale ale lui Róbert Szakács într-un singur loc.",
    lead:
      "Această pagină-rădăcină funcționează acum ca punct real de intrare în portofoliu: de aici poți deschide fiecare proiect, fie că este vorba de vizualizare de date, pagină analitică sau joc personal.",
    primary: "Deschide Waste-to-Energy",
    secondary: "Toate proiectele",
    panelLabel: "Lucrare evidențiată",
    panelTitle: "Waste-to-Energy and Sustainability in Europe",
    panelText:
      "Cel mai puternic și mai amplu proiect în acest moment este acest site multilingv de vizualizare a datelor despre sistemele europene de deșeuri și legăturile lor cu sustenabilitatea.",
    panelMeta: [
      ["Format", "Proiect web interactiv"],
      ["Focus", "Deșeuri, energie, sustenabilitate"]
    ],
    worksEyebrow: "Selecție",
    worksTitle: "Lucrări selectate",
    open: "Deschide",
    openStandalone: "Deschide separat",
    backToHub: "Înapoi la hub",
    infoLabel: "Detalii",
    stackLabel: "Stack",
    runtimeLabel: "Încărcare",
    lazyRuntime: "Se încarcă doar când deschizi această vedere",
    webglRuntime: "WebGL se inițializează doar după deschidere",
    loadingLabel: "Lazy launch",
    loadingText: "Aplicația se montează separat, astfel shell-ul hubului rămâne ușor la prima încărcare.",
    footer: ["Róbert Szakács", "Portofoliu de proiecte"]
  }
};

function getRouteSlug() {
  if (typeof window === "undefined") {
    return null;
  }

  const match = window.location.hash.match(/^#apps\/([^/]+)$/);
  return match?.[1] || null;
}

function preloadHubAppView() {
  return import("./components/HubAppView.jsx");
}

function AppCard({ app, copy, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className={`project-card project-card--${app.accent}`}>
      <div className="project-card__top">
        <div className="project-card__meta">
          <span className="project-tag">{app.kind[copy.lang]}</span>
          <span className="project-year">{app.year}</span>
        </div>
        <button
          type="button"
          className={`project-card__info ${isOpen ? "project-card__info--active" : ""}`}
          aria-label={copy.infoLabel}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          i
        </button>
        <h3>{app.title}</h3>
        <p>{app.description[copy.lang]}</p>
      </div>
      {isOpen ? (
        <div className="project-card__details">
          {app.details[copy.lang].map((detail) => (
            <p key={detail}>{detail}</p>
          ))}
        </div>
      ) : null}
      <ul className="project-points">
        {app.highlights[copy.lang].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button
        className="button button-primary wide"
        type="button"
        onClick={() => onOpen(app.slug)}
        onMouseEnter={preloadHubAppView}
        onFocus={preloadHubAppView}
      >
        {copy.open}
      </button>
    </article>
  );
}

export default function App() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("portfolio-root-language") || "hu"
  );
  const [activeSlug, setActiveSlug] = useState(() => getRouteSlug());
  const copy = useMemo(() => COPY[language] || COPY.hu, [language]);
  const activeApp = useMemo(
    () => APPS.find((app) => app.slug === activeSlug) || null,
    [activeSlug]
  );

  useEffect(() => {
    document.documentElement.lang = copy.lang;
    document.title = activeApp
      ? `${activeApp.title} | Hub`
      : language === "hu"
        ? "Szakács Róbert | Projektportfólió"
        : language === "ro"
          ? "Róbert Szakács | Portofoliu"
          : "Róbert Szakács | Project Portfolio";
    localStorage.setItem("portfolio-root-language", language);
  }, [activeApp, copy.lang, language]);

  useEffect(() => {
    const syncRoute = () => setActiveSlug(getRouteSlug());

    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  function openApp(slug) {
    window.location.hash = `apps/${slug}`;
  }

  function closeApp() {
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    setActiveSlug(null);
  }

  return (
    <>
      <div className="shell-bg" aria-hidden="true"></div>
      <header className="site-header">
        <div className="brand">SR</div>
        <nav className="site-nav">
          <a href="#top">{copy.nav[0]}</a>
          <a href="#work">{copy.nav[1]}</a>
        </nav>
        <div className="language-switcher" aria-label="Language switcher">
          <button
            className={`lang-btn ${language === "hu" ? "active" : ""}`}
            type="button"
            onClick={() => setLanguage("hu")}
          >
            HU
          </button>
          <button
            className={`lang-btn ${language === "en" ? "active" : ""}`}
            type="button"
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            className={`lang-btn ${language === "ro" ? "active" : ""}`}
            type="button"
            onClick={() => setLanguage("ro")}
          >
            RO
          </button>
        </div>
      </header>

      <main>
        {activeApp ? (
          <Suspense fallback={<section className="panel app-view app-view--fallback"></section>}>
            <HubAppView app={activeApp} copy={copy} onBack={closeApp} />
          </Suspense>
        ) : (
          <>
            <section className="hero" id="top">
              <div className="hero-copy">
                <p className="eyebrow">{copy.eyebrow}</p>
                <div className="hero-heading">
                  <img className="hero-portrait" src={robiPortrait} alt="Róbert Szakács portrait" />
                  <h1>{copy.title}</h1>
                </div>
                <p className="lead">{copy.lead}</p>
                <div className="hero-actions">
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => openApp(APPS[0].slug)}
                    onMouseEnter={preloadHubAppView}
                    onFocus={preloadHubAppView}
                  >
                    {copy.primary}
                  </button>
                  <a className="button button-secondary" href="#work">
                    {copy.secondary}
                  </a>
                </div>
              </div>

              <aside className="hero-card">
                <p className="card-label">{copy.panelLabel}</p>
                <h2>{copy.panelTitle}</h2>
                <p>{copy.panelText}</p>
                <div className="spotlight-meta">
                  {copy.panelMeta.map(([label, value]) => (
                    <div className="spotlight-meta__row" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <button
                  className="button button-primary wide"
                  type="button"
                  onClick={() => openApp(APPS[0].slug)}
                  onMouseEnter={preloadHubAppView}
                  onFocus={preloadHubAppView}
                >
                  {copy.primary}
                </button>
              </aside>
            </section>

            <section className="panel project-panel" id="work">
              <div className="section-heading">
                <p className="eyebrow">{copy.worksEyebrow}</p>
                <h2>{copy.worksTitle}</h2>
              </div>
              <div className="project-cards">
                {APPS.map((app) => (
                  <AppCard key={app.slug} app={app} copy={copy} onOpen={openApp} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <p>{copy.footer[0]}</p>
        <p>{copy.footer[1]}</p>
      </footer>
    </>
  );
}
